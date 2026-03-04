import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { AuthenticatedRequest, requireAuth, requireRole } from "../../common/middleware/auth.js";

const updateCreatorSchema = z.object({
  displayName: z.string().min(2).max(40),
  avatarUrl: z.string().url().optional(),
  goalAmount: z.number().min(0).max(1000000)
});

export const creatorsRouter = Router();

creatorsRouter.get("/public/:username", async (req, res, next) => {
  try {
    const creator = await prisma.creator.findUnique({
      where: { username: req.params.username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        goalAmount: true,
        goalRaised: true
      }
    });
    ok(res, creator);
  } catch (error) {
    next(error);
  }
});

creatorsRouter.get("/me", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creator = await prisma.creator.findUnique({ where: { id: req.auth!.creatorId! } });
    ok(res, creator);
  } catch (error) {
    next(error);
  }
});

creatorsRouter.put("/me", requireAuth, requireRole("creator"), validate(updateCreatorSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creator = await prisma.creator.update({
      where: { id: req.auth!.creatorId! },
      data: {
        displayName: req.body.displayName,
        avatarUrl: req.body.avatarUrl,
        goalAmount: req.body.goalAmount
      }
    });
    ok(res, creator);
  } catch (error) {
    next(error);
  }
});