import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "./error-handler.js";
import { verifyAccessToken } from "../../modules/auth/jwt.js";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
    role: "creator" | "admin";
    creatorId?: string;
  };
};

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED));
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      creatorId: payload.creatorId
    };
    next();
  } catch {
    next(new AppError("Invalid token", StatusCodes.UNAUTHORIZED));
  }
}

export function requireRole(role: "creator" | "admin") {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.auth || req.auth.role !== role) {
      next(new AppError("Forbidden", StatusCodes.FORBIDDEN));
      return;
    }
    next();
  };
}