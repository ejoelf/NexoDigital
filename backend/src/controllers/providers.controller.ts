import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  archiveProvider,
  createProvider,
  getProviderById,
  listProviders,
  updateProvider,
} from "../services/providers.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexProviders(_request: Request, response: Response) {
  response.json({ ok: true, providers: await listProviders() });
}

export async function showProvider(request: Request, response: Response) {
  response.json({ ok: true, provider: await getProviderById(routeId(request)) });
}

export async function storeProvider(request: Request, response: Response) {
  const provider = await createProvider(request.body);
  await auditEntityMutation(request, "PROVIDER_CREATED", "PROVIDER", provider);

  response.status(201).json({
    ok: true,
    provider,
  });
}

export async function putProvider(request: Request, response: Response) {
  const provider = await updateProvider(routeId(request), request.body);
  await auditEntityMutation(request, "PROVIDER_UPDATED", "PROVIDER", provider);

  response.json({
    ok: true,
    provider,
  });
}

export async function destroyProvider(request: Request, response: Response) {
  const provider = await archiveProvider(routeId(request));
  await auditEntityMutation(request, "PROVIDER_ARCHIVED", "PROVIDER", provider);

  response.json({
    ok: true,
    provider,
  });
}
