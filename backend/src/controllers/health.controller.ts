import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response) {
  response.json({
    ok: true,
    service: "nexodigital-crm-backend",
    timestamp: new Date().toISOString(),
  });
}
