import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
