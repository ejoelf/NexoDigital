import { UserRole } from "@prisma/client";
import { Router } from "express";
import {
  indexAuditLogs,
  showAuditLog,
} from "../controllers/audit-logs.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/roles.middleware.js";

export const auditLogsRouter = Router();

auditLogsRouter.use(requireAuth);
auditLogsRouter.use(requireRole([UserRole.ADMIN]));

auditLogsRouter.get("/", indexAuditLogs);
auditLogsRouter.get("/:id", showAuditLog);
