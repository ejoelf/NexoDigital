import type { Request, Response } from "express";
import { getAuditLogById, listAuditLogs } from "../services/audit.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexAuditLogs(request: Request, response: Response) {
  response.json({
    ok: true,
    auditLogs: await listAuditLogs(request.query),
  });
}

export async function showAuditLog(request: Request, response: Response) {
  response.json({
    ok: true,
    auditLog: await getAuditLogById(routeId(request)),
  });
}
