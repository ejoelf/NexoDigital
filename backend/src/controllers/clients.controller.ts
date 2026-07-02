import type { Request, Response } from "express";
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
  response.status(201).json({
    ok: true,
    client: await createClient(request.body),
  });
}

export async function putClient(request: Request, response: Response) {
  response.json({
    ok: true,
    client: await updateClient(routeId(request), request.body),
  });
}

export async function destroyClient(request: Request, response: Response) {
  response.json({
    ok: true,
    client: await deactivateClient(routeId(request)),
  });
}
