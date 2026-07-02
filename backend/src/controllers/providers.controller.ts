import type { Request, Response } from "express";
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
  response.status(201).json({
    ok: true,
    provider: await createProvider(request.body),
  });
}

export async function putProvider(request: Request, response: Response) {
  response.json({
    ok: true,
    provider: await updateProvider(routeId(request), request.body),
  });
}

export async function destroyProvider(request: Request, response: Response) {
  response.json({
    ok: true,
    provider: await archiveProvider(routeId(request)),
  });
}
