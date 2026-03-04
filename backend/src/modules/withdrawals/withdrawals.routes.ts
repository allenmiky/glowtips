import { Router } from "express";
import { z } from "zod";
import { AuthenticatedRequest, requireAuth, requireRole } from "../../common/middleware/auth.js";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { AppError } from "../../common/middleware/error-handler.js";

const requestWithdrawalSchema = z.object({
  amount: z.number().min(1)
});

const updateWithdrawalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PAID"])
});

export const withdrawalsRouter = Router();

withdrawalsRouter.post("/", requireAuth, requireRole("creator"), validate(requestWithdrawalSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creatorId = req.auth!.creatorId!;
    const entries = await prisma.ledgerEntry.findMany({ where: { creatorId } });
    const balance = entries.reduce((acc, entry) => {
      const amount = Number(entry.amount);
      return entry.type === "CREDIT" ? acc + amount : acc - amount;
    }, 0);

    if (balance < req.body.amount) {
      throw new AppError("Insufficient balance", 400);
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      const created = await tx.withdrawal.create({
        data: {
          creatorId,
          amount: req.body.amount,
          status: "PENDING"
        }
      });

      await tx.ledgerEntry.create({
        data: {
          creatorId,
          type: "DEBIT",
          amount: req.body.amount,
          referenceId: created.id
        }
      });

      return created;
    });

    ok(res, withdrawal);
  } catch (error) {
    next(error);
  }
});

withdrawalsRouter.get("/", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const history = await prisma.withdrawal.findMany({
      where: { creatorId: req.auth!.creatorId! },
      orderBy: { requestedAt: "desc" }
    });
    ok(res, history);
  } catch (error) {
    next(error);
  }
});

withdrawalsRouter.patch("/:id/status", requireAuth, requireRole("admin"), validate(updateWithdrawalSchema), async (req, res, next) => {
  try {
    const updated = await prisma.withdrawal.update({
      where: { id: req.params.id },
      data: {
        status: req.body.status,
        processedAt: req.body.status === "PAID" ? new Date() : null
      }
    });
    ok(res, updated);
  } catch (error) {
    next(error);
  }
});