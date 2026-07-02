import type { Request, Response } from "express";
import {
  archiveWork,
  createWork,
  getWorkById,
  listPublicWorks,
  listWorks,
  updateWork,
} from "../services/works.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexWorks(_request: Request, response: Response) {
  response.json({
    ok: true,
    works: await listWorks(),
  });
}

export async function indexPublicWorks(_request: Request, response: Response) {
  response.json({
    ok: true,
    works: await listPublicWorks(),
  });
}

export async function showWork(request: Request, response: Response) {
  response.json({
    ok: true,
    work: await getWorkById(routeId(request)),
  });
}

export async function storeWork(request: Request, response: Response) {
  response.status(201).json({
    ok: true,
    work: await createWork(request.body),
  });
}

export async function putWork(request: Request, response: Response) {
  response.json({
    ok: true,
    work: await updateWork(routeId(request), request.body),
  });
}

export async function destroyWork(request: Request, response: Response) {
  response.json({
    ok: true,
    work: await archiveWork(routeId(request)),
  });
}
