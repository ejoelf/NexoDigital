import {
  BillingFrequency,
  ClientStatus,
  CostStatus,
  DomainStatus,
  ProjectStatus,
  ProviderStatus,
  WorkStatus,
} from "@prisma/client";
import {
  getActiveSubscriptions,
  getAlertsSummary,
  getExpiredRenewals,
  getExpiringDomains,
  getRecurringCosts,
  getUpcomingRenewals,
} from "./alerts.service.js";
import { prisma } from "../prisma/client.js";

const projectActiveStatuses = [
  ProjectStatus.ANALYSIS,
  ProjectStatus.DESIGN,
  ProjectStatus.DEVELOPMENT,
  ProjectStatus.TESTING,
  ProjectStatus.DEPLOYED,
  ProjectStatus.MAINTENANCE,
];

function toNumber(value: { toString(): string }) {
  return Number(value.toString());
}

function monthlyEquivalent(amount: number, frequency: BillingFrequency) {
  if (frequency === BillingFrequency.YEARLY) return amount / 12;
  return amount;
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function groupCounts<T extends string>(
  rows: Array<{ status: T; _count: { status: number } }>,
) {
  return rows.map((row) => ({
    status: row.status,
    count: row._count.status,
  }));
}

function pushCurrencyTotal(
  map: Map<string, { currency: string; total: number; count: number }>,
  currency: string,
  amount: number,
) {
  const current = map.get(currency) ?? { currency, total: 0, count: 0 };
  current.total += amount;
  current.count += 1;
  map.set(currency, current);
}

function pushRecurringEstimate(
  map: Map<
    string,
    { currency: string; monthlyEstimate: number; yearlyEstimate: number; count: number }
  >,
  currency: string,
  amount: number,
  frequency: BillingFrequency,
) {
  const current = map.get(currency) ?? {
    currency,
    monthlyEstimate: 0,
    yearlyEstimate: 0,
    count: 0,
  };
  const monthly = monthlyEquivalent(amount, frequency);

  current.monthlyEstimate += monthly;
  current.yearlyEstimate += monthly * 12;
  current.count += 1;
  map.set(currency, current);
}

function normalizeCurrencyTotals(
  map: Map<string, { currency: string; total: number; count: number }>,
) {
  return Array.from(map.values()).map((item) => ({
    ...item,
    total: roundMoney(item.total),
  }));
}

function normalizeRecurringEstimates(
  map: Map<
    string,
    { currency: string; monthlyEstimate: number; yearlyEstimate: number; count: number }
  >,
) {
  return Array.from(map.values()).map((item) => ({
    ...item,
    monthlyEstimate: roundMoney(item.monthlyEstimate),
    yearlyEstimate: roundMoney(item.yearlyEstimate),
  }));
}

export async function getDashboardOverview(days: number) {
  const [
    totalClients,
    activeClients,
    totalProjects,
    activeProjects,
    totalWorks,
    publicWorks,
    officialProviders,
    activeDomains,
    alertsSummary,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { status: ClientStatus.ACTIVE } }),
    prisma.project.count(),
    prisma.project.count({ where: { status: { in: projectActiveStatuses } } }),
    prisma.work.count(),
    prisma.work.count({ where: { isPublic: true } }),
    prisma.provider.count({
      where: { isOfficial: true, status: { not: ProviderStatus.DEPRECATED } },
    }),
    prisma.domain.count({ where: { status: DomainStatus.ACTIVE } }),
    getAlertsSummary(days),
  ]);

  return {
    days,
    generatedAt: new Date(),
    metrics: {
      totalClients,
      activeClients,
      totalProjects,
      activeProjects,
      totalWorks,
      publicWorks,
      officialProviders,
      activeSubscriptions: alertsSummary.counts.activeSubscriptions,
      activeDomains,
      upcomingRenewals: alertsSummary.counts.upcomingRenewals,
      expiredRenewals: alertsSummary.counts.expiredRenewals,
      recurringCosts: alertsSummary.counts.recurringCosts,
    },
    recurringCostsEstimated: alertsSummary.recurringCostsEstimated,
    alerts: alertsSummary.alerts,
  };
}

export async function getDashboardOperations(days: number) {
  const [
    projectsByStatus,
    clientsByStatus,
    worksByStatus,
    upcomingRenewals,
    expiringDomains,
    activeSubscriptions,
    latestProjects,
    latestWorks,
  ] = await Promise.all([
    prisma.project.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { status: "asc" },
    }),
    prisma.client.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { status: "asc" },
    }),
    prisma.work.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { status: "asc" },
    }),
    getUpcomingRenewals(days),
    getExpiringDomains(days),
    getActiveSubscriptions(),
    prisma.project.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        client: { select: { id: true, businessName: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    }),
    prisma.work.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        isPublic: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        client: { select: { id: true, businessName: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  return {
    days,
    generatedAt: new Date(),
    projectsByStatus: groupCounts<ProjectStatus>(projectsByStatus),
    clientsByStatus: groupCounts<ClientStatus>(clientsByStatus),
    worksByStatus: groupCounts<WorkStatus>(worksByStatus),
    upcomingRenewals,
    expiringDomains,
    activeSubscriptions,
    latestProjects,
    latestWorks,
  };
}

export async function getDashboardFinancials(days: number) {
  const [activeCosts, recurringCosts, activeSubscriptions, upcomingRenewals] =
    await Promise.all([
      prisma.cost.findMany({
        where: { status: CostStatus.ACTIVE },
        select: {
          id: true,
          concept: true,
          category: true,
          amount: true,
          currency: true,
          frequency: true,
          date: true,
          provider: { select: { id: true, name: true, category: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: [{ date: "desc" }, { concept: "asc" }],
      }),
      getRecurringCosts(),
      getActiveSubscriptions(),
      getUpcomingRenewals(days),
    ]);

  const activeCostsByCurrency = new Map<
    string,
    { currency: string; total: number; count: number }
  >();
  const recurringCostsByCurrency = new Map<
    string,
    { currency: string; monthlyEstimate: number; yearlyEstimate: number; count: number }
  >();
  const costsByProvider = new Map<
    string,
    { providerId: string | null; providerName: string; currency: string; total: number; count: number }
  >();
  const costsByProject = new Map<
    string,
    { projectId: string | null; projectName: string; currency: string; total: number; count: number }
  >();
  const subscriptionsByCurrency = new Map<
    string,
    { currency: string; total: number; count: number }
  >();

  for (const cost of activeCosts) {
    const amount = toNumber(cost.amount);
    pushCurrencyTotal(activeCostsByCurrency, cost.currency, amount);

    const providerKey = `${cost.provider?.id ?? "unassigned"}:${cost.currency}`;
    const providerTotal = costsByProvider.get(providerKey) ?? {
      providerId: cost.provider?.id ?? null,
      providerName: cost.provider?.name ?? "Sin proveedor",
      currency: cost.currency,
      total: 0,
      count: 0,
    };
    providerTotal.total += amount;
    providerTotal.count += 1;
    costsByProvider.set(providerKey, providerTotal);

    const projectKey = `${cost.project?.id ?? "unassigned"}:${cost.currency}`;
    const projectTotal = costsByProject.get(projectKey) ?? {
      projectId: cost.project?.id ?? null,
      projectName: cost.project?.name ?? "Sin proyecto",
      currency: cost.currency,
      total: 0,
      count: 0,
    };
    projectTotal.total += amount;
    projectTotal.count += 1;
    costsByProject.set(projectKey, projectTotal);
  }

  for (const cost of recurringCosts) {
    pushRecurringEstimate(
      recurringCostsByCurrency,
      cost.currency,
      toNumber(cost.amount),
      cost.frequency,
    );
  }

  for (const subscription of activeSubscriptions) {
    pushCurrencyTotal(
      subscriptionsByCurrency,
      subscription.currency,
      toNumber(subscription.amount),
    );
  }

  return {
    days,
    generatedAt: new Date(),
    activeCostsByCurrency: normalizeCurrencyTotals(activeCostsByCurrency),
    recurringCostsEstimatedByCurrency:
      normalizeRecurringEstimates(recurringCostsByCurrency),
    costsByProvider: Array.from(costsByProvider.values()).map((item) => ({
      ...item,
      total: roundMoney(item.total),
    })),
    costsByProject: Array.from(costsByProject.values()).map((item) => ({
      ...item,
      total: roundMoney(item.total),
    })),
    activeSubscriptionsByCurrency:
      normalizeCurrencyTotals(subscriptionsByCurrency),
    upcomingRenewalsWithAmount: upcomingRenewals
      .filter((renewal) => renewal.amount !== null)
      .map((renewal) => ({
        id: renewal.id,
        entityType: renewal.entityType,
        entityId: renewal.entityId,
        dueDate: renewal.dueDate,
        amount: renewal.amount,
        currency: renewal.currency,
        status: renewal.status,
        client: renewal.client,
        project: renewal.project,
      })),
  };
}

export async function getDashboardRecentActivity() {
  const [
    latestClients,
    latestProjects,
    latestWorks,
    latestSubscriptions,
    latestDomains,
    latestRenewals,
    latestCosts,
  ] = await Promise.all([
    prisma.client.findMany({
      take: 5,
      select: {
        id: true,
        businessName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.project.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        client: { select: { id: true, businessName: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.work.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.subscription.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        renewalDate: true,
        createdAt: true,
        updatedAt: true,
        provider: { select: { id: true, name: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.domain.findMany({
      take: 5,
      select: {
        id: true,
        domainName: true,
        status: true,
        expirationDate: true,
        createdAt: true,
        updatedAt: true,
        provider: { select: { id: true, name: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.renewal.findMany({
      take: 5,
      select: {
        id: true,
        entityType: true,
        entityId: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.cost.findMany({
      take: 5,
      select: {
        id: true,
        concept: true,
        category: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        provider: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: [{ updatedAt: "desc" }],
    }),
  ]);

  return {
    generatedAt: new Date(),
    latestClients,
    latestProjects,
    latestWorks,
    latestSubscriptions,
    latestDomains,
    latestRenewals,
    latestCosts,
  };
}
