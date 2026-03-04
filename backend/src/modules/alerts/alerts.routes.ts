import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, AuthenticatedRequest } from "../../common/middleware/auth.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { prisma } from "../../config/prisma.js";
import { emitTipConfirmed } from "./alerts.socket.js";

const testAlertSchema = z.object({
  supporterName: z.string().min(2).max(30).default("Test Supporter"),
  amount: z.number().min(1).max(9999),
  message: z.string().max(280).optional()
});

const updateAlertSettingsSchema = z.object({
  layout: z.string().min(3).max(40).optional(),
  soundEnabled: z.boolean().optional(),
  durationMs: z.number().int().min(1000).max(30000).optional(),
  volume: z.number().int().min(0).max(100).optional(),
  imageLayout: z.string().optional(),
  animation: z.string().optional(),
  fontStyle: z.string().optional(),
  messageTTS: z.boolean().optional(),
  nameAmountTTS: z.boolean().optional(),
  minAmount: z.number().min(0).optional(),
  maxMessageLength: z.number().int().min(1).max(500).optional(),
  filterProfanity: z.boolean().optional(),
  priorityLevel: z.number().int().min(1).max(10).optional(),
  soundUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable()
});

export const alertsRouter = Router();

alertsRouter.post("/test", requireAuth, requireRole("creator"), validate(testAlertSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    emitTipConfirmed({
      creatorId: req.auth!.creatorId!,
      supporterName: req.body.supporterName,
      amount: req.body.amount,
      message: req.body.message,
      tipId: "test-tip",
      createdAt: new Date().toISOString()
    });
    ok(res, { sent: true });
  } catch (error) {
    next(error);
  }
});

alertsRouter.get("/settings", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const settings = await prisma.alertSetting.findUnique({ where: { creatorId: req.auth!.creatorId! } });
    ok(res, settings);
  } catch (error) {
    next(error);
  }
});

alertsRouter.put("/settings", requireAuth, requireRole("creator"), validate(updateAlertSettingsSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const updated = await prisma.alertSetting.upsert({
      where: { creatorId: req.auth!.creatorId! },
      update: req.body,
      create: {
        creatorId: req.auth!.creatorId!,
        ...req.body
      }
    });
    ok(res, updated);
  } catch (error) {
    next(error);
  }
});
