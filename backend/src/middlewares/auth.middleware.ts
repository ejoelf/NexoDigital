import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/token.service.js";

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    response.status(401).json({
      ok: false,
      message: "Missing bearer token.",
    });
    return;
  }

  try {
    request.user = verifyAccessToken(authHeader.slice("Bearer ".length));
    next();
  } catch {
    response.status(401).json({
      ok: false,
      message: "Invalid or expired token.",
    });
  }
}
