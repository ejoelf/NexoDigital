import React, { useCallback, useEffect, useState } from "react";
import CrmErrorState from "../components/CrmErrorState";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmSectionHeader from "../components/CrmSectionHeader";
import { label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { getDashboardHome } from "../services/homeService";
import {
  actionErrorMessage,
  daysUntil,
  formatDate,
  formatMoney,
  formatTotals,
  relativeDay,
} from "../utils/format";

const HORIZON_DAYS = 30;

const KIND = {
  TASK: { text: "Tarea", path: "/crm/tasks" },
  CHARGE: { text: "Cobro", path: "/crm/charges" },
  RENEWAL: { text: "Renovación", path: "/crm/operations" },
  DOMAIN: { text: "Dominio", path: "/crm/operations" },
  SUBSCRIPTION: { text: "Suscripción", path: "/crm/operations" },
  FOLLOW_UP: { text: "Seguimiento", path: "/crm/pipeline" },
};

// Accesos directos a las plataformas que usa NexoDigital.
const PLATFORMS = [
  { name: "Render", url: "https://dashboard.render.com", note: "Webs y backends" },
  { name: "Vercel", url: "https://vercel.com/dashboard", note: "Frontends" },
  { name: "Neon", url: "https://console.neon.tech", note: "Bases de datos" },
  { name: "GitHub", url: "https://github.com/ejoelf", note: "Repositorios" },
  { name: "Hostinger", url: "https://hpanel.hostinger.com/domains", note: "Dominios" },
  { name: "Perfil de Google", url: "https://business.google.com", note: "Reseñas" },
  { name: "Instagram", url: "https://www.instagram.com/nexodigital_ar/", note: "@nexodigital_ar" },
  { name: "WhatsApp Business", url: "https://web.whatsapp.com", note: "Mensajes" },
];

function groupAgenda(agenda) {
  const groups = { overdue: [], week: [], later: [] };
  for (const item of agenda) {
    const days = daysUntil(item.date);
    if (days < 0) groups.overdue.push(item);
    else if (days <= 7) groups.week.push(item);
    else groups.later.push(item);
  }
  return groups;
}

function AgendaList({ title, items, tone }) {
  if (!items.length) return null;
  return (
    <section className={`crm-agenda-group crm-agenda-group--${tone}`}>
      <h3>
        {title} <small>{items.length}</small>
      </h3>
      <ul>
        {items.map((item) => {
          const kind = KIND[item.kind] ?? { text: item.kind, path: "/crm" };
          const context = [item.clientName, item.projectName].filter(Boolean).join(" · ");
          return (
            <li key={`${item.kind}-${item.id}`}>
              <a href={kind.path}>
                <span className={`crm-agenda-kind crm-agenda-kind--${item.kind.toLowerCase()}`}>
                  {kind.text}
                </span>
                <span className="crm-agenda-main">
                  <strong>{item.title}</strong>
                  {context ? <small>{context}</small> : null}
                </span>
                <span className="crm-agenda-side">
                  {item.amount ? <strong>{formatMoney(item.amount, item.currency)}</strong> : null}
                  {item.priority === "HIGH" ? <em>Prioridad alta</em> : null}
                  <small>
                    {formatDate(item.date)} · {relativeDay(item.date)}
                  </small>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CrmHome() {
  const { authenticatedRequest, user } = useAuth();
  const [home, setHome] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setHome(await getDashboardHome(authenticatedRequest, HORIZON_DAYS));
    } catch (loadError) {
      setError(actionErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const groups = groupAgenda(home?.agenda ?? []);
  const firstName = (user?.name ?? "").split(" ")[0];
  const today = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <CrmSectionHeader
        eyebrow={today}
        title={firstName ? `Hola, ${firstName}` : "Inicio"}
        description={`Lo que vence o tenés que hacer en los próximos ${HORIZON_DAYS} días.`}
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={load}
      />

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading && !home ? (
        <CrmLoadingState label="Cargando… si el servidor estaba dormido puede tardar un minuto." />
      ) : null}

      {home ? (
        <>
          <section className="crm-home-stats">
            <article className={home.counts.overdue ? "crm-home-stat crm-home-stat--danger" : "crm-home-stat"}>
              <span>Vencido o atrasado</span>
              <strong>{home.counts.overdue}</strong>
            </article>
            <article className="crm-home-stat">
              <span>Próximos {HORIZON_DAYS} días</span>
              <strong>{home.counts.upcoming}</strong>
            </article>
            <article className="crm-home-stat">
              <span>Clientes activos</span>
              <strong>{home.counts.activeClients}</strong>
            </article>
            <article className="crm-home-stat">
              <span>Prospectos</span>
              <strong>{home.counts.leads}</strong>
            </article>
            <article className="crm-home-stat">
              <span>Webs y proyectos activos</span>
              <strong>{home.counts.activeProjects}</strong>
            </article>
            <article className="crm-home-stat">
              <span>Tareas abiertas</span>
              <strong>{home.counts.openTasks}</strong>
            </article>
          </section>

          <section className="crm-summary-strip">
            <article>
              <span>Pendiente de cobro</span>
              <strong>{formatTotals(home.money.pendingCharges)}</strong>
            </article>
            <article>
              <span>Ingreso recurrente por mes</span>
              <strong>{formatTotals(home.money.monthlyRecurringIncome)}</strong>
            </article>
            <article>
              <span>Costo fijo por mes</span>
              <strong>{formatTotals(home.money.monthlyRecurringCosts)}</strong>
            </article>
          </section>

          <div className="crm-home-columns">
            <section className="crm-panel crm-agenda">
              <h2>Agenda</h2>
              {home.agenda.length ? (
                <>
                  <AgendaList items={groups.overdue} title="Vencido" tone="danger" />
                  <AgendaList items={groups.week} title="Esta semana" tone="warning" />
                  <AgendaList items={groups.later} title={`Hasta ${HORIZON_DAYS} días`} tone="normal" />
                </>
              ) : (
                <p className="crm-sheet-empty">
                  Nada vence en los próximos {HORIZON_DAYS} días. Podés cargar tareas con fecha para verlas acá.
                </p>
              )}
            </section>

            <aside className="crm-home-side">
              <section className="crm-panel">
                <h2>Prospectos por etapa</h2>
                {Object.keys(home.pipeline).length ? (
                  <ul className="crm-mini-list">
                    {Object.entries(home.pipeline).map(([stage, count]) => (
                      <li key={stage}>
                        <span>{label(stage)}</span>
                        <strong>{count}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="crm-sheet-empty">Todavía no cargaste prospectos.</p>
                )}
                <a className="crm-text-link" href="/crm/pipeline">
                  Ver prospectos
                </a>
              </section>

              <section className="crm-panel">
                <h2>Accesos directos</h2>
                <ul className="crm-platforms">
                  {PLATFORMS.map((platform) => (
                    <li key={platform.name}>
                      <a href={platform.url} rel="noopener noreferrer" target="_blank">
                        <strong>{platform.name}</strong>
                        <small>{platform.note}</small>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </>
      ) : null}
    </>
  );
}

export default CrmHome;
