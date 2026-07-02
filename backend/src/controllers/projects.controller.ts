import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  closeProject,
  createProject,
  getProjectById,
  listProjects,
  updateProject,
} from "../services/projects.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexProjects(_request: Request, response: Response) {
  response.json({
    ok: true,
    projects: await listProjects(),
  });
}

export async function showProject(request: Request, response: Response) {
  response.json({
    ok: true,
    project: await getProjectById(routeId(request)),
  });
}

export async function storeProject(request: Request, response: Response) {
  const project = await createProject(request.body);
  await auditEntityMutation(request, "PROJECT_CREATED", "PROJECT", project);

  response.status(201).json({
    ok: true,
    project,
  });
}

export async function putProject(request: Request, response: Response) {
  const project = await updateProject(routeId(request), request.body);
  await auditEntityMutation(request, "PROJECT_UPDATED", "PROJECT", project);

  response.json({
    ok: true,
    project,
  });
}

export async function destroyProject(request: Request, response: Response) {
  const project = await closeProject(routeId(request));
  await auditEntityMutation(request, "PROJECT_ARCHIVED", "PROJECT", project);

  response.json({
    ok: true,
    project,
  });
}
