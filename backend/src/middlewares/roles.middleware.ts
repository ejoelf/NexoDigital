import type { UserRole } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

export function requireRole(allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      response.status(401).json({
        ok: false,
        message: "Unauthorized.",
      });
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      response.status(403).json({
        ok: false,
        message: "Forbidden.",
      });
      return;
    }

    next();
  };
}
