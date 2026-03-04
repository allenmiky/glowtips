import { NextFunction, Request, Response } from "express";

const blockedWords = ["http://", "https://", "discord.gg", "free money"];

export function antiSpamFilter(req: Request, _res: Response, next: NextFunction): void {
  const message = typeof req.body?.message === "string" ? req.body.message.toLowerCase() : "";
  const isBlocked = blockedWords.some((word) => message.includes(word));

  if (isBlocked) {
    req.body.message = "[Message removed by anti-spam filter]";
  }

  next();
}