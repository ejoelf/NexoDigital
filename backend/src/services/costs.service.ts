import { BillingFrequency, CostCategory, CostStatus } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  ensureClientExists,
  ensureClientProjectConsistency,
  ensureProjectExists,
  ensureProviderExists,
  ensureSubscriptionExists,
} from "../common/relations.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import {
  parseOptionalAmount,
  parseOptionalEnum,
  parseRequiredAmount,
  parseRequiredEnum,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type CostInput = {
  clientId?: unknown;
  projectId?: unknown;
  providerId?: unknown;
  subscriptionId?: unknown;
  name?: unknown;
  concept?: unknown;
  type?: unknown;
  category?: unknown;
  amount?: unknown;
  currency?: unknown;
  billingCycle?: unknown;
  frequency?: unknown;
  costDate?: unknown;
  date?: unknown;
  status?: unknown;
  notes?: unknown;
};

async function validateRelations(
  clientId?: string,
  projectId?: string,
  providerId?: string,
  subscriptionId?: string,
) {
  await ensureClientExists(clientId);
  await ensureProviderExists(providerId);
  await ensureSubscriptionExists(subscriptionId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);

  if (!subscriptionId) return;

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    select: { providerId: true, clientId: true, projectId: true },
  });

  if (!subscription) return;

  if (providerId && subscription.providerId && providerId !== subscription.providerId) {
    throw new HttpError(
      400,
      "providerId is inconsistent with the provider associated to subscriptionId.",
    );
  }

  if (clientId && subscription.clientId && clientId !== subscription.clientId) {
    throw new HttpError(
      400,
      "clientId is inconsistent with the client associated to subscriptionId.",
    );
  }

  if (projectId && subscription.projectId && projectId !== subscription.projectId) {
    throw new HttpError(
      400,
      "projectId is inconsistent with the project associated to subscriptionId.",
    );
  }
}

export async function listCosts() {
  return prisma.cost.findMany({
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true } },
      provider: { select: { id: true, name: true, category: true, status: true } },
      subscription: { select: { id: true, name: true, status: true } },
    },
    orderBy: [{ status: "asc" }, { date: "desc" }, { concept: "asc" }],
  });
}

export async function getCostById(id: string) {
  const cost = await prisma.cost.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
      provider: { select: { id: true, name: true, category: true, status: true } },
      subscription: {
        select: {
          id: true,
          name: true,
          status: true,
          providerId: true,
          clientId: true,
          projectId: true,
        },
      },
    },
  });

  if (!cost) {
    throw new HttpError(404, "Cost not found.");
  }

  return cost;
}

export async function createCost(input: CostInput) {
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);
  const providerId = toOptionalString(input.providerId);
  const subscriptionId = toOptionalString(input.subscriptionId);

  await validateRelations(clientId, projectId, providerId, subscriptionId);

  return prisma.cost.create({
    data: {
      clientId,
      projectId,
      providerId,
      subscriptionId,
      concept: toRequiredString(input.concept ?? input.name, "name"),
      category: parseRequiredEnum(
        input.category ?? input.type,
        CostCategory,
        "type",
      ),
      amount: parseRequiredAmount(input.amount, "amount"),
      currency: toOptionalString(input.currency) ?? "USD",
      frequency: parseRequiredEnum(
        input.frequency ?? input.billingCycle,
        BillingFrequency,
        "billingCycle",
      ),
      date: toOptionalDate(input.date ?? input.costDate, "costDate"),
      status:
        parseOptionalEnum(input.status, CostStatus, "status") ?? CostStatus.ACTIVE,
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateCost(id: string, input: CostInput) {
  const existing = await getCostById(id);
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;
  const providerId =
    input.providerId !== undefined ? toOptionalString(input.providerId) : undefined;
  const subscriptionId =
    input.subscriptionId !== undefined
      ? toOptionalString(input.subscriptionId)
      : undefined;

  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
    input.providerId !== undefined ? providerId : existing.providerId ?? undefined,
    input.subscriptionId !== undefined
      ? subscriptionId
      : existing.subscriptionId ?? undefined,
  );

  return prisma.cost.update({
    where: { id },
    data: {
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.providerId !== undefined ? { providerId: providerId ?? null } : {}),
      ...(input.subscriptionId !== undefined
        ? { subscriptionId: subscriptionId ?? null }
        : {}),
      ...(input.name !== undefined || input.concept !== undefined
        ? { concept: toRequiredString(input.concept ?? input.name, "name") }
        : {}),
      ...(input.type !== undefined || input.category !== undefined
        ? {
            category: parseRequiredEnum(
              input.category ?? input.type,
              CostCategory,
              "type",
            ),
          }
        : {}),
      ...(input.amount !== undefined
        ? { amount: parseOptionalAmount(input.amount, "amount") }
        : {}),
      ...(input.currency !== undefined
        ? { currency: toOptionalString(input.currency) ?? "USD" }
        : {}),
      ...(input.billingCycle !== undefined || input.frequency !== undefined
        ? {
            frequency: parseRequiredEnum(
              input.frequency ?? input.billingCycle,
              BillingFrequency,
              "billingCycle",
            ),
          }
        : {}),
      ...(input.costDate !== undefined || input.date !== undefined
        ? {
            date:
              toOptionalDate(input.date ?? input.costDate, "costDate") ?? new Date(),
          }
        : {}),
      ...(input.status !== undefined
        ? { status: parseOptionalEnum(input.status, CostStatus, "status") }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function archiveCost(id: string) {
  await getCostById(id);

  return prisma.cost.update({
    where: { id },
    data: { status: CostStatus.ARCHIVED },
  });
}
