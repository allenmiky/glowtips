import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { validate } from "../../common/middleware/validate.js";
import { ok } from "../../common/utils/response.js";
import { AppError } from "../../common/middleware/error-handler.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt.js";
import { env } from "../../config/env.js";
import { mailer, mailFrom } from "../../config/mailer.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(24).regex(/^[a-z0-9_]+$/),
  displayName: z.string().min(2).max(40)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, username, displayName } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const takenUsername = await prisma.creator.findUnique({ where: { username } });
    if (takenUsername) {
      throw new AppError("Username already taken", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "CREATOR",
        creator: {
          create: {
            username,
            displayName,
            goalAmount: 0,
            goalRaised: 0
          }
        }
      },
      include: { creator: true }
    });

    const payload = {
      sub: user.id,
      role: "creator" as const,
      creatorId: user.creator?.id
    };

    ok(res, {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
      user: {
        id: user.id,
        email: user.email,
        role: "creator",
        creatorId: user.creator?.id
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email }, include: { creator: true } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const payload = {
      sub: user.id,
      role: user.role === "ADMIN" ? "admin" : "creator" as const,
      creatorId: user.creator?.id
    };

    ok(res, {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
      user: {
        id: user.id,
        email: user.email,
        role: payload.role,
        creatorId: user.creator?.id
      }
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", validate(refreshSchema), (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const payload = verifyRefreshToken(refreshToken);
    ok(res, {
      accessToken: signAccessToken(payload)
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/forgot-password", validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

      await prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id
        }
      });

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt
        }
      });

      const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${rawToken}`;
      await mailer.sendMail({
        from: mailFrom,
        to: user.email,
        subject: "Reset your GlowTips password",
        text: `Reset your password using this link: ${resetUrl}. This link expires in 30 minutes.`
      });
    }

    ok(res, { message: "If this email exists, a password reset link has been sent." });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash }
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash }
      });

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() }
      });
    });

    ok(res, { message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
});
