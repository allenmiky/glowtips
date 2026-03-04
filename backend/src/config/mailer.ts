import nodemailer from "nodemailer";
import { env } from "./env.js";

export const mailer = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

export const mailFrom = env.SMTP_FROM ?? env.SMTP_USER;
