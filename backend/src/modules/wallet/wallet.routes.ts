import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { AuthenticatedRequest, requireAuth, requireRole } from "../../common/middleware/auth.js";
import { ok } from "../../common/utils/response.js";

export const walletRouter = Router();

walletRouter.get("/", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creatorId = req.auth!.creatorId!;

    const [entries, tips] = await Promise.all([
      prisma.ledgerEntry.findMany({ where: { creatorId }, orderBy: { createdAt: "desc" }, take: 50 }),
      prisma.tip.findMany({ where: { creatorId, status: "CONFIRMED" }, orderBy: { createdAt: "desc" }, take: 20 })
    ]);

    const balance = entries.reduce((acc, entry) => {
      const amount = Number(entry.amount);
      return entry.type === "CREDIT" ? acc + amount : acc - amount;
    }, 0);

    const feeRate = 0.05;
    const gross = tips.reduce((sum, tip) => sum + Number(tip.amount), 0);
    const fee = gross * feeRate;
    const net = gross - fee;

    ok(res, {
      balance,
      feeBreakdown: {
        gross,
        platformFeeRate: feeRate,
        platformFee: fee,
        net
      },
      entries
    });
  } catch (error) {
    next(error);
  }
});