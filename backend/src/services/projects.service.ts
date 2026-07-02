import { ProjectStatus, ProjectType } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  createSlug,
  toOptionalString,
  toRequiredString,
} from "../common/strings.js";
import { prisma } from "../prisma/client.js";

type ProjectInput = {
  name?: unknown;
  clientId?: unknown;
  type?: unknown;
  status?: unknown;
  description?: unknown;
  domain?: unknown;
  frontendRepositoryUrl?: unknown;
  backendRepositoryUrl?: unknown;
  frontendProviderId?: unknown;
  backendProviderId?: unknown;
  databaseProviderId?: unknown;
  startDate?: unknown;
  estimatedDeliveryDate?: unknown;
  notes?: unknown;
};

function parseProjectType(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, "type is required.");
  }

  const type = value.toUpperCase();

  if (!Object.values(ProjectType).includes(type as ProjectType)) {
    throw new HttpError(400, `Invalid project type: ${value}.`);
  }

  return type as ProjectType;
}

function parseProjectStatus(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "string") {
    throw new HttpError(400, "status must be a valid project status.");
  }

  const status = value.toUpperCase();

  if (!Object.values(ProjectStatus).includes(status as ProjectStatus)) {
    throw new HttpError(400, `Invalid project status: ${value}.`);
  }

  return status as ProjectStatus;
}

async function ensureClientExists(clientId: string | undefined) {
  if (!clientId) return;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  if (!client) {
    throw new HttpError(400, "clientId does not reference an existing client.");
  }
}

async function ensureProviderExists(providerId: string | undefined, fieldName: string) {
  if (!providerId) return;

  const provider = await prisma.provider.findUnique({
    where: { id: providerId },
    select: { id: true },
  });

  if (!provider) {
    throw new HttpError(400, `${fieldName} does not reference an existing provider.`);
  }
}

async function createUniqueProjectSlug(name: string, ignoreId?: string) {
  const baseSlug = createSlug(name) || "project";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.project.findFirst({
      where: {
        slug: candidate,
        ...(ignoreId ? { id: { not: ignoreId } } : {}),
      },
      select: { id: true },
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function listProjects() {
  return prisma.project.findMany({
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      frontendProvider: { select: { id: true, name: true, category: true } },
      backendProvider: { select: { id: true, name: true, category: true } },
      databaseProvider: { select: { id: true, name: true, category: true } },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
  });
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      frontendProvider: { select: { id: true, name: true, category: true } },
      backendProvider: { select: { id: true, name: true, category: true } },
      databaseProvider: { select: { id: true, name: true, category: true } },
    },
  });

  if (!project) {
    throw new HttpError(404, "Project not found.");
  }

  return project;
}

export async function createProject(input: ProjectInput) {
  const name = toRequiredString(input.name, "name");
  const clientId = toOptionalString(input.clientId);
  const frontendProviderId = toOptionalString(input.frontendProviderId);
  const backendProviderId = toOptionalString(input.backendProviderId);
  const databaseProviderId = toOptionalString(input.databaseProviderId);

  await ensureClientExists(clientId);
  await ensureProviderExists(frontendProviderId, "frontendProviderId");
  await ensureProviderExists(backendProviderId, "backendProviderId");
  await ensureProviderExists(databaseProviderId, "databaseProviderId");

  return prisma.project.create({
    data: {
      name,
      slug: await createUniqueProjectSlug(name),
      clientId,
      type: parseProjectType(input.type),
      status: parseProjectStatus(input.status) ?? ProjectStatus.IDEA,
      description: toOptionalString(input.description),
      domain: toOptionalString(input.domain),
      frontendRepositoryUrl: toOptionalString(input.frontendRepositoryUrl),
      backendRepositoryUrl: toOptionalString(input.backendRepositoryUrl),
      frontendProviderId,
      backendProviderId,
      databaseProviderId,
      startDate: toOptionalDate(input.startDate, "startDate"),
      estimatedDeliveryDate: toOptionalDate(
        input.estimatedDeliveryDate,
        "estimatedDeliveryDate",
      ),
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateProject(id: string, input: ProjectInput) {
  await getProjectById(id);

  const name = toOptionalString(input.name);
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const frontendProviderId =
    input.frontendProviderId !== undefined
      ? toOptionalString(input.frontendProviderId)
      : undefined;
  const backendProviderId =
    input.backendProviderId !== undefined
      ? toOptionalString(input.backendProviderId)
      : undefined;
  const databaseProviderId =
    input.databaseProviderId !== undefined
      ? toOptionalString(input.databaseProviderId)
      : undefined;

  await ensureClientExists(clientId);
  await ensureProviderExists(frontendProviderId, "frontendProviderId");
  await ensureProviderExists(backendProviderId, "backendProviderId");
  await ensureProviderExists(databaseProviderId, "databaseProviderId");

  return prisma.project.update({
    where: { id },
    data: {
      ...(name ? { name, slug: await createUniqueProjectSlug(name, id) } : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.type !== undefined ? { type: parseProjectType(input.type) } : {}),
      ...(input.status !== undefined ? { status: parseProjectStatus(input.status) } : {}),
      ...(input.description !== undefined
        ? { description: toOptionalString(input.description) ?? null }
        : {}),
      ...(input.domain !== undefined
        ? { domain: toOptionalString(input.domain) ?? null }
        : {}),
      ...(input.frontendRepositoryUrl !== undefined
        ? {
            frontendRepositoryUrl:
              toOptionalString(input.frontendRepositoryUrl) ?? null,
          }
        : {}),
      ...(input.backendRepositoryUrl !== undefined
        ? {
            backendRepositoryUrl:
              toOptionalString(input.backendRepositoryUrl) ?? null,
          }
        : {}),
      ...(input.frontendProviderId !== undefined
        ? { frontendProviderId: frontendProviderId ?? null }
        : {}),
      ...(input.backendProviderId !== undefined
        ? { backendProviderId: backendProviderId ?? null }
        : {}),
      ...(input.databaseProviderId !== undefined
        ? { databaseProviderId: databaseProviderId ?? null }
        : {}),
      ...(input.startDate !== undefined
        ? { startDate: toOptionalDate(input.startDate, "startDate") ?? null }
        : {}),
      ...(input.estimatedDeliveryDate !== undefined
        ? {
            estimatedDeliveryDate:
              toOptionalDate(input.estimatedDeliveryDate, "estimatedDeliveryDate") ??
              null,
          }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function closeProject(id: string) {
  await getProjectById(id);

  return prisma.project.update({
    where: { id },
    data: { status: ProjectStatus.CLOSED },
  });
}
