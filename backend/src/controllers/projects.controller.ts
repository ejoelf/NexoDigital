import type { Request, Response } from "express";
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
  response.status(201).json({
    ok: true,
    project: await createProject(request.body),
  });
}

export async function putProject(request: Request, response: Response) {
  response.json({
    ok: true,
    project: await updateProject(routeId(request), request.body),
  });
}

export async function destroyProject(request: Request, response: Response) {
  response.json({
    ok: true,
    project: await closeProject(routeId(request)),
  });
}
