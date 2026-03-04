import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { antiSpamFilter } from "../../common/middleware/anti-spam.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { AppError } from "../../common/middleware/error-handler.js";
import { emitTipConfirmed } from "../alerts/alerts.socket.js";

const createPaymentIntentSchema = z.object({
  creatorId: z.string().cuid(),
  supporterName: z.string().min(2).max(30),
  amount: z.number().min(1).max(10000),
  message: z.string().max(280).optional(),
  idempotencyKey: z.string().min(8)
});

const confirmTipSchema = z.object({
  tipId: z.string().cuid(),
  providerRef: z.string().min(4)
});

const webhookSchema = z.object({
  tipId: z.string().cuid(),
  status: z.enum(["confirmed", "failed"]),
  providerRef: z.string().min(4)
});

export const tipsRouter = Router();

async function confirmTip(tipId: string, providerRef: string): Promise<{ tipId: string; alreadyConfirmed: boolean }> {
  const tip = await prisma.tip.findUnique({ where: { id: tipId } });
  if (!tip) {
    throw new AppError("Tip not found", 404);
  }

  if (tip.status === "CONFIRMED") {
    return { tipId, alreadyConfirmed: true };
  }

  await prisma.$transaction(async (tx) => {
    await tx.tip.update({ where: { id: tipId }, data: { status: "CONFIRMED" } });
    await tx.transaction.upsert({
      where: { tipId },
      update: { providerRef, status: "CONFIRMED" },
      create: { tipId, providerRef, status: "CONFIRMED" }
    });
    await tx.ledgerEntry.create({
      data: {
        creatorId: tip.creatorId,
        type: "CREDIT",
        amount: tip.amount,
        referenceId: tip.id
      }
    });
  });

  emitTipConfirmed({
    creatorId: tip.creatorId,
    amount: Number(tip.amount),
    supporterName: tip.supporterName,
    message: tip.message,
    tipId: tip.id,
    createdAt: tip.createdAt.toISOString()
  });

  return { tipId, alreadyConfirmed: false };
}

tipsRouter.post("/payment-intent", antiSpamFilter, validate(createPaymentIntentSchema), async (req, res, next) => {
  try {
    const { creatorId, supporterName, amount, message, idempotencyKey } = req.body;

    const existing = await prisma.tip.findUnique({ where: { idempotencyKey } });
    if (existing) {
      ok(res, { tipId: existing.id, status: existing.status, idempotent: true });
      return;
    }

    const creator = await prisma.creator.findUnique({ where: { id: creatorId }, select: { id: true } });
    if (!creator) {
      throw new AppError("Creator not found", 404);
    }

    const tip = await prisma.tip.create({
      data: {
        creatorId,
        supporterName,
        amount,
        message,
        idempotencyKey,
        status: "PENDING"
      }
    });

    const transaction = await prisma.transaction.create({
      data: {
        tipId: tip.id,
        providerRef: `mock_${tip.id.slice(-8)}`,
        status: "PENDING"
      }
    });

    ok(res, {
      tipId: tip.id,
      paymentIntent: transaction.providerRef,
      status: tip.status
    });
  } catch (error) {
    next(error);
  }
});

tipsRouter.post("/confirm", validate(confirmTipSchema), async (req, res, next) => {
  try {
    const { tipId, providerRef } = req.body;
    const result = await confirmTip(tipId, providerRef);
    ok(res, { tipId, status: "CONFIRMED", alreadyConfirmed: result.alreadyConfirmed });
  } catch (error) {
    next(error);
  }
});

tipsRouter.post("/webhook/mock", validate(webhookSchema), async (req, res, next) => {
  try {
    if (req.body.status === "confirmed") {
      await confirmTip(req.body.tipId, req.body.providerRef);
      ok(res, { status: "CONFIRMED" });
      return;
    }

    await prisma.tip.update({ where: { id: req.body.tipId }, data: { status: "FAILED" } });
    await prisma.transaction.upsert({
      where: { tipId: req.body.tipId },
      update: { providerRef: req.body.providerRef, status: "FAILED" },
      create: { tipId: req.body.tipId, providerRef: req.body.providerRef, status: "FAILED" }
    });
    ok(res, { status: "FAILED" });
  } catch (error) {
    next(error);
  }
});
