import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { authRouter } from "./routes/auth.routes.js";
import { clientsRouter } from "./routes/clients.routes.js";
import { costsRouter } from "./routes/costs.routes.js";
import { domainsRouter } from "./routes/domains.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { providersRouter } from "./routes/providers.routes.js";
import { publicRouter } from "./routes/public.routes.js";
import { renewalsRouter } from "./routes/renewals.routes.js";
import { subscriptionsRouter } from "./routes/subscriptions.routes.js";
import { worksRouter } from "./routes/works.routes.js";
import { notFound } from "./middlewares/not-found.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export function createApp() {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use("/health", healthRouter);
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/clients", clientsRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/works", worksRouter);
  app.use("/api/providers", providersRouter);
  app.use("/api/subscriptions", subscriptionsRouter);
  app.use("/api/domains", domainsRouter);
  app.use("/api/renewals", renewalsRouter);
  app.use("/api/costs", costsRouter);
  app.use("/api/public", publicRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
