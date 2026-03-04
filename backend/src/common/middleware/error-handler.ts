import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = StatusCodes.BAD_REQUEST, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details ?? null
      }
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: "Internal server error"
    }
  });
}