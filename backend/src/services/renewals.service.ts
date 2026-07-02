import { RenewalEntityType, RenewalStatus } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  ensureClientExists,
  ensureClientProjectConsistency,
  ensureProjectExists,
} from "../common/relations.js";
import { toOptionalString } from "../common/strings.js";
import {
  parseOptionalAmount,
  parseOptionalEnum,
  parseOptionalInteger,
  parseRequiredAmount,
  parseRequiredEnum,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

type RenewalInput = {
  relatedType?: unknown;
  entityType?: unknown;
  relatedId?: unknown;
  entityId?: unknown;
  clientId?: unknown;
  projectId?: unknown;
  dueDate?: unknown;
  amount?: unknown;
  currency?: unknown;
  status?: unknown;
  reminderDays?: unknown;
  paymentResponsible?: unknown;
  paymentResponsibleName?: unknown;
  paidAt?: unknown;
  receiptUrl?: unknown;
  notes?: unknown;
};

async function validateRelatedEntity(entityType: RenewalEntityType, entityId?: string) {
  if (!entityId) return;

  if (entityType === RenewalEntityType.SUBSCRIPTION) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: entityId },
      select: { id: true },
    });

    if (!subscription) {
      throw new HttpError(400, "relatedId does not reference an existing subscription.");
    }
  }

  if (entityType === RenewalEntityType.DOMAIN) {
    const domain = await prisma.domain.findUnique({
      where: { id: entityId },
      select: { id: true },
    });

    if (!domain) {
      throw new HttpError(400, "relatedId does not reference an existing domain.");
    }
  }
}

async function validateRelations(clientId?: string, projectId?: string) {
  await ensureClientExists(clientId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);
}

function parseRequiredDueDate(value: unknown) {
  const dueDate = toOptionalDate(value, "dueDate");

  if (!dueDate) {
    throw new HttpError(400, "dueDate is required.");
  }

  return dueDate;
}

export async function listRenewals() {
  return prisma.renewal.findMany({
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true } },
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function getRenewalById(id: string) {
  const renewal = await prisma.renewal.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, businessName: true, status: true } },
      project: { select: { id: true, name: true, status: true, clientId: true } },
    },
  });

  if (!renewal) {
    throw new HttpError(404, "Renewal not found.");
  }

  return renewal;
}

export async function createRenewal(input: RenewalInput) {
  const entityType = parseRequiredEnum(
    input.entityType ?? input.relatedType,
    RenewalEntityType,
    "relatedType",
  );
  const entityId = toOptionalString(input.entityId) ?? toOptionalString(input.relatedId);
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);

  await validateRelatedEntity(entityType, entityId);
  await validateRelations(clientId, projectId);

  return prisma.renewal.create({
    data: {
      entityType,
      entityId,
      clientId,
      projectId,
      dueDate: parseRequiredDueDate(input.dueDate),
      amount:
        input.amount === undefined || input.amount === null || input.amount === ""
          ? undefined
          : parseRequiredAmount(input.amount, "amount"),
      currency: toOptionalString(input.currency) ?? "USD",
      paymentResponsibleName:
        toOptionalString(input.paymentResponsibleName) ??
        toOptionalString(input.paymentResponsible),
      status:
        parseOptionalEnum(input.status, RenewalStatus, "status") ??
        RenewalStatus.PENDING,
      reminderDays: parseOptionalInteger(input.reminderDays, "reminderDays"),
      paidAt: toOptionalDate(input.paidAt, "paidAt"),
      receiptUrl: toOptionalString(input.receiptUrl),
      notes: toOptionalString(input.notes),
    },
  });
}

export async function updateRenewal(id: string, input: RenewalInput) {
  const existing = await getRenewalById(id);
  const entityType =
    input.entityType !== undefined || input.relatedType !== undefined
      ? parseRequiredEnum(
          input.entityType ?? input.relatedType,
          RenewalEntityType,
          "relatedType",
        )
      : existing.entityType;
  const entityId =
    input.entityId !== undefined || input.relatedId !== undefined
      ? toOptionalString(input.entityId) ?? toOptionalString(input.relatedId)
      : existing.entityId ?? undefined;
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  await validateRelatedEntity(entityType, entityId);
  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
  );

  return prisma.renewal.update({
    where: { id },
    data: {
      ...(input.entityType !== undefined || input.relatedType !== undefined
        ? { entityType }
        : {}),
      ...(input.entityId !== undefined || input.relatedId !== undefined
        ? { entityId: entityId ?? null }
        : {}),
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: parseRequiredDueDate(input.dueDate) }
        : {}),
      ...(input.amount !== undefined
        ? { amount: parseOptionalAmount(input.amount, "amount") ?? null }
        : {}),
      ...(input.currency !== undefined
        ? { currency: toOptionalString(input.currency) ?? "USD" }
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
        ? { status: parseOptionalEnum(input.status, RenewalStatus, "status") }
        : {}),
      ...(input.reminderDays !== undefined
        ? { reminderDays: parseOptionalInteger(input.reminderDays, "reminderDays") ?? null }
        : {}),
      ...(input.paidAt !== undefined
        ? { paidAt: toOptionalDate(input.paidAt, "paidAt") ?? null }
        : {}),
      ...(input.receiptUrl !== undefined
        ? { receiptUrl: toOptionalString(input.receiptUrl) ?? null }
        : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
  });
}

export async function cancelRenewal(id: string) {
  await getRenewalById(id);

  return prisma.renewal.update({
    where: { id },
    data: { status: RenewalStatus.CANCELLED },
  });
}
