import React from "react";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { CLIENT_STATUSES, LEAD_STAGES, enumOptions, label } from "../data/crmLabels";
import { archiveClient, createClient, updateClient } from "../services/clientsService";
import { dateToIso, formatDate, relativeDay, toDateInput, trimAll } from "../utils/format";

export function whatsappUrl(number) {
  const digits = String(number || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function externalUrl(value) {
  if (!value) return "";
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function instagramUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;
  return `https://www.instagram.com/${value.replace(/^@/, "")}`;
}

export function buildClientConfig({ onView, intro, defaultStatus = "ACTIVE" } = {}) {
  return {
    key: "clients",
    title: "Clientes",
    intro,
    pluralLabel: defaultStatus === "LEAD" ? "prospectos" : "clientes",
    singularCountLabel: defaultStatus === "LEAD" ? "prospecto" : "cliente",
    pluralCountLabel: defaultStatus === "LEAD" ? "prospectos" : "clientes",
    // Activos primero; inactivos al final.
    sortRows: (rows) => {
      const order = { ACTIVE: 0, LEAD: 1, PAUSED: 2, INACTIVE: 3 };
      return [...rows].sort(
        (a, b) =>
          (order[a.status] ?? 2) - (order[b.status] ?? 2) ||
          a.businessName.localeCompare(b.businessName),
      );
    },
    createLabel: defaultStatus === "LEAD" ? "Nuevo prospecto" : "Nuevo cliente",
    createTitle: defaultStatus === "LEAD" ? "Nuevo prospecto" : "Nuevo cliente",
    editTitle: "Editar cliente",
    submitLabel: "Guardar",
    archiveButtonLabel: "Desactivar",
    archiveConfirmLabel: "Desactivar cliente",
    archiveTitle: "Desactivar cliente",
    archiveMessage: (row) =>
      `${row?.businessName || "El cliente"} quedará inactivo. No se borra nada y podés reactivarlo cuando quieras.`,
    emptyTitle: "Sin clientes",
    emptyMessage: "Cargá tu primer cliente o prospecto.",
    formDescription:
      "Los datos de contacto y el seguimiento comercial del negocio. No guardes contraseñas acá.",
    emptyForm: {
      businessName: "",
      contactName: "",
      industry: "",
      status: defaultStatus,
      leadStage: defaultStatus === "LEAD" ? "NEW" : "",
      whatsapp: "",
      email: "",
      phone: "",
      website: "",
      instagram: "",
      city: "",
      country: "Argentina",
      source: "",
      lastContactAt: "",
      nextFollowUpAt: "",
      notes: "",
    },
    columns: [
      {
        key: "businessName",
        label: "Negocio",
        render: (row) => (
          <span>
            <strong className="crm-table-primary">{row.businessName}</strong>
            <small className="crm-cell-hint">
              {[row.industry, row.city].filter(Boolean).join(" · ") || "—"}
            </small>
          </span>
        ),
      },
      {
        key: "contact",
        label: "Contacto",
        render: (row) => (
          <span>
            {row.contactName || "—"}
            {row.whatsapp ? (
              <a
                className="crm-cell-link"
                href={whatsappUrl(row.whatsapp)}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
            ) : null}
          </span>
        ),
      },
      {
        key: "work",
        label: "Webs · tareas",
        render: (row) =>
          `${row._count?.projects ?? 0} · ${row._count?.tasks ?? 0}`,
      },
      {
        key: "followUp",
        label: "Próximo seguimiento",
        render: (row) =>
          row.nextFollowUpAt ? (
            <span>
              {formatDate(row.nextFollowUpAt)}
              <small className="crm-cell-hint">{relativeDay(row.nextFollowUpAt)}</small>
            </span>
          ) : (
            "—"
          ),
      },
      {
        key: "status",
        label: "Estado",
        render: (row) => (
          <span>
            <CrmStatusBadge status={row.status} />
            {row.leadStage && row.status === "LEAD" ? (
              <small className="crm-cell-hint">{label(row.leadStage)}</small>
            ) : null}
          </span>
        ),
      },
    ],
    fields: [
      { label: "Nombre del negocio", name: "businessName", required: true },
      { label: "Persona de contacto", name: "contactName" },
      { label: "Rubro", name: "industry", placeholder: "Barbería, veterinaria..." },
      { label: "Estado", name: "status", type: "select", options: enumOptions(CLIENT_STATUSES) },
      {
        label: "Etapa comercial",
        name: "leadStage",
        type: "select",
        options: [{ label: "Sin etapa", value: "" }, ...enumOptions(LEAD_STAGES)],
      },
      { label: "WhatsApp", name: "whatsapp", placeholder: "+54 9 358 ..." },
      { label: "Email", name: "email", type: "email" },
      { label: "Teléfono", name: "phone" },
      { label: "Web actual", name: "website" },
      { label: "Instagram", name: "instagram", placeholder: "@negocio" },
      { label: "Ciudad", name: "city" },
      { label: "País", name: "country" },
      { label: "Cómo llegó", name: "source", placeholder: "Recomendación, visita, Instagram..." },
      { label: "Último contacto", name: "lastContactAt", type: "date" },
      { label: "Próximo seguimiento", name: "nextFollowUpAt", type: "date" },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      businessName: row.businessName ?? "",
      contactName: row.contactName ?? "",
      industry: row.industry ?? "",
      status: row.status ?? defaultStatus,
      leadStage: row.leadStage ?? "",
      whatsapp: row.whatsapp ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      website: row.website ?? "",
      instagram: row.instagram ?? "",
      city: row.city ?? "",
      country: row.country ?? "",
      source: row.source ?? "",
      lastContactAt: toDateInput(row.lastContactAt),
      nextFollowUpAt: toDateInput(row.nextFollowUpAt),
      notes: row.notes ?? "",
    }),
    // En la edición se mandan los vacíos para poder limpiar campos.
    toPayload: (form) => ({
      ...trimAll(form),
      lastContactAt: dateToIso(form.lastContactAt),
      nextFollowUpAt: dateToIso(form.nextFollowUpAt),
    }),
    quickActions: onView ? () => [{ label: "Ficha", onClick: onView }] : undefined,
    create: createClient,
    update: updateClient,
    archive: archiveClient,
  };
}
