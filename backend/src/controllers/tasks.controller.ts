import type { Request, Response } from "express";
import { auditEntityMutation } from "../services/audit.service.js";
import {
  cancelTask,
  createTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../services/tasks.service.js";

function routeId(request: Request) {
  return String(request.params.id);
}

export async function indexTasks(_request: Request, response: Response) {
  response.json({ ok: true, tasks: await listTasks() });
}

export async function showTask(request: Request, response: Response) {
  response.json({ ok: true, task: await getTaskById(routeId(request)) });
}

export async function storeTask(request: Request, response: Response) {
  const task = await createTask(request.body);
  await auditEntityMutation(request, "TASK_CREATED", "TASK", task);

  response.status(201).json({ ok: true, task });
}

export async function putTask(request: Request, response: Response) {
  const task = await updateTask(routeId(request), request.body);
  await auditEntityMutation(request, "TASK_UPDATED", "TASK", task);

  response.json({ ok: true, task });
}

export async function destroyTask(request: Request, response: Response) {
  const task = await cancelTask(routeId(request));
  await auditEntityMutation(request, "TASK_ARCHIVED", "TASK", task);

  response.json({ ok: true, task });
}
