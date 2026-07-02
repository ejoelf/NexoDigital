import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  cancelRenewal,
  createRenewal,
  getRenewalById,
  listRenewals,
  updateRenewal,
} from "../services/renewals.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexRenewals(_request: Request, response: Response) {
  response.json({ ok: true, renewals: await listRenewals() });
}

export async function showRenewal(request: Request, response: Response) {
  response.json({ ok: true, renewal: await getRenewalById(routeId(request)) });
}

export async function storeRenewal(request: Request, response: Response) {
  const renewal = await createRenewal(request.body);
  await auditEntityMutation(request, "RENEWAL_CREATED", "RENEWAL", renewal);

  response.status(201).json({
    ok: true,
    renewal,
  });
}

export async function putRenewal(request: Request, response: Response) {
  const renewal = await updateRenewal(routeId(request), request.body);
  await auditEntityMutation(request, "RENEWAL_UPDATED", "RENEWAL", renewal);

  response.json({
    ok: true,
    renewal,
  });
}

export async function destroyRenewal(request: Request, response: Response) {
  const renewal = await cancelRenewal(routeId(request));
  await auditEntityMutation(request, "RENEWAL_ARCHIVED", "RENEWAL", renewal);

  response.json({
    ok: true,
    renewal,
  });
}
