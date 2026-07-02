import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyWork,
  indexWorks,
  putWork,
  showWork,
  storeWork,
} from "../controllers/works.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const worksRouter = Router();

worksRouter.use(requireAuth);

worksRouter.get("/", indexWorks);
worksRouter.get("/:id", showWork);
worksRouter.post("/", requireRole([UserRole.ADMIN, UserRole.MEMBER]), storeWork);
worksRouter.put("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), putWork);
worksRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyWork,
);
