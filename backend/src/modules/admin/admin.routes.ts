import { Router } from "express";
import { requireAuth, requireRole } from "../../common/middleware/auth.js";
import { prisma } from "../../config/prisma.js";
import { ok } from "../../common/utils/response.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/creators", async (_req, res, next) => {
  try {
    const creators = await prisma.creator.findMany({
      include: { user: { select: { email: true, role: true } } },
      take: 100,
      orderBy: { createdAt: "desc" }
    });
    ok(res, creators);
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/transactions", async (_req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      take: 200,
      orderBy: { createdAt: "desc" }
    });
    ok(res, transactions);
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/creators/:id/flag", async (req, res, next) => {
  try {
    // Placeholder for suspicious activity workflows.
    ok(res, { creatorId: req.params.id, flagged: true, reason: "manual_review" });
  } catch (error) {
    next(error);
  }
});