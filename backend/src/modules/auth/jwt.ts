import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export type AuthTokenPayload = {
  sub: string;
  role: "creator" | "admin";
  creatorId?: string;
};

export function signAccessToken(payload: AuthTokenPayload): string {
  // Fix 1: Type assertion for secret
  const secret = env.JWT_ACCESS_SECRET as string;
  // Fix 2: Type assertion for options
  const options = { expiresIn: env.JWT_ACCESS_TTL } as jwt.SignOptions;
  
  return jwt.sign(payload, secret, options);
}

export function signRefreshToken(payload: AuthTokenPayload): string {
  const secret = env.JWT_REFRESH_SECRET as string;
  const options = { expiresIn: env.JWT_REFRESH_TTL } as jwt.SignOptions;
  
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const secret = env.JWT_ACCESS_SECRET as string;
  return jwt.verify(token, secret) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): AuthTokenPayload {
  const secret = env.JWT_REFRESH_SECRET as string;
  return jwt.verify(token, secret) as AuthTokenPayload;
}