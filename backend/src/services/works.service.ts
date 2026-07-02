import { WorkStatus } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  createSlug,
  toOptionalString,
  toRequiredString,
} from "../common/strings.js";
import { prisma } from "../prisma/client.js";

type WorkInput = {
  title?: unknown;
  slug?: unknown;
  clientId?: unknown;
  projectId?: unknown;
  category?: unknown;
  industry?: unknown;
  shortDescription?: unknown;
  longDescription?: unknown;
  image?: unknown;
  mainImageUrl?: unknown;
  gallery?: unknown;
  galleryUrls?: unknown;
  publicUrl?: unknown;
  frontendRepo?: unknown;
  frontendRepositoryUrl?: unknown;
  backendRepo?: unknown;
  backendRepositoryUrl?: unknown;
  technologies?: unknown;
  servicesIncluded?: unknown;
  includedServices?: unknown;
  status?: unknown;
  isPublic?: unknown;
  isFeatured?: unknown;
  featured?: unknown;
  displayOrder?: unknown;
  publishedAt?: unknown;
  internalNotes?: unknown;
};

function toStringArray(value: unknown, fieldName: string) {
  if (value === undefined || value === null) return undefined;

  if (!Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an array of strings.`);
  }

  return value.map((item) => {
    if (typeof item !== "string" || item.trim().length === 0) {
      throw new HttpError(400, `${fieldName} must contain only non-empty strings.`);
    }

    return item.trim();
  });
}

function toOptionalBoolean(value: unknown, fieldName: string) {
  if (value === undefined || value === null) return undefined;

  if (typeof value !== "boolean") {
    throw new HttpError(400, `${fieldName} must be boolean.`);
  }

  return value;
}

function toOptionalNumber(value: unknown, fieldName: string) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new HttpError(400, `${fieldName} must be an integer.`);
  }

  return value;
}

function parseWorkStatus(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;

  if (typeof value !== "string") {
    throw new HttpError(400, "status must be a valid work status.");
  }

  const status = value.toUpperCase();

  if (!Object.values(WorkStatus).includes(status as WorkStatus)) {
    throw new HttpError(400, `Invalid work status: ${value}.`);
  }

  return status as WorkStatus;
}

async function ensureClientExists(clientId: string | undefined) {
  if (!clientId) return null;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  if (!client) {
    throw new HttpError(400, "clientId does not reference an existing client.");
  }

  return client;
}

async function ensureProjectExists(projectId: string | undefined) {
  if (!projectId) return null;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, clientId: true },
  });

  if (!project) {
    throw new HttpError(400, "projectId does not reference an existing project.");
  }

  return project;
}

function ensureClientProjectConsistency(
  clientId: string | undefined,
  projectClientId: string | null | undefined,
) {
  if (clientId && projectClientId && clientId !== projectClientId) {
    throw new HttpError(
      400,
      "clientId is inconsistent with the client associated to projectId.",
    );
  }
}

async function ensureUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await prisma.work.findFirst({
    where: {
      slug,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, "A work with that slug already exists.");
  }
}

function parseCreateInput(input: WorkInput) {
  const title = toRequiredString(input.title, "title");
  const category = toRequiredString(input.category, "category");
  const shortDescription = toRequiredString(
    input.shortDescription,
    "shortDescription",
  );
  const slug = toOptionalString(input.slug) ?? createSlug(title);

  if (!slug) {
    throw new HttpError(400, "slug could not be generated.");
  }

  return {
    title,
    slug,
    category,
    shortDescription,
    clientId: toOptionalString(input.clientId),
    projectId: toOptionalString(input.projectId),
    industry: toOptionalString(input.industry),
    longDescription: toOptionalString(input.longDescription),
    mainImageUrl:
      toOptionalString(input.mainImageUrl) ?? toOptionalString(input.image),
    galleryUrls:
      toStringArray(input.galleryUrls ?? input.gallery, "gallery") ?? [],
    publicUrl: toOptionalString(input.publicUrl),
    frontendRepositoryUrl:
      toOptionalString(input.frontendRepositoryUrl) ??
      toOptionalString(input.frontendRepo),
    backendRepositoryUrl:
      toOptionalString(input.backendRepositoryUrl) ??
      toOptionalString(input.backendRepo),
    technologies: toStringArray(input.technologies, "technologies") ?? [],
    includedServices:
      toStringArray(input.includedServices ?? input.servicesIncluded, "servicesIncluded") ??
      [],
    status: parseWorkStatus(input.status) ?? WorkStatus.DEVELOPMENT,
    isPublic: toOptionalBoolean(input.isPublic, "isPublic") ?? false,
    featured:
      toOptionalBoolean(input.featured ?? input.isFeatured, "isFeatured") ?? false,
    displayOrder: toOptionalNumber(input.displayOrder, "displayOrder") ?? 0,
    publishedAt: toOptionalDate(input.publishedAt, "publishedAt"),
    internalNotes: toOptionalString(input.internalNotes),
  };
}

export async function listWorks() {
  return prisma.work.findMany({
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
    },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function listPublicWorks() {
  return prisma.work.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      title: true,
      slug: true,
      clientName: true,
      category: true,
      industry: true,
      shortDescription: true,
      longDescription: true,
      mainImageUrl: true,
      galleryUrls: true,
      publicUrl: true,
      technologies: true,
      includedServices: true,
      status: true,
      publishedAt: true,
      featured: true,
      displayOrder: true,
      client: {
        select: {
          id: true,
          businessName: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getWorkById(id: string) {
  const work = await prisma.work.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
    },
  });

  if (!work) {
    throw new HttpError(404, "Work not found.");
  }

  return work;
}

export async function createWork(input: WorkInput) {
  const data = parseCreateInput(input);
  const project = await ensureProjectExists(data.projectId);
  await ensureClientExists(data.clientId);
  ensureClientProjectConsistency(data.clientId, project?.clientId);
  await ensureUniqueSlug(data.slug);

  return prisma.work.create({
    data: {
      ...data,
      clientName: undefined,
    },
  });
}

export async function updateWork(id: string, input: WorkInput) {
  const existing = await getWorkById(id);
  const title = toOptionalString(input.title);
  const slug = toOptionalString(input.slug);
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  const effectiveClientId =
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined;
  const effectiveProjectId =
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined;

  const project = await ensureProjectExists(effectiveProjectId);
  await ensureClientExists(effectiveClientId);
  ensureClientProjectConsistency(effectiveClientId, project?.clientId);

  if (slug) {
    await ensureUniqueSlug(slug, id);
  }

  return prisma.work.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(slug ? { slug } : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.category !== undefined
        ? { category: toRequiredString(input.category, "category") }
        : {}),
      ...(input.industry !== undefined
        ? { industry: toOptionalString(input.industry) ?? null }
        : {}),
      ...(input.shortDescription !== undefined
        ? {
            shortDescription: toRequiredString(
              input.shortDescription,
              "shortDescription",
            ),
          }
        : {}),
      ...(input.longDescription !== undefined
        ? { longDescription: toOptionalString(input.longDescription) ?? null }
        : {}),
      ...(input.image !== undefined || input.mainImageUrl !== undefined
        ? {
            mainImageUrl:
              toOptionalString(input.mainImageUrl) ??
              toOptionalString(input.image) ??
              null,
          }
        : {}),
      ...(input.gallery !== undefined || input.galleryUrls !== undefined
        ? {
            galleryUrls:
              toStringArray(input.galleryUrls ?? input.gallery, "gallery") ?? [],
          }
        : {}),
      ...(input.publicUrl !== undefined
        ? { publicUrl: toOptionalString(input.publicUrl) ?? null }
        : {}),
      ...(input.frontendRepo !== undefined ||
      input.frontendRepositoryUrl !== undefined
        ? {
            frontendRepositoryUrl:
              toOptionalString(input.frontendRepositoryUrl) ??
              toOptionalString(input.frontendRepo) ??
              null,
          }
        : {}),
      ...(input.backendRepo !== undefined || input.backendRepositoryUrl !== undefined
        ? {
            backendRepositoryUrl:
              toOptionalString(input.backendRepositoryUrl) ??
              toOptionalString(input.backendRepo) ??
              null,
          }
        : {}),
      ...(input.technologies !== undefined
        ? { technologies: toStringArray(input.technologies, "technologies") ?? [] }
        : {}),
      ...(input.servicesIncluded !== undefined ||
      input.includedServices !== undefined
        ? {
            includedServices:
              toStringArray(
                input.includedServices ?? input.servicesIncluded,
                "servicesIncluded",
              ) ?? [],
          }
        : {}),
      ...(input.status !== undefined ? { status: parseWorkStatus(input.status) } : {}),
      ...(input.isPublic !== undefined
        ? { isPublic: toOptionalBoolean(input.isPublic, "isPublic") }
        : {}),
      ...(input.featured !== undefined || input.isFeatured !== undefined
        ? {
            featured: toOptionalBoolean(
              input.featured ?? input.isFeatured,
              "isFeatured",
            ),
          }
        : {}),
      ...(input.displayOrder !== undefined
        ? { displayOrder: toOptionalNumber(input.displayOrder, "displayOrder") }
        : {}),
      ...(input.publishedAt !== undefined
        ? { publishedAt: toOptionalDate(input.publishedAt, "publishedAt") ?? null }
        : {}),
      ...(input.internalNotes !== undefined
        ? { internalNotes: toOptionalString(input.internalNotes) ?? null }
        : {}),
    },
  });
}

export async function archiveWork(id: string) {
  await getWorkById(id);

  return prisma.work.update({
    where: { id },
    data: {
      isPublic: false,
      featured: false,
      status: WorkStatus.CLOSED,
    },
  });
}
