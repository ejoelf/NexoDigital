import { ProviderCategory, ProviderStatus } from "@prisma/client";
import { HttpError } from "../common/http-error.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import {
  parseOptionalBoolean,
  parseOptionalEnum,
  parseRequiredEnum,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type ProviderInput = {
  name?: unknown;
  category?: unknown;
  website?: unknown;
  websiteUrl?: unknown;
  accountEmail?: unknown;
  accountOwner?: unknown;
  billingType?: unknown;
  status?: unknown;
  notes?: unknown;
  isOfficial?: unknown;
  recommendedUse?: unknown;
  internalOwner?: unknown;
};

function parseAccountEmail(value: unknown) {
  const email = toOptionalString(value);

  if (!email) return undefined;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "accountEmail must be valid.");
  }

  return email.toLowerCase();
}

async function ensureUniqueProviderName(name: string, ignoreId?: string) {
  const existing = await prisma.provider.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, "A provider with that name already exists.");
  }
}

export async function listProviders() {
  return prisma.provider.findMany({
    orderBy: [{ isOfficial: "desc" }, { status: "asc" }, { name: "asc" }],
  });
}

export async function getProviderById(id: string) {
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: {
      subscriptions: { select: { id: true, name: true, status: true } },
      domains: { select: { id: true, domainName: true, status: true } },
      costs: { select: { id: true, concept: true, amount: true, status: true } },
    },
  });

  if (!provider) {
    throw new HttpError(404, "Provider not found.");
  }

  return provider;
}

export async function createProvider(input: ProviderInput) {
  const name = toRequiredString(input.name, "name");
  await ensureUniqueProviderName(name);

  return prisma.provider.create({
    data: {
      name,
      category: parseRequiredEnum(input.category, ProviderCategory, "category"),
      websiteUrl:
        toOptionalString(input.websiteUrl) ?? toOptionalString(input.website),
      accountEmail: parseAccountEmail(input.accountEmail),
      accountOwner: toOptionalString(input.accountOwner),
      billingType: toOptionalString(input.billingType),
      recommendedUse: toOptionalString(input.recommendedUse),
      internalOwner: toOptionalString(input.internalOwner),
      status:
        parseOptionalEnum(input.status, ProviderStatus, "status") ??
        ProviderStatus.CANDIDATE,
      notes: toOptionalString(input.notes),
      isOfficial: parseOptionalBoolean(input.isOfficial, "isOfficial") ?? false,
    },
  });
}

export async function updateProvider(id: string, input: ProviderInput) {
  await getProviderById(id);

  const name = toOptionalString(input.name);

  if (name) {
    await ensureUniqueProviderName(name, id);
  }

  return prisma.provider.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(input.category !== undefined
        ? { category: parseRequiredEnum(input.category, ProviderCategory, "category") }
        : {}),
      ...(input.website !== undefined || input.websiteUrl !== undefined
        ? {
            websiteUrl:
              toOptionalString(input.websiteUrl) ??
              toOptionalString(input.website) ??
              null,
          }
        : {}),
      ...(input.accountEmail !== undefined
        ? { accountEmail: parseAccountEmail(input.accountEmail) ?? null }
        : {}),
      ...(input.accountOwner !== undefined
        ? { accountOwner: toOptionalString(input.accountOwner) ?? null }
        : {}),
      ...(input.billingType !== undefined
        ? { billingType: toOptionalString(input.billingType) ?? null }
        : {}),
      ...(input.recommendedUse !== undefined
        ? { recommendedUse: toOptionalString(input.recommendedUse) ?? null }
        : {}),
      ...(input.internalOwner !== undefined
        ? { internalOwner: toOptionalString(input.internalOwner) ?? null }
        : {}),
      ...(input.status !== undefined
        ? { status: parseOptionalEnum(input.status, ProviderStatus, "status") }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
      ...(input.isOfficial !== undefined
        ? { isOfficial: parseOptionalBoolean(input.isOfficial, "isOfficial") }
        : {}),
    },
  });
}

export async function archiveProvider(id: string) {
  await getProviderById(id);

  return prisma.provider.update({
    where: { id },
    data: {
      status: ProviderStatus.DEPRECATED,
      isOfficial: false,
    },
  });
}
