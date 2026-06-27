import type { Request, Response } from "express";

export function notFound(request: Request, response: Response) {
  response.status(404).json({
    ok: false,
    message: `Route ${request.method} ${request.originalUrl} not found`,
  });
}
