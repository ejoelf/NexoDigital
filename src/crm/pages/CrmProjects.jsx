import React, { useMemo, useState } from "react";
import CrmEmptyState from "../components/CrmEmptyState";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { PROJECT_STATUSES, PROJECT_TYPES, enumOptions, label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { useCrmLists } from "../hooks/useCrmLists";
import { listClients } from "../services/clientsService";
import {
  archiveProject,
  createProject,
  listProjects,
  updateProject,
} from "../services/projectsService";
import { listProviders } from "../services/providersService";
import {
  dateToIso,
  daysUntil,
  formatDate,
  relationOptions,
  relativeDay,
  toDateInput,
  trimAll,
} from "../utils/format";

const loaders = { projects: listProjects, clients: listClients, providers: listProviders };

const STRING_FIELDS = [
  "name",
  "clientId",
  "type",
  "status",
  "description",
  "publicUrl",
  "adminUrl",
  "domain",
  "frontendRepositoryUrl",
  "backendRepositoryUrl",
  "frontendProviderId",
  "frontendDashboardUrl",
  "backendProviderId",
  "backendDashboardUrl",
  "databaseProviderId",
  "databaseDashboardUrl",
  "hostingNotes",
  "notes",
];
const DATE_FIELDS = ["startDate", "launchDate", "maintenanceStartDate"];

const emptyForm = {
  ...Object.fromEntries(STRING_FIELDS.map((key) => [key, ""])),
  ...Object.fromEntries(DATE_FIELDS.map((key) => [key, ""])),
  type: "WEBSITE",
  status: "DEVELOPMENT",
};

function providerSelect(labelText, name) {
  return {
    label: labelText,
    name,
    type: "select",
    options: (context) => relationOptions(context.providers, "name", "No usa / sin definir"),
  };
}

function shortUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function LinkOut({ href, children }) {
  if (!href) return null;
  return (
    <a className="crm-web-link" href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

function HostingRow({ role, provider, dashboardUrl }) {
  if (!provider && !dashboardUrl) return null;
  return (
    <li>
      <span className="crm-web-role">{role}</span>
      <span>
        {provider?.name ?? "—"}
        {provider?.planName ? <small> · {provider.planName}</small> : null}
      </span>
      <LinkOut href={dashboardUrl || provider?.dashboardUrl}>Abrir panel</LinkOut>
    </li>
  );
}

function domainInfo(project) {
  const domain = project.domains?.[0];
  if (!domain) return project.domain ? { name: project.domain } : null;
  const days = daysUntil(domain.expirationDate);
  return {
    name: domain.domainName,
    date: domain.expirationDate,
    autoRenew: domain.autoRenew,
    registrar: domain.registrar,
    tone: days === null ? "" : days < 0 ? "danger" : days <= 30 ? "warning" : "ok",
  };
}

function WebCards({ rows, edit, canWrite }) {
  if (!rows.length) {
    return (
      <CrmEmptyState
        title="Sin webs ni proyectos"
        message="Cargá cada web con dónde está alojada y cuándo vence su dominio."
      />
    );
  }

  return (
    <section className="crm-web-grid">
      {rows.map((project) => {
        const domain = domainInfo(project);
        return (
          <article className="crm-web-card" key={project.id}>
            <header>
              <div>
                <h3>{project.name}</h3>
                <p>
                  {project.client?.businessName ?? "Proyecto propio"} · {label(project.type)}
                </p>
              </div>
              <CrmStatusBadge status={project.status} />
            </header>

            <div className="crm-web-links">
              <LinkOut href={project.publicUrl}>
                {project.publicUrl ? shortUrl(project.publicUrl) : ""}
              </LinkOut>
              <LinkOut href={project.adminUrl}>Panel del cliente</LinkOut>
              <LinkOut href={project.frontendRepositoryUrl}>Repo frontend</LinkOut>
              <LinkOut href={project.backendRepositoryUrl}>Repo backend</LinkOut>
            </div>

            <ul className="crm-web-hosting">
              <HostingRow
                dashboardUrl={project.frontendDashboardUrl}
                provider={project.frontendProvider}
                role="Frontend"
              />
              <HostingRow
                dashboardUrl={project.backendDashboardUrl}
                provider={project.backendProvider}
                role="Backend"
              />
              <HostingRow
                dashboardUrl={project.databaseDashboardUrl}
                provider={project.databaseProvider}
                role="Base de datos"
              />
            </ul>

            {domain ? (
              <p className={`crm-web-domain crm-web-domain--${domain.tone || "none"}`}>
                <strong>{domain.name}</strong>
                {domain.date ? (
                  <span>
                    vence {formatDate(domain.date)} ({relativeDay(domain.date)})
                    {domain.autoRenew ? " · renovación automática" : ""}
                    {domain.registrar ? ` · ${domain.registrar}` : ""}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="crm-web-domain crm-web-domain--none">Sin dominio propio</p>
            )}

            {project.hostingNotes ? (
              <p className="crm-web-warning">{project.hostingNotes}</p>
            ) : null}

            <footer>
              <small>
                {[
                  project.launchDate ? `Publicada ${formatDate(project.launchDate)}` : "",
                  project._count?.tasks
                    ? `${project._count.tasks} ${project._count.tasks === 1 ? "tarea" : "tareas"}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
              {canWrite ? (
                <button className="crm-row-action" onClick={() => edit(project)} type="button">
                  Editar
                </button>
              ) : null}
            </footer>
          </article>
        );
      })}
    </section>
  );
}

const projectsConfig = {
  key: "projects",
  title: "Webs y proyectos",
  pluralLabel: "webs y proyectos",
  singularCountLabel: "web o proyecto",
  pluralCountLabel: "webs y proyectos",
  createLabel: "Nueva web o proyecto",
  createTitle: "Nueva web o proyecto",
  editTitle: "Editar web o proyecto",
  submitLabel: "Guardar",
  archiveButtonLabel: "Cerrar",
  archiveConfirmLabel: "Cerrar proyecto",
  archiveTitle: "Cerrar proyecto",
  archiveMessage: (row) => `${row?.name || "El proyecto"} quedará cerrado. No se borra nada.`,
  emptyTitle: "Sin webs ni proyectos",
  emptyMessage: "Cargá cada web con dónde está alojada.",
  formDescription:
    "Dónde vive cada parte de la web y los enlaces directos a cada panel. Las contraseñas van en tu gestor de contraseñas, no acá.",
  emptyForm,
  // Publicadas y en mantenimiento primero; cerradas al final.
  sortRows: (rows) => {
    const order = { DEPLOYED: 0, MAINTENANCE: 0, DEVELOPMENT: 1, TESTING: 1, DESIGN: 1 };
    return [...rows].sort(
      (a, b) =>
        (order[a.status] ?? (a.status === "CLOSED" ? 3 : 2)) -
          (order[b.status] ?? (b.status === "CLOSED" ? 3 : 2)) || a.name.localeCompare(b.name),
    );
  },
  columns: [
    {
      key: "name",
      label: "Web o proyecto",
      render: (row) => (
        <span>
          <strong className="crm-table-primary">{row.name}</strong>
          <small className="crm-cell-hint">{row.client?.businessName ?? "Proyecto propio"}</small>
        </span>
      ),
    },
    { key: "type", label: "Tipo", render: (row) => label(row.type) },
    {
      key: "hosting",
      label: "Alojamiento",
      render: (row) =>
        [row.frontendProvider?.name, row.backendProvider?.name, row.databaseProvider?.name]
          .filter(Boolean)
          .join(" + ") || "—",
    },
    {
      key: "domain",
      label: "Dominio",
      render: (row) => {
        const domain = domainInfo(row);
        return domain ? (
          <span>
            {domain.name}
            {domain.date ? <small className="crm-cell-hint">vence {formatDate(domain.date)}</small> : null}
          </span>
        ) : (
          "—"
        );
      },
    },
    { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
  ],
  fields: [
    { label: "Nombre", name: "name", required: true },
    {
      label: "Cliente",
      name: "clientId",
      type: "select",
      options: (context) => relationOptions(context.clients, "businessName", "Proyecto propio"),
    },
    { label: "Tipo", name: "type", type: "select", options: enumOptions(PROJECT_TYPES), required: true },
    { label: "Estado", name: "status", type: "select", options: enumOptions(PROJECT_STATUSES) },
    { label: "URL pública", name: "publicUrl", placeholder: "https://..." },
    { label: "URL del panel del cliente", name: "adminUrl", placeholder: "https://.../admin" },
    { label: "Dominio (texto)", name: "domain", placeholder: "negocio.com" },
    { label: "Repo frontend", name: "frontendRepositoryUrl", placeholder: "https://github.com/..." },
    { label: "Repo backend", name: "backendRepositoryUrl" },
    providerSelect("Frontend alojado en", "frontendProviderId"),
    { label: "Enlace al panel del frontend", name: "frontendDashboardUrl" },
    providerSelect("Backend alojado en", "backendProviderId"),
    { label: "Enlace al panel del backend", name: "backendDashboardUrl" },
    providerSelect("Base de datos en", "databaseProviderId"),
    { label: "Enlace al panel de la base", name: "databaseDashboardUrl" },
    { label: "Inicio", name: "startDate", type: "date" },
    { label: "Publicada", name: "launchDate", type: "date" },
    { label: "Mantenimiento desde", name: "maintenanceStartDate", type: "date" },
    {
      label: "Avisos de alojamiento",
      name: "hostingNotes",
      type: "textarea",
      placeholder: "Ej.: Render gratis se duerme; Vercel Hobby no permite uso comercial.",
    },
    { label: "Descripción", name: "description", type: "textarea" },
    { label: "Notas internas", name: "notes", type: "textarea" },
  ],
  toForm: (row) => ({
    ...Object.fromEntries(STRING_FIELDS.map((key) => [key, row[key] ?? ""])),
    ...Object.fromEntries(DATE_FIELDS.map((key) => [key, toDateInput(row[key])])),
    clientId: row.clientId ?? "",
  }),
  toPayload: (form) => ({
    ...trimAll(form),
    ...Object.fromEntries(DATE_FIELDS.map((key) => [key, dateToIso(form[key])])),
  }),
  create: createProject,
  update: updateProject,
  archive: archiveProject,
};

function CrmProjects() {
  const { user } = useAuth();
  const { data, errors, isLoading, reload, authenticatedRequest } = useCrmLists(loaders);
  const [view, setView] = useState("cards");
  const context = useMemo(
    () => ({ clients: data.clients, providers: data.providers }),
    [data.clients, data.providers],
  );

  return (
    <>
      <CrmSectionHeader
        eyebrow="Gestión"
        title="Webs y proyectos"
        description="Cada web con su cliente, dónde está alojada, enlaces a los paneles y vencimiento del dominio."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={reload}
      />
      <nav className="crm-operations-tabs" aria-label="Vista">
        <button
          className={`crm-operations-tab ${view === "cards" ? "crm-operations-tab--active" : ""}`}
          onClick={() => setView("cards")}
          type="button"
        >
          <span>Fichas</span>
        </button>
        <button
          className={`crm-operations-tab ${view === "table" ? "crm-operations-tab--active" : ""}`}
          onClick={() => setView("table")}
          type="button"
        >
          <span>Lista</span>
        </button>
      </nav>
      <CrmOperationsModule
        authenticatedRequest={authenticatedRequest}
        canWrite={user?.role !== "READONLY"}
        config={projectsConfig}
        context={context}
        error={errors.projects}
        isLoading={isLoading}
        onReload={reload}
        renderList={
          view === "cards"
            ? (rows, helpers) => (
                <WebCards
                  rows={rows.filter((row) => row.status !== "CLOSED")}
                  {...helpers}
                />
              )
            : undefined
        }
        rows={data.projects}
      />
    </>
  );
}

export default CrmProjects;
