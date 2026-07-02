import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  createClient,
  deactivateClient,
  getClientById,
  listClients,
  updateClient,
} from "../services/clients.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexClients(_request: Request, response: Response) {
  response.json({
    ok: true,
    clients: await listClients(),
  });
}

export async function showClient(request: Request, response: Response) {
  response.json({
    ok: true,
    client: await getClientById(routeId(request)),
  });
}

export async function storeClient(request: Request, response: Response) {
  const client = await createClient(request.body);
  await auditEntityMutation(request, "CLIENT_CREATED", "CLIENT", client);

  response.status(201).json({
    ok: true,
    client,
  });
}

export async function putClient(request: Request, response: Response) {
  const client = await updateClient(routeId(request), request.body);
  await auditEntityMutation(request, "CLIENT_UPDATED", "CLIENT", client);

  response.json({
    ok: true,
    client,
  });
}

export async function destroyClient(request: Request, response: Response) {
  const client = await deactivateClient(routeId(request));
  await auditEntityMutation(request, "CLIENT_ARCHIVED", "CLIENT", client);

  response.json({
    ok: true,
    client,
  });
}
