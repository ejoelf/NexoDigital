import type { ErrorRequestHandler } from "express";
import { HttpError } from "../common/http-error.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      ok: false,
      message: error.message,
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    ok: false,
    message: "Internal server error",
  });
};
