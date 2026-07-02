import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  archiveCost,
  createCost,
  getCostById,
  listCosts,
  updateCost,
} from "../services/costs.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexCosts(_request: Request, response: Response) {
  response.json({ ok: true, costs: await listCosts() });
}

export async function showCost(request: Request, response: Response) {
  response.json({ ok: true, cost: await getCostById(routeId(request)) });
}

export async function storeCost(request: Request, response: Response) {
  const cost = await createCost(request.body);
  await auditEntityMutation(request, "COST_CREATED", "COST", cost);

  response.status(201).json({
    ok: true,
    cost,
  });
}

export async function putCost(request: Request, response: Response) {
  const cost = await updateCost(routeId(request), request.body);
  await auditEntityMutation(request, "COST_UPDATED", "COST", cost);

  response.json({
    ok: true,
    cost,
  });
}

export async function destroyCost(request: Request, response: Response) {
  const cost = await archiveCost(routeId(request));
  await auditEntityMutation(request, "COST_ARCHIVED", "COST", cost);

  response.json({
    ok: true,
    cost,
  });
}
