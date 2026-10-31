import {
  BillingFrequency,
  ChargeStatus,
  ClientStatus,
  DomainStatus,
  ProjectStatus,
  RenewalStatus,
  SubscriptionStatus,
  TaskStatus,
} from "@prisma/client";
import { prisma } from "../prisma/client.js";

// Resumen para la pantalla de inicio del panel: todo lo que vence o hay que hacer,
// en una sola lista ordenada por fecha, más los números principales.

type AgendaKind =
  | "TASK"
  | "CHARGE"
  | "RENEWAL"
  | "DOMAIN"
  | "SUBSCRIPTION"
  | "FOLLOW_UP";

type AgendaItem = {
  kind: AgendaKind;
  id: string;
  title: string;
  date: string;
  overdue: boolean;
  status: string | null;
  priority?: string | null;
  clientId?: string | null;
  clientName?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  amount?: string | null;
  currency?: string | null;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addAmount(totals: Record<string, number>, currency: string, value: number) {
  totals[currency] = (totals[currency] ?? 0) + value;
}

function monthlyValue(amount: number, frequency: BillingFrequency) {
  if (frequency === BillingFrequency.MONTHLY) return amount;
  if (frequency === BillingFrequency.YEARLY) return amount / 12;
  return 0;
}

function roundTotals(totals: Record<string, number>) {
  return Object.fromEntries(
    Object.entries(totals).map(([currency, value]) => [currency, Math.round(value * 100) / 100]),
  );
}

export async function getDashboardHome(days: number) {
  const now = new Date();
  const until = new Date(now.getTime() + days * MS_PER_DAY);
  const clientSelect = { select: { id: true, businessName: true } } as const;
  const projectSelect = { select: { id: true, name: true } } as const;

  const [
    tasks,
    charges,
    renewals,
    domains,
    subscriptions,
    followUps,
    clientCounts,
    leadStageCounts,
    activeProjects,
    openTasks,
    pendingCharges,
    recurringCharges,
    activeSubscriptions,
  ] = await Promise.all([
    prisma.task.findMany({
      where: {
        status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
        dueDate: { lte: until },
      },
      include: { client: clientSelect, project: projectSelect },
    }),
    prisma.charge.findMany({
      where: {
        status: { in: [ChargeStatus.PENDING, ChargeStatus.OVERDUE] },
        dueDate: { lte: until },
      },
      include: { client: clientSelect, project: projectSelect },
    }),
    prisma.renewal.findMany({
      where: {
        status: { in: [RenewalStatus.PENDING, RenewalStatus.OVERDUE] },
        dueDate: { lte: until },
      },
      include: { client: clientSelect, project: projectSelect },
    }),
    prisma.domain.findMany({
      where: {
        // Los dominios ya vencidos y no renovados no se repiten en la agenda.
        status: { notIn: [DomainStatus.TRANSFERRED, DomainStatus.EXPIRED] },
        expirationDate: { lte: until },
      },
      include: { client: clientSelect, project: projectSelect },
    }),
    prisma.subscription.findMany({
      where: {
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
        renewalDate: { lte: until },
      },
      include: { client: clientSelect, project: projectSelect, provider: { select: { name: true } } },
    }),
    prisma.client.findMany({
      where: { nextFollowUpAt: { lte: until }, status: { not: ClientStatus.INACTIVE } },
      select: { id: true, businessName: true, nextFollowUpAt: true, leadStage: true },
    }),
    prisma.client.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.client.groupBy({
      by: ["leadStage"],
      where: { leadStage: { not: null } },
      _count: { _all: true },
    }),
    prisma.project.count({
      where: { status: { notIn: [ProjectStatus.CLOSED, ProjectStatus.PAUSED] } },
    }),
    prisma.task.count({
      where: { status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] } },
    }),
    prisma.charge.findMany({
      where: { status: { in: [ChargeStatus.PENDING, ChargeStatus.OVERDUE] } },
      select: { amount: true, currency: true },
    }),
    prisma.charge.findMany({
      where: {
        status: { not: ChargeStatus.CANCELLED },
        frequency: { in: [BillingFrequency.MONTHLY, BillingFrequency.YEARLY] },
      },
      select: { amount: true, currency: true, frequency: true },
    }),
    prisma.subscription.findMany({
      where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] } },
      select: { amount: true, currency: true, billingFrequency: true },
    }),
  ]);

  const item = (
    base: Omit<AgendaItem, "overdue" | "date">,
    date: Date,
  ): AgendaItem => ({ ...base, date: date.toISOString(), overdue: date < now });

  const agenda: AgendaItem[] = [
    ...tasks.map((task) =>
      item(
        {
          kind: "TASK",
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          clientId: task.clientId,
          clientName: task.client?.businessName ?? null,
          projectId: task.projectId,
          projectName: task.project?.name ?? null,
        },
        task.dueDate as Date,
      ),
    ),
    ...charges.map((charge) =>
      item(
        {
          kind: "CHARGE",
          id: charge.id,
          title: charge.concept,
          status: charge.status,
          clientId: charge.clientId,
          clientName: charge.client?.businessName ?? null,
          projectId: charge.projectId,
          projectName: charge.project?.name ?? null,
          amount: charge.amount.toString(),
          currency: charge.currency,
        },
        charge.dueDate as Date,
      ),
    ),
    ...renewals.map((renewal) =>
      item(
        {
          kind: "RENEWAL",
          id: renewal.id,
          title: renewal.notes || `Renovación ${renewal.entityType.toLowerCase()}`,
          status: renewal.status,
          clientId: renewal.clientId,
          clientName: renewal.client?.businessName ?? null,
          projectId: renewal.projectId,
          projectName: renewal.project?.name ?? null,
          amount: renewal.amount?.toString() ?? null,
          currency: renewal.currency,
        },
        renewal.dueDate,
      ),
    ),
    ...domains.map((domain) =>
      item(
        {
          kind: "DOMAIN",
          id: domain.id,
          title: domain.autoRenew
            ? `${domain.domainName} (renovación automática)`
            : domain.domainName,
          status: domain.status,
          clientId: domain.clientId,
          clientName: domain.client?.businessName ?? null,
          projectId: domain.projectId,
          projectName: domain.project?.name ?? null,
        },
        domain.expirationDate as Date,
      ),
    ),
    ...subscriptions.map((subscription) =>
      item(
        {
          kind: "SUBSCRIPTION",
          id: subscription.id,
          title: subscription.provider?.name
            ? `${subscription.provider.name}: ${subscription.name}`
            : subscription.name,
          status: subscription.status,
          clientId: subscription.clientId,
          clientName: subscription.client?.businessName ?? null,
          projectId: subscription.projectId,
          projectName: subscription.project?.name ?? null,
          amount: subscription.amount.toString(),
          currency: subscription.currency,
        },
        subscription.renewalDate as Date,
      ),
    ),
    ...followUps.map((client) =>
      item(
        {
          kind: "FOLLOW_UP",
          id: client.id,
          title: `Seguimiento: ${client.businessName}`,
          status: client.leadStage,
          clientId: client.id,
          clientName: client.businessName,
        },
        client.nextFollowUpAt as Date,
      ),
    ),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const pendingTotals: Record<string, number> = {};
  for (const charge of pendingCharges) {
    addAmount(pendingTotals, charge.currency, Number(charge.amount));
  }

  const monthlyIncome: Record<string, number> = {};
  for (const charge of recurringCharges) {
    addAmount(monthlyIncome, charge.currency, monthlyValue(Number(charge.amount), charge.frequency));
  }

  const monthlyCosts: Record<string, number> = {};
  for (const subscription of activeSubscriptions) {
    addAmount(
      monthlyCosts,
      subscription.currency,
      monthlyValue(Number(subscription.amount), subscription.billingFrequency),
    );
  }

  const clientsByStatus = Object.fromEntries(
    clientCounts.map((row) => [row.status, row._count._all]),
  );

  return {
    days,
    generatedAt: now.toISOString(),
    agenda,
    counts: {
      overdue: agenda.filter((entry) => entry.overdue).length,
      upcoming: agenda.filter((entry) => !entry.overdue).length,
      activeClients: clientsByStatus[ClientStatus.ACTIVE] ?? 0,
      leads: clientsByStatus[ClientStatus.LEAD] ?? 0,
      activeProjects,
      openTasks,
    },
    pipeline: Object.fromEntries(
      leadStageCounts.map((row) => [row.leadStage, row._count._all]),
    ),
    money: {
      pendingCharges: roundTotals(pendingTotals),
      monthlyRecurringIncome: roundTotals(monthlyIncome),
      monthlyRecurringCosts: roundTotals(monthlyCosts),
    },
  };
}
