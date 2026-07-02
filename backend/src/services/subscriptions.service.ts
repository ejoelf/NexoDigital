import {
  BillingFrequency,
  SubscriptionStatus,
} from "@prisma/client";
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
  parseOptionalAmount,
  parseOptionalEnum,
  parseRequiredAmount,
  parseRequiredEnum,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type SubscriptionInput = {
  providerId?: unknown;
  clientId?: unknown;
  projectId?: unknown;
  name?: unknown;
  serviceType?: unknown;
  planName?: unknown;
  amount?: unknown;
  currency?: unknown;
  billingCycle?: unknown;
  billingFrequency?: unknown;
  startDate?: unknown;
  renewalDate?: unknown;
  paymentResponsible?: unknown;
  paymentResponsibleName?: unknown;
  status?: unknown;
  invoiceUrl?: unknown;
  notes?: unknown;
};

async function ensureSubscriptionNameAvailable(name: string, ignoreId?: string) {
  const existing = await prisma.subscription.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      status: { not: SubscriptionStatus.CANCELLED },
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, "An active subscription with that name already exists.");
  }
}

async function validateRelations(clientId?: string, projectId?: string, providerId?: string) {
  await ensureClientExists(clientId);
  await ensureProviderExists(providerId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);
}

export async function listSubscriptions() {
  return prisma.subscription.findMany({
    include: {
      provider: { select: { id: true, name: true, category: true, status: true } },
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true } },
    },
    orderBy: [{ status: "asc" }, { renewalDate: "asc" }, { name: "asc" }],
  });
}

export async function getSubscriptionById(id: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      provider: { select: { id: true, name: true, category: true, status: true } },
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
      costs: { select: { id: true, concept: true, amount: true, status: true } },
    },
  });

  if (!subscription) {
    throw new HttpError(404, "Subscription not found.");
  }

  return subscription;
}

export async function createSubscription(input: SubscriptionInput) {
  const name = toRequiredString(input.name, "name");
  const providerId = toOptionalString(input.providerId);
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);

  await ensureSubscriptionNameAvailable(name);
  await validateRelations(clientId, projectId, providerId);

  return prisma.subscription.create({
    data: {
      providerId,
      clientId,
      projectId,
      name,
      serviceType: toRequiredString(input.serviceType, "serviceType"),
      planName: toOptionalString(input.planName),
      amount: parseRequiredAmount(input.amount, "amount"),
      currency: toOptionalString(input.currency) ?? "USD",
      billingFrequency: parseRequiredEnum(
        input.billingFrequency ?? input.billingCycle,
        BillingFrequency,
        "billingCycle",
      ),
      startDate: toOptionalDate(input.startDate, "startDate"),
      renewalDate: toOptionalDate(input.renewalDate, "renewalDate"),
      paymentResponsibleName:
        toOptionalString(input.paymentResponsibleName) ??
        toOptionalString(input.paymentResponsible),
      status:
        parseOptionalEnum(input.status, SubscriptionStatus, "status") ??
        SubscriptionStatus.ACTIVE,
      invoiceUrl: toOptionalString(input.invoiceUrl),
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateSubscription(id: string, input: SubscriptionInput) {
  const existing = await getSubscriptionById(id);
  const name = toOptionalString(input.name);
  const providerId =
    input.providerId !== undefined ? toOptionalString(input.providerId) : undefined;
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  if (name) {
    await ensureSubscriptionNameAvailable(name, id);
  }

  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
    input.providerId !== undefined ? providerId : existing.providerId ?? undefined,
  );

  return prisma.subscription.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(input.providerId !== undefined ? { providerId: providerId ?? null } : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.serviceType !== undefined
        ? { serviceType: toRequiredString(input.serviceType, "serviceType") }
        : {}),
      ...(input.planName !== undefined
        ? { planName: toOptionalString(input.planName) ?? null }
        : {}),
      ...(input.amount !== undefined
        ? { amount: parseOptionalAmount(input.amount, "amount") }
        : {}),
      ...(input.currency !== undefined
        ? { currency: toOptionalString(input.currency) ?? "USD" }
        : {}),
      ...(input.billingCycle !== undefined || input.billingFrequency !== undefined
        ? {
            billingFrequency: parseRequiredEnum(
              input.billingFrequency ?? input.billingCycle,
              BillingFrequency,
              "billingCycle",
            ),
          }
        : {}),
      ...(input.startDate !== undefined
        ? { startDate: toOptionalDate(input.startDate, "startDate") ?? null }
        : {}),
      ...(input.renewalDate !== undefined
        ? { renewalDate: toOptionalDate(input.renewalDate, "renewalDate") ?? null }
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
        ? { status: parseOptionalEnum(input.status, SubscriptionStatus, "status") }
        : {}),
      ...(input.invoiceUrl !== undefined
        ? { invoiceUrl: toOptionalString(input.invoiceUrl) ?? null }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function cancelSubscription(id: string) {
  await getSubscriptionById(id);

  return prisma.subscription.update({
    where: { id },
    data: { status: SubscriptionStatus.CANCELLED },
  });
}
