import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmAlertCard from "../components/CrmAlertCard";
import CrmDataTable from "../components/CrmDataTable";
import CrmEmptyState from "../components/CrmEmptyState";
import CrmErrorState from "../components/CrmErrorState";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatCard from "../components/CrmStatCard";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { useAuth } from "../hooks/useAuth";
import {
  getActiveSubscriptions,
  getAlertsSummary,
  getExpiredRenewals,
  getExpiringDomains,
  getRecurringCosts,
  getUpcomingRenewals,
} from "../services/alertsService";

const dayOptions = [7, 30, 60, 90];

function fieldValue(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
}

function formatMoney(amount, currency = "USD") {
  if (amount === undefined || amount === null || amount === "") return "—";
  return `${currency || "USD"} ${Number(amount).toLocaleString("es-AR")}`;
}

function errorMessage(error) {
  if (error?.status === 403) return "No tenes permisos suficientes para esta accion.";
  return error?.message || "No se pudo cargar esta seccion.";
}

function booleanChip(active, activeLabel, inactiveLabel) {
  return (
    <span
      className={`crm-status-badge ${
        active ? "crm-status-badge--active" : "crm-status-badge--inactive"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function AlertsSection({ title, rows, columns, emptyMessage, error }) {
  return (
    <article className="crm-panel">
      <h3>{title}</h3>
      {error ? (
        <CrmErrorState message={error} />
      ) : (
        <CrmDataTable
          columns={columns}
          emptyMessage={emptyMessage}
          emptyTitle="Sin registros"
          rows={rows}
        />
      )}
    </article>
  );
}

function CrmAlerts() {
  const { authenticatedRequest } = useAuth();
  const [days, setDays] = useState(30);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setErrors({});

    const requests = {
      summary: getAlertsSummary(authenticatedRequest, days),
      upcomingRenewals: getUpcomingRenewals(authenticatedRequest, days),
      expiredRenewals: getExpiredRenewals(authenticatedRequest),
      expiringDomains: getExpiringDomains(authenticatedRequest, days),
      activeSubscriptions: getActiveSubscriptions(authenticatedRequest),
      recurringCosts: getRecurringCosts(authenticatedRequest),
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
        nextData[key] = key === "summary" ? null : [];
        nextErrors[key] = errorMessage(result.reason);
      }
    });

    setData(nextData);
    setErrors(nextErrors);
    setIsLoading(false);
  }, [authenticatedRequest, days]);

  useEffect(() => {
    const timer = window.setTimeout(loadAlerts, 0);
    return () => window.clearTimeout(timer);
  }, [loadAlerts]);

  const summary = data.summary;
  const alertGroups = useMemo(() => summary?.alerts ?? {}, [summary]);
  const counts = summary?.counts ?? {};
  const alertItems = useMemo(
    () => [
      ...(alertGroups.critical ?? []).map((alert) => ({
        alert,
        severity: "critical",
      })),
      ...(alertGroups.warning ?? []).map((alert) => ({
        alert,
        severity: "warning",
      })),
      ...(alertGroups.informational ?? []).map((alert) => ({
        alert,
        severity: "informational",
      })),
    ],
    [alertGroups],
  );

  const stats = [
    {
      label: "Criticas",
      value: alertGroups.critical?.length ?? 0,
      trend: "requieren prioridad",
      tone: (alertGroups.critical?.length ?? 0) > 0 ? "warning" : "primary",
    },
    {
      label: "Warning",
      value: alertGroups.warning?.length ?? 0,
      trend: `ventana ${days} dias`,
      tone: "warning",
    },
    {
      label: "Informativas",
      value: alertGroups.informational?.length ?? 0,
      trend: "estado operativo",
      tone: "cyan",
    },
    {
      label: "Renovaciones prox.",
      value: counts.upcomingRenewals ?? 0,
      trend: `proximos ${days} dias`,
      tone: "primary",
    },
    {
      label: "Renovaciones vencidas",
      value: counts.expiredRenewals ?? 0,
      trend: "pendientes",
      tone: (counts.expiredRenewals ?? 0) > 0 ? "warning" : "primary",
    },
    {
      label: "Dominios por vencer",
      value: counts.expiringDomains ?? 0,
      trend: `proximos ${days} dias`,
      tone: "cyan",
    },
    {
      label: "Suscripciones activas",
      value: counts.activeSubscriptions ?? 0,
      trend: "active/trial",
      tone: "primary",
    },
    {
      label: "Costos recurrentes",
      value: counts.recurringCosts ?? 0,
      trend: "mensual/anual/uso",
      tone: "dark",
    },
  ];

  const renewalColumns = [
    { key: "entityType", label: "Tipo", render: (row) => fieldValue(row.entityType) },
    { key: "dueDate", label: "Vence", render: (row) => formatDate(row.dueDate) },
    { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
    { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
    { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
    { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
  ];
  const domainColumns = [
    { key: "domainName", label: "Dominio", render: (row) => <strong className="crm-table-primary">{row.domainName}</strong> },
    { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
    { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
    { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
    { key: "expirationDate", label: "Expira", render: (row) => formatDate(row.expirationDate) },
  ];
  const subscriptionColumns = [
    { key: "name", label: "Nombre", render: (row) => <strong className="crm-table-primary">{row.name}</strong> },
    { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
    { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
    { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
    { key: "renewalDate", label: "Renovacion", render: (row) => formatDate(row.renewalDate) },
  ];
  const costColumns = [
    { key: "concept", label: "Concepto", render: (row) => <strong className="crm-table-primary">{row.concept}</strong> },
    { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
    { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
    { key: "frequency", label: "Ciclo", render: (row) => fieldValue(row.frequency) },
    { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
  ];

  return (
    <>
      <CrmSectionHeader
        eyebrow="Control interno"
        title="Alertas"
        description="Alertas calculadas de renovaciones, dominios, suscripciones y costos recurrentes. Sin notificaciones reales en esta fase."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={loadAlerts}
      />

      <div className="crm-filter-bar">
        <label>
          Rango
          <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
            {dayOptions.map((option) => (
              <option key={option} value={option}>
                {option} dias
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? <CrmLoadingState label="Cargando alertas operativas..." /> : null}

      {!isLoading ? (
        <>
          {errors.summary ? <CrmErrorState message={errors.summary} /> : null}

          <section className="crm-stats-grid">
            {stats.map((stat) => (
              <CrmStatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="crm-grid-2">
            <article className="crm-panel">
              <h3>Alertas calculadas</h3>
              {alertItems.length ? (
                <div className="crm-alert-list">
                  {alertItems.map((item) => (
                    <CrmAlertCard
                      key={`${item.severity}-${item.alert.type}-${item.alert.resourceId}`}
                      {...item}
                    />
                  ))}
                </div>
              ) : (
                <CrmEmptyState
                  title="Sin alertas"
                  message="No hay alertas operativas para este periodo."
                />
              )}
            </article>
            <article className="crm-panel">
              <h3>Costos estimados</h3>
              {summary?.recurringCostsEstimated?.length ? (
                <div className="crm-compact-list">
                  {summary.recurringCostsEstimated.map((item) => (
                    <div key={item.currency} className="crm-compact-item">
                      <div>
                        <strong>{item.currency}</strong>
                        <p>{item.count} costos recurrentes</p>
                      </div>
                      <span>{formatMoney(item.monthlyEstimate, item.currency)}/mes</span>
                    </div>
                  ))}
                </div>
              ) : (
                <CrmEmptyState message="No hay costos recurrentes estimados." />
              )}
            </article>
          </section>

          <section className="crm-grid-2">
            <AlertsSection
              columns={renewalColumns}
              emptyMessage="No hay renovaciones proximas en este periodo."
              error={errors.upcomingRenewals}
              rows={data.upcomingRenewals ?? []}
              title="Proximas renovaciones"
            />
            <AlertsSection
              columns={renewalColumns}
              emptyMessage="No hay renovaciones vencidas pendientes."
              error={errors.expiredRenewals}
              rows={data.expiredRenewals ?? []}
              title="Renovaciones vencidas"
            />
          </section>

          <section className="crm-grid-2">
            <AlertsSection
              columns={domainColumns}
              emptyMessage="No hay dominios por vencer en este periodo."
              error={errors.expiringDomains}
              rows={data.expiringDomains ?? []}
              title="Dominios por vencer"
            />
            <AlertsSection
              columns={subscriptionColumns}
              emptyMessage="No hay suscripciones activas o en prueba."
              error={errors.activeSubscriptions}
              rows={data.activeSubscriptions ?? []}
              title="Suscripciones activas"
            />
          </section>

          <section className="crm-grid-2">
            <AlertsSection
              columns={costColumns}
              emptyMessage="No hay costos recurrentes activos."
              error={errors.recurringCosts}
              rows={data.recurringCosts ?? []}
              title="Costos recurrentes"
            />
            <article className="crm-panel">
              <h3>Acciones</h3>
              <p>
                Las alertas son solo lectura en esta fase. Emails, cron jobs y
                notificaciones quedan para una etapa posterior.
              </p>
              {booleanChip(true, "solo lectura", "solo lectura")}
            </article>
          </section>
        </>
      ) : null}
    </>
  );
}

export default CrmAlerts;
