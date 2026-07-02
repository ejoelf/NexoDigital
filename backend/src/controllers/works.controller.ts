import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
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
  const work = await createWork(request.body);
  await auditEntityMutation(request, "WORK_CREATED", "WORK", work);

  response.status(201).json({
    ok: true,
    work,
  });
}

export async function putWork(request: Request, response: Response) {
  const work = await updateWork(routeId(request), request.body);
  await auditEntityMutation(request, "WORK_UPDATED", "WORK", work);

  response.json({
    ok: true,
    work,
  });
}

export async function destroyWork(request: Request, response: Response) {
  const work = await archiveWork(routeId(request));
  await auditEntityMutation(request, "WORK_ARCHIVED", "WORK", work);

  response.json({
    ok: true,
    work,
  });
}
