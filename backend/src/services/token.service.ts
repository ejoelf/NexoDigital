import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/auth.js";
import { env } from "../config/env.js";

function assertJwtSecrets() {
  if (!env.jwtAccessSecret || !env.jwtRefreshSecret) {
    throw new Error(
      "JWT secrets are not configured. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.",
    );
  }
}

function signToken(
  payload: AuthTokenPayload,
  secret: string,
  expiresIn: string,
) {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
}

export function signAccessToken(payload: AuthTokenPayload) {
  assertJwtSecrets();
  return signToken(payload, env.jwtAccessSecret, env.jwtAccessExpiresIn);
}

export function signRefreshToken(payload: AuthTokenPayload) {
  assertJwtSecrets();
  return signToken(payload, env.jwtRefreshSecret, env.jwtRefreshExpiresIn);
}

export function verifyAccessToken(token: string) {
  assertJwtSecrets();
  return jwt.verify(token, env.jwtAccessSecret) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string) {
  assertJwtSecrets();
  return jwt.verify(token, env.jwtRefreshSecret) as AuthTokenPayload;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiresAt() {
  const match = env.jwtRefreshExpiresIn.match(/^(\d+)([dhm])$/);
  const fallbackDays = 7;

  if (!match) {
    return new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
  };

  return new Date(Date.now() + value * multipliers[unit as keyof typeof multipliers]);
}
