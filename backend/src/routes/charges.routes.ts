import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyCharge,
  indexCharges,
  putCharge,
  showCharge,
  storeCharge,
} from "../controllers/charges.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const chargesRouter = Router();

chargesRouter.use(requireAuth);

chargesRouter.get("/", indexCharges);
chargesRouter.get("/:id", showCharge);
chargesRouter.post("/", requireRole([UserRole.ADMIN, UserRole.MEMBER]), storeCharge);
chargesRouter.put("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), putCharge);
chargesRouter.delete("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), destroyCharge);
