import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroySubscription,
  indexSubscriptions,
  putSubscription,
  showSubscription,
  storeSubscription,
} from "../controllers/subscriptions.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const subscriptionsRouter = Router();

subscriptionsRouter.use(requireAuth);

subscriptionsRouter.get("/", indexSubscriptions);
subscriptionsRouter.get("/:id", showSubscription);
subscriptionsRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeSubscription,
);
subscriptionsRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putSubscription,
);
subscriptionsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroySubscription,
);
