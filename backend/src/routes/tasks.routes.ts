import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  destroyTask,
  indexTasks,
  putTask,
  showTask,
  storeTask,
} from "../controllers/tasks.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get("/", indexTasks);
tasksRouter.get("/:id", showTask);
tasksRouter.post("/", requireRole([UserRole.ADMIN, UserRole.MEMBER]), storeTask);
tasksRouter.put("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), putTask);
tasksRouter.delete("/:id", requireRole([UserRole.ADMIN, UserRole.MEMBER]), destroyTask);
