import { DomainStatus } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  ensureClientExists,
  ensureClientProjectConsistency,
  ensureProjectExists,
  ensureProviderExists,
} from "../common/relations.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import {
  parseOptionalBoolean,
  parseOptionalEnum,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type DomainInput = {
  domainName?: unknown;
  providerId?: unknown;
  clientId?: unknown;
  projectId?: unknown;
  registrar?: unknown;
  dnsProvider?: unknown;
  registrationDate?: unknown;
  purchaseDate?: unknown;
  expirationDate?: unknown;
  autoRenew?: unknown;
  paymentResponsible?: unknown;
  paymentResponsibleName?: unknown;
  status?: unknown;
  notes?: unknown;
};

async function ensureUniqueDomain(domainName: string, ignoreId?: string) {
  const existing = await prisma.domain.findFirst({
    where: {
      domainName: { equals: domainName, mode: "insensitive" },
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, "A domain with that domainName already exists.");
  }
}

async function validateRelations(clientId?: string, projectId?: string, providerId?: string) {
  await ensureClientExists(clientId);
  await ensureProviderExists(providerId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);
}

export async function listDomains() {
  return prisma.domain.findMany({
    include: {
      provider: { select: { id: true, name: true, category: true, status: true } },
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true } },
    },
    orderBy: [{ status: "asc" }, { expirationDate: "asc" }, { domainName: "asc" }],
  });
}

export async function getDomainById(id: string) {
  const domain = await prisma.domain.findUnique({
    where: { id },
    include: {
      provider: { select: { id: true, name: true, category: true, status: true } },
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
    },
  });

  if (!domain) {
    throw new HttpError(404, "Domain not found.");
  }

  return domain;
}

export async function createDomain(input: DomainInput) {
  const domainName = toRequiredString(input.domainName, "domainName").toLowerCase();
  const providerId = toOptionalString(input.providerId);
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);

  await ensureUniqueDomain(domainName);
  await validateRelations(clientId, projectId, providerId);

  return prisma.domain.create({
    data: {
      domainName,
      providerId,
      clientId,
      projectId,
      registrar: toOptionalString(input.registrar),
      dnsProvider: toOptionalString(input.dnsProvider),
      purchaseDate: toOptionalDate(
        input.purchaseDate ?? input.registrationDate,
        "registrationDate",
      ),
      expirationDate: toOptionalDate(input.expirationDate, "expirationDate"),
      autoRenew: parseOptionalBoolean(input.autoRenew, "autoRenew") ?? false,
      paymentResponsibleName:
        toOptionalString(input.paymentResponsibleName) ??
        toOptionalString(input.paymentResponsible),
      status:
        parseOptionalEnum(input.status, DomainStatus, "status") ??
        DomainStatus.ACTIVE,
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateDomain(id: string, input: DomainInput) {
  const existing = await getDomainById(id);
  const domainName = toOptionalString(input.domainName)?.toLowerCase();
  const providerId =
    input.providerId !== undefined ? toOptionalString(input.providerId) : undefined;
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  if (domainName) {
    await ensureUniqueDomain(domainName, id);
  }

  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
    input.providerId !== undefined ? providerId : existing.providerId ?? undefined,
  );

  return prisma.domain.update({
    where: { id },
    data: {
      ...(domainName ? { domainName } : {}),
      ...(input.providerId !== undefined ? { providerId: providerId ?? null } : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.registrar !== undefined
        ? { registrar: toOptionalString(input.registrar) ?? null }
        : {}),
      ...(input.dnsProvider !== undefined
        ? { dnsProvider: toOptionalString(input.dnsProvider) ?? null }
        : {}),
      ...(input.registrationDate !== undefined || input.purchaseDate !== undefined
        ? {
            purchaseDate:
              toOptionalDate(
                input.purchaseDate ?? input.registrationDate,
                "registrationDate",
              ) ?? null,
          }
        : {}),
      ...(input.expirationDate !== undefined
        ? { expirationDate: toOptionalDate(input.expirationDate, "expirationDate") ?? null }
        : {}),
      ...(input.autoRenew !== undefined
        ? { autoRenew: parseOptionalBoolean(input.autoRenew, "autoRenew") }
        : {}),
      ...(input.paymentResponsible !== undefined ||
      input.paymentResponsibleName !== undefined
        ? {
            paymentResponsibleName:
              toOptionalString(input.paymentResponsibleName) ??
              toOptionalString(input.paymentResponsible) ??
              null,
          }
        : {}),
      ...(input.status !== undefined
        ? { status: parseOptionalEnum(input.status, DomainStatus, "status") }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function archiveDomain(id: string) {
  await getDomainById(id);

  return prisma.domain.update({
    where: { id },
    data: {
      status: DomainStatus.PARKED,
      autoRenew: false,
    },
  });
}
