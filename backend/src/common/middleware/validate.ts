import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "./error-handler.js";

export function validate<T extends z.ZodTypeAny>(schema: T, source: "body" | "params" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      next(new AppError("Validation failed", 422, parsed.error.flatten()));
      return;
    }
    req[source] = parsed.data;
    next();
  };
}