import { TaskPriority, TaskStatus } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  ensureClientExists,
  ensureClientProjectConsistency,
  ensureProjectExists,
} from "../common/relations.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import { parseOptionalEnum } from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type TaskInput = {
  title?: unknown;
  description?: unknown;
  status?: unknown;
  priority?: unknown;
  dueDate?: unknown;
  clientId?: unknown;
  projectId?: unknown;
};

const TASK_INCLUDE = {
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
} as const;

async function validateRelations(clientId?: string, projectId?: string) {
  await ensureClientExists(clientId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);
}

// Al marcar una tarea como hecha se guarda la fecha; si se reabre, se limpia.
function completedAtFor(status: TaskStatus | undefined) {
  if (status === undefined) return undefined;
  return status === TaskStatus.DONE ? new Date() : null;
}

export async function listTasks() {
  return prisma.task.findMany({
    include: TASK_INCLUDE,
    orderBy: [{ status: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }],
  });
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({ where: { id }, include: TASK_INCLUDE });

  if (!task) {
    throw new HttpError(404, "Task not found.");
  }

  return task;
}

export async function createTask(input: TaskInput) {
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);
  await validateRelations(clientId, projectId);

  const status = parseOptionalEnum(input.status, TaskStatus, "status") ?? TaskStatus.PENDING;

  return prisma.task.create({
    data: {
      title: toRequiredString(input.title, "title"),
      description: toOptionalString(input.description),
      status,
      priority:
        parseOptionalEnum(input.priority, TaskPriority, "priority") ?? TaskPriority.MEDIUM,
      dueDate: toOptionalDate(input.dueDate, "dueDate"),
      completedAt: status === TaskStatus.DONE ? new Date() : undefined,
      clientId,
      projectId,
    },
    include: TASK_INCLUDE,
  });
}

export async function updateTask(id: string, input: TaskInput) {
  const existing = await getTaskById(id);
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
  );

  const status = parseOptionalEnum(input.status, TaskStatus, "status");
  const statusChanged = status !== undefined && status !== existing.status;

  return prisma.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: toRequiredString(input.title, "title") } : {}),
      ...(input.description !== undefined
        ? { description: toOptionalString(input.description) ?? null }
        : {}),
      ...(status !== undefined ? { status } : {}),
      ...(statusChanged ? { completedAt: completedAtFor(status) } : {}),
      ...(input.priority !== undefined
        ? { priority: parseOptionalEnum(input.priority, TaskPriority, "priority") }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: toOptionalDate(input.dueDate, "dueDate") ?? null }
        : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
    },
    include: TASK_INCLUDE,
  });
}

// Borrado lógico: la tarea queda cancelada.
export async function cancelTask(id: string) {
  await getTaskById(id);

  return prisma.task.update({
    where: { id },
    data: { status: TaskStatus.CANCELLED },
    include: TASK_INCLUDE,
  });
}
