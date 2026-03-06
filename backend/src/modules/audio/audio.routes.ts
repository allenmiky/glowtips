import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole, AuthenticatedRequest } from "../../common/middleware/auth.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { prisma } from "../../config/prisma.js";

const audioFileSchema = z.object({
  title: z.string().min(1).max(50),
  amount: z.number().min(0.01),
  url: z.string().url(),
  isDefault: z.boolean().optional()
});

export const audioRouter = Router();

audioRouter.get("/", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const files = await prisma.audioFile.findMany({
      where: { creatorId: req.auth!.creatorId! },
      orderBy: { createdAt: "desc" }
    });
    ok(res, files);
  } catch (error) {
    next(error);
  }
});

audioRouter.post("/", requireAuth, requireRole("creator"), validate(audioFileSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creatorId = req.auth!.creatorId!;
    
    // If isDefault is true, unset other defaults
    if (req.body.isDefault) {
      await prisma.audioFile.updateMany({
        where: { creatorId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const file = await prisma.audioFile.create({
      data: {
        creatorId,
        ...req.body
      }
    });
    ok(res, file);
  } catch (error) {
    next(error);
  }
});

audioRouter.put("/:id", requireAuth, requireRole("creator"), validate(audioFileSchema.partial()), async (req: AuthenticatedRequest, res, next) => {
  try {
    const creatorId = req.auth!.creatorId!;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const existing = await prisma.audioFile.findFirst({ where: { id, creatorId } });
    if (!existing) {
      return ok(res, { message: "Audio file not found" });
    }

    if (req.body.isDefault) {
      await prisma.audioFile.updateMany({
        where: { creatorId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.audioFile.update({
      where: { id },
      data: req.body
    });
    ok(res, updated);
  } catch (error) {
    next(error);
  }
});

audioRouter.delete("/:id", requireAuth, requireRole("creator"), async (req: AuthenticatedRequest, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const creatorId = req.auth!.creatorId!;
    const existing = await prisma.audioFile.findFirst({ where: { id, creatorId } });
    if (!existing) {
      return ok(res, { deleted: false });
    }
    await prisma.audioFile.delete({
      where: { id }
    });
    ok(res, { deleted: true });
  } catch (error) {
    next(error);
  }
});
