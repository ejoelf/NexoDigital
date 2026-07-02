import {
  BillingFrequency,
  CostStatus,
  DomainStatus,
  RenewalStatus,
  SubscriptionStatus,
} from "@prisma/client";
import { HttpError } from "../common/http-error.js";
import { prisma } from "../prisma/client.js";

type AlertSeverity = "critical" | "warning" | "info";

type OperationalAlert = {
  severity: AlertSeverity;
  type: string;
  message: string;
  resourceId: string;
  resourceLabel: string;
  dueDate?: Date | null;
};

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

const renewalPublicInclude = {
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
} as const;

const domainPublicInclude = {
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
  provider: { select: { id: true, name: true, category: true } },
} as const;

const subscriptionPublicInclude = {
  provider: { select: { id: true, name: true, category: true } },
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
} as const;

const costPublicInclude = {
  provider: { select: { id: true, name: true, category: true } },
  client: { select: { id: true, businessName: true } },
  project: { select: { id: true, name: true } },
  subscription: { select: { id: true, name: true, status: true } },
} as const;

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function parseAlertDays(value: unknown) {
  if (value === undefined) return DEFAULT_DAYS;

  const daysValue = Array.isArray(value) ? value[0] : value;
  const days = Number(daysValue);

  if (!Number.isInteger(days) || days <= 0 || days > MAX_DAYS) {
    throw new HttpError(400, `days must be an integer between 1 and ${MAX_DAYS}.`);
  }

  return days;
}

function dateWindow(days: number) {
  const today = startOfToday();
  const limit = addDays(today, days);

  return { today, limit };
}

export async function getUpcomingRenewals(days: number) {
  const { today, limit } = dateWindow(days);

  return prisma.renewal.findMany({
    where: {
      dueDate: {
        gte: today,
        lte: limit,
      },
      status: { notIn: [RenewalStatus.PAID, RenewalStatus.CANCELLED] },
    },
    include: renewalPublicInclude,
    orderBy: [{ dueDate: "asc" }],
  });
}

export async function getExpiredRenewals() {
  const today = startOfToday();

  return prisma.renewal.findMany({
    where: {
      dueDate: { lt: today },
      status: { notIn: [RenewalStatus.PAID, RenewalStatus.CANCELLED] },
    },
    include: renewalPublicInclude,
    orderBy: [{ dueDate: "asc" }],
  });
}

export async function getExpiringDomains(days: number) {
  const { today, limit } = dateWindow(days);

  return prisma.domain.findMany({
    where: {
      expirationDate: {
        gte: today,
        lte: limit,
      },
      status: DomainStatus.ACTIVE,
    },
    include: domainPublicInclude,
    orderBy: [{ expirationDate: "asc" }, { domainName: "asc" }],
  });
}

export async function getActiveSubscriptions() {
  return prisma.subscription.findMany({
    where: {
      status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
    },
    include: subscriptionPublicInclude,
    orderBy: [{ renewalDate: "asc" }, { name: "asc" }],
  });
}

export async function getRecurringCosts() {
  return prisma.cost.findMany({
    where: {
      status: CostStatus.ACTIVE,
      frequency: {
        in: [
          BillingFrequency.MONTHLY,
          BillingFrequency.YEARLY,
          BillingFrequency.USAGE_BASED,
        ],
      },
    },
    include: costPublicInclude,
    orderBy: [{ date: "desc" }, { concept: "asc" }],
  });
}

function toNumber(value: { toString(): string }) {
  return Number(value.toString());
}

function monthlyEquivalent(amount: number, frequency: BillingFrequency) {
  if (frequency === BillingFrequency.YEARLY) return amount / 12;
  return amount;
}

function buildCostEstimate(
  costs: Awaited<ReturnType<typeof getRecurringCosts>>,
) {
  const byCurrency = new Map<
    string,
    {
      currency: string;
      monthlyEstimate: number;
      yearlyEstimate: number;
      count: number;
    }
  >();

  for (const cost of costs) {
    const amount = toNumber(cost.amount);
    const current = byCurrency.get(cost.currency) ?? {
      currency: cost.currency,
      monthlyEstimate: 0,
      yearlyEstimate: 0,
      count: 0,
    };
    const monthly = monthlyEquivalent(amount, cost.frequency);

    current.monthlyEstimate += monthly;
    current.yearlyEstimate += monthly * 12;
    current.count += 1;
    byCurrency.set(cost.currency, current);
  }

  return Array.from(byCurrency.values()).map((item) => ({
    ...item,
    monthlyEstimate: Number(item.monthlyEstimate.toFixed(2)),
    yearlyEstimate: Number(item.yearlyEstimate.toFixed(2)),
  }));
}

function buildRenewalAlert(
  renewal: Awaited<ReturnType<typeof getUpcomingRenewals>>[number],
  severity: AlertSeverity,
) {
  return {
    severity,
    type: severity === "critical" ? "EXPIRED_RENEWAL" : "UPCOMING_RENEWAL",
    message:
      severity === "critical"
        ? `Renovacion vencida: ${renewal.entityType}`
        : `Renovacion proxima: ${renewal.entityType}`,
    resourceId: renewal.id,
    resourceLabel: renewal.entityType,
    dueDate: renewal.dueDate,
  } satisfies OperationalAlert;
}

function buildDomainAlert(
  domain: Awaited<ReturnType<typeof getExpiringDomains>>[number],
) {
  return {
    severity: "warning",
    type: "EXPIRING_DOMAIN",
    message: `Dominio por vencer: ${domain.domainName}`,
    resourceId: domain.id,
    resourceLabel: domain.domainName,
    dueDate: domain.expirationDate,
  } satisfies OperationalAlert;
}

function buildInfoAlert(type: string, message: string, count: number) {
  return {
    severity: "info",
    type,
    message,
    resourceId: type,
    resourceLabel: String(count),
  } satisfies OperationalAlert;
}

export async function getAlertsSummary(days: number) {
  const [
    upcomingRenewals,
    expiredRenewals,
    expiringDomains,
    activeSubscriptions,
    recurringCosts,
  ] = await Promise.all([
    getUpcomingRenewals(days),
    getExpiredRenewals(),
    getExpiringDomains(days),
    getActiveSubscriptions(),
    getRecurringCosts(),
  ]);

  const criticalAlerts = expiredRenewals.map((renewal) =>
    buildRenewalAlert(renewal, "critical"),
  );
  const warningAlerts = [
    ...upcomingRenewals.map((renewal) => buildRenewalAlert(renewal, "warning")),
    ...expiringDomains.map(buildDomainAlert),
  ];
  const informationalAlerts = [
    buildInfoAlert(
      "ACTIVE_SUBSCRIPTIONS",
      `Suscripciones activas o en prueba: ${activeSubscriptions.length}`,
      activeSubscriptions.length,
    ),
    buildInfoAlert(
      "RECURRING_COSTS",
      `Costos recurrentes activos: ${recurringCosts.length}`,
      recurringCosts.length,
    ),
  ];

  return {
    days,
    generatedAt: new Date(),
    counts: {
      upcomingRenewals: upcomingRenewals.length,
      expiredRenewals: expiredRenewals.length,
      expiringDomains: expiringDomains.length,
      activeSubscriptions: activeSubscriptions.length,
      recurringCosts: recurringCosts.length,
    },
    recurringCostsEstimated: buildCostEstimate(recurringCosts),
    alerts: {
      critical: criticalAlerts,
      warning: warningAlerts,
      informational: informationalAlerts,
    },
  };
}
