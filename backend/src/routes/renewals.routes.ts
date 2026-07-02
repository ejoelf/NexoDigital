import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyRenewal,
  indexRenewals,
  putRenewal,
  showRenewal,
  storeRenewal,
} from "../controllers/renewals.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const renewalsRouter = Router();

renewalsRouter.use(requireAuth);

renewalsRouter.get("/", indexRenewals);
renewalsRouter.get("/:id", showRenewal);
renewalsRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeRenewal,
);
renewalsRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putRenewal,
);
renewalsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyRenewal,
);
