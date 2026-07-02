import { ClientStatus } from "@prisma/client";
import { HttpError } from "../common/http-error.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import { prisma } from "../prisma/client.js";

type ClientInput = {
  businessName?: unknown;
  contactName?: unknown;
  email?: unknown;
  phone?: unknown;
  country?: unknown;
  city?: unknown;
  industry?: unknown;
  status?: unknown;
  notes?: unknown;
};

function parseClientStatus(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, "status must be a valid client status.");
  }

  const status = value.toUpperCase();

  if (!Object.values(ClientStatus).includes(status as ClientStatus)) {
    throw new HttpError(400, `Invalid client status: ${value}.`);
  }

  return status as ClientStatus;
}

function parseEmail(value: unknown) {
  const email = toOptionalString(value);

  if (!email) return undefined;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "email must be valid.");
  }

  return email.toLowerCase();
}

async function ensureUniqueBusinessName(businessName: string, ignoreId?: string) {
  const existing = await prisma.client.findFirst({
    where: {
      businessName: {
        equals: businessName,
        mode: "insensitive",
      },
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
  });

  if (existing) {
    throw new HttpError(409, "A client with that businessName already exists.");
  }
}

export async function listClients() {
  return prisma.client.findMany({
    orderBy: [{ status: "asc" }, { businessName: "asc" }],
  });
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: {
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          domain: true,
        },
      },
    },
  });

  if (!client) {
    throw new HttpError(404, "Client not found.");
  }

  return client;
}

export async function createClient(input: ClientInput) {
  const businessName = toRequiredString(input.businessName, "businessName");
  await ensureUniqueBusinessName(businessName);

  return prisma.client.create({
    data: {
      businessName,
      displayName: businessName,
      contactName: toOptionalString(input.contactName),
      email: parseEmail(input.email),
      phone: toOptionalString(input.phone),
      country: toOptionalString(input.country),
      city: toOptionalString(input.city),
      industry: toOptionalString(input.industry),
      status: parseClientStatus(input.status) ?? ClientStatus.ACTIVE,
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateClient(id: string, input: ClientInput) {
  await getClientById(id);

  const businessName = toOptionalString(input.businessName);

  if (businessName) {
    await ensureUniqueBusinessName(businessName, id);
  }

  return prisma.client.update({
    where: { id },
    data: {
      ...(businessName ? { businessName, displayName: businessName } : {}),
      ...(input.contactName !== undefined
        ? { contactName: toOptionalString(input.contactName) ?? null }
        : {}),
      ...(input.email !== undefined ? { email: parseEmail(input.email) ?? null } : {}),
      ...(input.phone !== undefined
        ? { phone: toOptionalString(input.phone) ?? null }
        : {}),
      ...(input.country !== undefined
        ? { country: toOptionalString(input.country) ?? null }
        : {}),
      ...(input.city !== undefined ? { city: toOptionalString(input.city) ?? null } : {}),
      ...(input.industry !== undefined
        ? { industry: toOptionalString(input.industry) ?? null }
        : {}),
      ...(input.status !== undefined ? { status: parseClientStatus(input.status) } : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function deactivateClient(id: string) {
  await getClientById(id);

  return prisma.client.update({
    where: { id },
    data: { status: ClientStatus.INACTIVE },
  });
}
