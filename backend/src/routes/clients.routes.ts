import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyClient,
  indexClients,
  putClient,
  showClient,
  storeClient,
} from "../controllers/clients.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const clientsRouter = Router();

clientsRouter.use(requireAuth);

clientsRouter.get("/", indexClients);
clientsRouter.get("/:id", showClient);
clientsRouter.post("/", requireRole([UserRole.ADMIN, UserRole.MEMBER]), storeClient);
clientsRouter.put("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), putClient);
clientsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyClient,
);
