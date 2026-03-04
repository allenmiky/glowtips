import { Response } from "express";

export function ok<T>(res: Response, data: T): void {
  res.json({ data });
}