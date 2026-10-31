import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  cancelCharge,
  createCharge,
  getChargeById,
  listCharges,
  updateCharge,
} from "../services/charges.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexCharges(_request: Request, response: Response) {
  response.json({ ok: true, charges: await listCharges() });
}

export async function showCharge(request: Request, response: Response) {
  response.json({ ok: true, charge: await getChargeById(routeId(request)) });
}

export async function storeCharge(request: Request, response: Response) {
  const charge = await createCharge(request.body);
  await auditEntityMutation(request, "CHARGE_CREATED", "CHARGE", charge);

  response.status(201).json({ ok: true, charge });
}

export async function putCharge(request: Request, response: Response) {
  const charge = await updateCharge(routeId(request), request.body);
  await auditEntityMutation(request, "CHARGE_UPDATED", "CHARGE", charge);

  response.json({ ok: true, charge });
}

export async function destroyCharge(request: Request, response: Response) {
  const charge = await cancelCharge(routeId(request));
  await auditEntityMutation(request, "CHARGE_ARCHIVED", "CHARGE", charge);

  response.json({ ok: true, charge });
}
