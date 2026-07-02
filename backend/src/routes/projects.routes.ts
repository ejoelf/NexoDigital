import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyProject,
  indexProjects,
  putProject,
  showProject,
  storeProject,
} from "../controllers/projects.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", indexProjects);
projectsRouter.get("/:id", showProject);
projectsRouter.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  storeProject,
);
projectsRouter.put(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  putProject,
);
projectsRouter.delete(
  "/:id",
  requireRole([UserRole.ADMIN, UserRole.MEMBER]),
  destroyProject,
);
