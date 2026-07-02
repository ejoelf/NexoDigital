import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmActivityList from "../components/CrmActivityList";
import CrmAlertCard from "../components/CrmAlertCard";
import CrmEmptyState from "../components/CrmEmptyState";
import CrmErrorState from "../components/CrmErrorState";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmMetricGrid from "../components/CrmMetricGrid";
import CrmSectionHeader from "../components/CrmSectionHeader";
import { useAuth } from "../hooks/useAuth";
import {
  getExpiredRenewals,
  getExpiringDomains,
  getAlertsSummary,
  getUpcomingRenewals,
} from "../services/alertsService";
import {
  getDashboardFinancials,
  getDashboardOperations,
  getDashboardOverview,
  getDashboardRecentActivity,
} from "../services/dashboardService";

const dashboardDays = 30;

function formatNumber(value) {
  return new Intl.NumberFormat("es-AR").format(Number(value ?? 0));
}

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(value) {
  if (!value) return "Sin estado";
  return String(value).replaceAll("_", " ").toLowerCase();
}

function errorMessage(error) {
  if (!error) return "";
  if (error.status === 403) return "Permisos insuficientes para ver esta seccion.";
  return error.message || "No se pudo cargar esta seccion.";
}

function describeRecurringCosts(costs = []) {
  if (!costs.length) return "Sin costos recurrentes";

  return costs
    .map((cost) => `${formatMoney(cost.monthlyEstimate, cost.currency)}/mes`)
    .join(" · ");
}

function buildMetrics(overview, alertsSummary) {
  const metrics = overview?.metrics ?? {};
  const alertCounts = alertsSummary?.counts ?? {};
  const alertGroups = alertsSummary?.alerts ?? {};

  return [
    {
      label: "Clientes totales",
      value: formatNumber(metrics.totalClients),
      trend: `${formatNumber(metrics.activeClients)} activos`,
      tone: "primary",
    },
    {
      label: "Proyectos totales",
      value: formatNumber(metrics.totalProjects),
      trend: `${formatNumber(metrics.activeProjects)} activos o en desarrollo`,
      tone: "cyan",
    },
    {
      label: "Trabajos realizados",
      value: formatNumber(metrics.totalWorks),
      trend: `${formatNumber(metrics.publicWorks)} publicos`,
      tone: "primary",
    },
    {
      label: "Proveedores oficiales",
      value: formatNumber(metrics.officialProviders),
      trend: "base operativa",
      tone: "cyan",
    },
    {
      label: "Suscripciones activas",
      value: formatNumber(metrics.activeSubscriptions),
      trend: "activas o en prueba",
      tone: "primary",
    },
    {
      label: "Dominios activos",
      value: formatNumber(metrics.activeDomains),
      trend: `${formatNumber(alertCounts.expiringDomains)} por vencer`,
      tone: "cyan",
    },
    {
      label: "Renovaciones proximas",
      value: formatNumber(metrics.upcomingRenewals),
      trend: `proximos ${overview?.days ?? dashboardDays} dias`,
      tone: "warning",
    },
    {
      label: "Renovaciones vencidas",
      value: formatNumber(metrics.expiredRenewals),
      trend: "requieren revision",
      tone: Number(metrics.expiredRenewals) > 0 ? "warning" : "primary",
    },
    {
      label: "Costos recurrentes",
      value: formatNumber(metrics.recurringCosts),
      trend: describeRecurringCosts(overview?.recurringCostsEstimated),
      tone: "dark",
    },
    {
      label: "Alertas criticas",
      value: formatNumber(alertGroups.critical?.length),
      trend: "prioridad alta",
      tone: Number(alertGroups.critical?.length) > 0 ? "warning" : "primary",
    },
    {
      label: "Alertas warning",
      value: formatNumber(alertGroups.warning?.length),
      trend: "seguimiento operativo",
      tone: "warning",
    },
    {
      label: "Alertas informativas",
      value: formatNumber(alertGroups.informational?.length),
      trend: "estado general",
      tone: "cyan",
    },
  ];
}

function buildActivityItems(recentActivity) {
  if (!recentActivity) return [];

  const groups = [
    {
      type: "client",
      rows: recentActivity.latestClients,
      title: (item) => item.businessName,
      detail: (item) => `Cliente ${formatStatus(item.status)}`,
    },
    {
      type: "project",
      rows: recentActivity.latestProjects,
      title: (item) => item.name,
      detail: (item) =>
        `Proyecto ${formatStatus(item.status)}${item.client ? ` · ${item.client.businessName}` : ""}`,
    },
    {
      type: "work",
      rows: recentActivity.latestWorks,
      title: (item) => item.title,
      detail: (item) =>
        `Trabajo ${formatStatus(item.status)} · ${item.isPublic ? "publico" : "interno"}`,
    },
    {
      type: "subscription",
      rows: recentActivity.latestSubscriptions,
      title: (item) => item.name,
      detail: (item) =>
        `Suscripcion ${formatStatus(item.status)}${item.provider ? ` · ${item.provider.name}` : ""}`,
    },
    {
      type: "domain",
      rows: recentActivity.latestDomains,
      title: (item) => item.domainName,
      detail: (item) =>
        `Dominio ${formatStatus(item.status)} · vence ${formatDate(item.expirationDate)}`,
    },
    {
      type: "renewal",
      rows: recentActivity.latestRenewals,
      title: (item) => item.entityType,
      detail: (item) =>
        `Renovacion ${formatStatus(item.status)} · vence ${formatDate(item.dueDate)}`,
    },
    {
      type: "cost",
      rows: recentActivity.latestCosts,
      title: (item) => item.concept,
      detail: (item) =>
        `${formatMoney(item.amount, item.currency)} · ${formatStatus(item.status)}`,
    },
  ];

  return groups
    .flatMap((group) =>
      (group.rows ?? []).map((item) => ({
        id: item.id,
        type: group.type,
        title: group.title(item),
        detail: group.detail(item),
        time: formatDate(item.updatedAt ?? item.createdAt),
        sortDate: new Date(item.updatedAt ?? item.createdAt ?? 0).getTime(),
      })),
    )
    .sort((a, b) => b.sortDate - a.sortDate)
    .slice(0, 10);
}

function StatusBreakdown({ title, items, emptyMessage }) {
  return (
    <article className="crm-panel">
      <h3>{title}</h3>
      {items?.length ? (
        <div className="crm-breakdown-list">
          {items.map((item) => (
            <div key={item.status} className="crm-breakdown-item">
              <span>{formatStatus(item.status)}</span>
              <strong>{formatNumber(item.count)}</strong>
            </div>
          ))}
        </div>
      ) : (
        <CrmEmptyState message={emptyMessage} />
      )}
    </article>
  );
}

function RenewalList({ title, items, emptyMessage }) {
  return (
    <article className="crm-panel">
      <h3>{title}</h3>
      {items?.length ? (
        <div className="crm-compact-list">
          {items.map((item) => (
            <div key={item.id} className="crm-compact-item">
              <div>
                <strong>{item.entityType || item.domainName || "Registro"}</strong>
                <p>
                  {item.client?.businessName || item.project?.name || item.provider?.name || "Sin relacion"}
                </p>
              </div>
              <span>{formatDate(item.dueDate || item.expirationDate)}</span>
            </div>
          ))}
        </div>
      ) : (
        <CrmEmptyState message={emptyMessage} />
      )}
    </article>
  );
}

function FinancialSummary({ financials }) {
  const recurring = financials?.recurringCostsEstimatedByCurrency ?? [];
  const activeCosts = financials?.activeCostsByCurrency ?? [];
  const subscriptions = financials?.activeSubscriptionsByCurrency ?? [];
  const rows = [
    ...recurring.map((item) => ({
      label: `Recurrente ${item.currency}`,
      value: `${formatMoney(item.monthlyEstimate, item.currency)}/mes`,
      detail: `${formatMoney(item.yearlyEstimate, item.currency)}/anio estimado`,
    })),
    ...activeCosts.map((item) => ({
      label: `Costos activos ${item.currency}`,
      value: formatMoney(item.total, item.currency),
      detail: `${formatNumber(item.count)} registros`,
    })),
    ...subscriptions.map((item) => ({
      label: `Suscripciones ${item.currency}`,
      value: formatMoney(item.total, item.currency),
      detail: `${formatNumber(item.count)} activas`,
    })),
  ];

  return (
    <article className="crm-panel">
      <h3>Resumen financiero</h3>
      {rows.length ? (
        <div className="crm-compact-list">
          {rows.map((row) => (
            <div key={`${row.label}-${row.value}`} className="crm-compact-item">
              <div>
                <strong>{row.label}</strong>
                <p>{row.detail}</p>
              </div>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <CrmEmptyState
          message="No hay costos, suscripciones o renovaciones con monto para resumir."
        />
      )}
    </article>
  );
}

function AlertsPanel({ summary }) {
  const alerts = summary?.alerts ?? {};
  const items = [
    ...(alerts.critical ?? []).map((alert) => ({ alert, severity: "critical" })),
    ...(alerts.warning ?? []).map((alert) => ({ alert, severity: "warning" })),
    ...(alerts.informational ?? []).map((alert) => ({
      alert,
      severity: "informational",
    })),
  ];

  return (
    <article className="crm-panel">
      <h3>Alertas operativas</h3>
      {items.length ? (
        <div className="crm-alert-list">
          {items.map((item) => (
            <CrmAlertCard
              key={`${item.severity}-${item.alert.type}-${item.alert.resourceId}`}
              {...item}
            />
          ))}
        </div>
      ) : (
        <CrmEmptyState message="No hay alertas calculadas para este periodo." />
      )}
    </article>
  );
}

function CrmDashboard() {
  const { authenticatedRequest } = useAuth();
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    const requests = {
      overview: getDashboardOverview(authenticatedRequest, dashboardDays),
      operations: getDashboardOperations(authenticatedRequest, dashboardDays),
      financials: getDashboardFinancials(authenticatedRequest, dashboardDays),
      recentActivity: getDashboardRecentActivity(authenticatedRequest),
      alertsSummary: getAlertsSummary(authenticatedRequest, dashboardDays),
      upcomingRenewals: getUpcomingRenewals(authenticatedRequest, dashboardDays),
      expiredRenewals: getExpiredRenewals(authenticatedRequest),
      expiringDomains: getExpiringDomains(authenticatedRequest, dashboardDays),
    };

    const entries = Object.entries(requests);
    const results = await Promise.allSettled(entries.map(([, request]) => request));

    const nextData = {};
    const nextErrors = {};

    results.forEach((result, index) => {
      const key = entries[index][0];

      if (result.status === "fulfilled") {
        nextData[key] = result.value;
      } else {
        nextErrors[key] = errorMessage(result.reason);
      }
    });

    setData(nextData);
    setErrors(nextErrors);
    setIsLoading(false);
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const metrics = useMemo(
    () => buildMetrics(data.overview, data.alertsSummary),
    [data.alertsSummary, data.overview],
  );
  const activityItems = useMemo(
    () => buildActivityItems(data.recentActivity),
    [data.recentActivity],
  );

  const hasAllZeroCounts = metrics.every(
    (metric) => Number(String(metric.value).replace(/\D/g, "")) === 0,
  );

  return (
    <>
      <CrmSectionHeader
        eyebrow="Resumen operativo"
        title="Dashboard NexoDigital"
        description="Vista conectada al backend CRM para leer estado general, alertas, actividad y costos operativos."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={loadDashboard}
      />

      <CrmMetricGrid
        error={errors.overview}
        isLoading={isLoading}
        metrics={metrics}
      />

      {isLoading ? (
        <CrmLoadingState label="Cargando secciones del dashboard..." />
      ) : (
        <>
          {hasAllZeroCounts ? (
            <div className="crm-dashboard-note">
              <strong>Base operativa sin registros</strong>
              <p>
                El backend respondio correctamente. El dashboard queda listo para
                completarse cuando se creen clientes, proyectos, trabajos y costos.
              </p>
            </div>
          ) : null}

          <section className="crm-grid-2">
            {errors.alertsSummary ? (
              <CrmErrorState message={errors.alertsSummary} />
            ) : (
              <AlertsPanel summary={data.alertsSummary} />
            )}

            {errors.recentActivity ? (
              <CrmErrorState message={errors.recentActivity} />
            ) : (
              <article className="crm-panel">
                <h3>Actividad reciente</h3>
                <CrmActivityList items={activityItems} />
              </article>
            )}
          </section>

          <section className="crm-grid-2">
            {errors.upcomingRenewals ? (
              <CrmErrorState message={errors.upcomingRenewals} />
            ) : (
              <RenewalList
                emptyMessage="No hay renovaciones proximas dentro del periodo seleccionado."
                items={data.upcomingRenewals}
                title="Proximas renovaciones"
              />
            )}

            {errors.expiringDomains ? (
              <CrmErrorState message={errors.expiringDomains} />
            ) : (
              <RenewalList
                emptyMessage="No hay dominios por vencer dentro del periodo seleccionado."
                items={data.expiringDomains}
                title="Dominios por vencer"
              />
            )}
          </section>

          <section className="crm-grid-2">
            {errors.financials ? (
              <CrmErrorState message={errors.financials} />
            ) : (
              <FinancialSummary financials={data.financials} />
            )}

            {errors.expiredRenewals ? (
              <CrmErrorState message={errors.expiredRenewals} />
            ) : (
              <RenewalList
                emptyMessage="No hay renovaciones vencidas pendientes."
                items={data.expiredRenewals}
                title="Renovaciones vencidas"
              />
            )}
          </section>

          {errors.operations ? (
            <CrmErrorState message={errors.operations} />
          ) : (
            <section className="crm-grid-3">
              <StatusBreakdown
                emptyMessage="Todavia no hay proyectos para agrupar."
                items={data.operations?.projectsByStatus}
                title="Proyectos por estado"
              />
              <StatusBreakdown
                emptyMessage="Todavia no hay clientes para agrupar."
                items={data.operations?.clientsByStatus}
                title="Clientes por estado"
              />
              <StatusBreakdown
                emptyMessage="Todavia no hay trabajos para agrupar."
                items={data.operations?.worksByStatus}
                title="Trabajos por estado"
              />
            </section>
          )}
        </>
      )}
    </>
  );
}

export default CrmDashboard;
