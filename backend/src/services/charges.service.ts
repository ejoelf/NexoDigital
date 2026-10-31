import { BillingFrequency, ChargeStatus, ChargeType } from "@prisma/client";
import { toOptionalDate } from "../common/dates.js";
import { HttpError } from "../common/http-error.js";
import {
  ensureClientExists,
  ensureClientProjectConsistency,
  ensureProjectExists,
} from "../common/relations.js";
import { toOptionalString, toRequiredString } from "../common/strings.js";
import {
  parseOptionalEnum,
  parseRequiredAmount,
} from "../common/validation.js";
import { prisma } from "../prisma/client.js";

// Cobros: lo que NexoDigital les cobra a sus clientes (proyectos, mantenimiento, etc.).
type ChargeInput = {
  clientId?: unknown;
  projectId?: unknown;
  concept?: unknown;
  type?: unknown;
  amount?: unknown;
  currency?: unknown;
  frequency?: unknown;
  dueDate?: unknown;
  status?: unknown;
  paidAt?: unknown;
  notes?: unknown;
};

const CHARGE_INCLUDE = {
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
} as const;

async function validateRelations(clientId?: string, projectId?: string) {
  await ensureClientExists(clientId);
  const project = await ensureProjectExists(projectId);
  ensureClientProjectConsistency(clientId, project?.clientId);
}

function normalizeCurrency(value: unknown) {
  return (toOptionalString(value) ?? "ARS").toUpperCase();
}

export async function listCharges() {
  return prisma.charge.findMany({
    include: CHARGE_INCLUDE,
    orderBy: [{ status: "asc" }, { dueDate: { sort: "asc", nulls: "last" } }],
  });
}

export async function getChargeById(id: string) {
  const charge = await prisma.charge.findUnique({ where: { id }, include: CHARGE_INCLUDE });

  if (!charge) {
    throw new HttpError(404, "Charge not found.");
  }

  return charge;
}

export async function createCharge(input: ChargeInput) {
  const clientId = toOptionalString(input.clientId);
  const projectId = toOptionalString(input.projectId);
  await validateRelations(clientId, projectId);

  const status = parseOptionalEnum(input.status, ChargeStatus, "status") ?? ChargeStatus.PENDING;

  return prisma.charge.create({
    data: {
      clientId,
      projectId,
      concept: toRequiredString(input.concept, "concept"),
      type: parseOptionalEnum(input.type, ChargeType, "type") ?? ChargeType.OTHER,
      amount: parseRequiredAmount(input.amount, "amount"),
      currency: normalizeCurrency(input.currency),
      frequency:
        parseOptionalEnum(input.frequency, BillingFrequency, "frequency") ??
        BillingFrequency.ONE_TIME,
      dueDate: toOptionalDate(input.dueDate, "dueDate"),
      status,
      paidAt:
        toOptionalDate(input.paidAt, "paidAt") ??
        (status === ChargeStatus.PAID ? new Date() : undefined),
      notes: toOptionalString(input.notes),
    },
    include: CHARGE_INCLUDE,
  });
}

export async function updateCharge(id: string, input: ChargeInput) {
  const existing = await getChargeById(id);
  const clientId =
    input.clientId !== undefined ? toOptionalString(input.clientId) : undefined;
  const projectId =
    input.projectId !== undefined ? toOptionalString(input.projectId) : undefined;

  await validateRelations(
    input.clientId !== undefined ? clientId : existing.clientId ?? undefined,
    input.projectId !== undefined ? projectId : existing.projectId ?? undefined,
  );

  const status = parseOptionalEnum(input.status, ChargeStatus, "status");
  const markedPaid =
    status === ChargeStatus.PAID && existing.status !== ChargeStatus.PAID;

  return prisma.charge.update({
    where: { id },
    data: {
      ...(input.clientId !== undefined ? { clientId: clientId ?? null } : {}),
      ...(input.projectId !== undefined ? { projectId: projectId ?? null } : {}),
      ...(input.concept !== undefined
        ? { concept: toRequiredString(input.concept, "concept") }
        : {}),
      ...(input.type !== undefined
        ? { type: parseOptionalEnum(input.type, ChargeType, "type") }
        : {}),
      ...(input.amount !== undefined
        ? { amount: parseRequiredAmount(input.amount, "amount") }
        : {}),
      ...(input.currency !== undefined ? { currency: normalizeCurrency(input.currency) } : {}),
      ...(input.frequency !== undefined
        ? { frequency: parseOptionalEnum(input.frequency, BillingFrequency, "frequency") }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: toOptionalDate(input.dueDate, "dueDate") ?? null }
        : {}),
      ...(status !== undefined ? { status } : {}),
      ...(input.paidAt !== undefined
        ? { paidAt: toOptionalDate(input.paidAt, "paidAt") ?? null }
        : markedPaid
          ? { paidAt: new Date() }
          : {}),
      ...(input.notes !== undefined
        ? { notes: toOptionalString(input.notes) ?? null }
        : {}),
    },
    include: CHARGE_INCLUDE,
  });
}

// Borrado lógico: el cobro queda cancelado.
export async function cancelCharge(id: string) {
  await getChargeById(id);

  return prisma.charge.update({
    where: { id },
    data: { status: ChargeStatus.CANCELLED },
    include: CHARGE_INCLUDE,
  });
}
