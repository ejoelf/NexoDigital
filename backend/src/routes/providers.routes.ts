import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyProvider,
  indexProviders,
  putProvider,
  showProvider,
  storeProvider,
} from "../controllers/providers.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const providersRouter = Router();

providersRouter.use(requireAuth);

providersRouter.get("/", indexProviders);
providersRouter.get("/:id", showProvider);
providersRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeProvider,
);
providersRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putProvider,
);
providersRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyProvider,
);
