import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyCost,
  indexCosts,
  putCost,
  showCost,
  storeCost,
} from "../controllers/costs.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const costsRouter = Router();

costsRouter.use(requireAuth);

costsRouter.get("/", indexCosts);
costsRouter.get("/:id", showCost);
costsRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeCost,
);
costsRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putCost,
);
costsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyCost,
);
