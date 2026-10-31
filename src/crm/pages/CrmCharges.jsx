import React, { useMemo } from "react";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import {
  BILLING_FREQUENCIES,
  CHARGE_STATUSES,
  CHARGE_TYPES,
  CURRENCIES,
  enumOptions,
  label,
} from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { useCrmLists } from "../hooks/useCrmLists";
import { cancelCharge, createCharge, listCharges, updateCharge } from "../services/chargesService";
import { listClients } from "../services/clientsService";
import { listProjects } from "../services/projectsService";
import {
  dateToIso,
  daysUntil,
  formatDate,
  formatMoney,
  formatTotals,
  projectOptions,
  prune,
  relationOptions,
  relativeDay,
  syncProjectClient,
  toDateInput,
} from "../utils/format";

const loaders = { charges: listCharges, clients: listClients, projects: listProjects };
const OPEN = ["PENDING", "OVERDUE"];

function totalsBy(rows, predicate) {
  return rows.filter(predicate).reduce((totals, row) => {
    totals[row.currency] = (totals[row.currency] ?? 0) + Number(row.amount);
    return totals;
  }, {});
}

const chargesConfig = {
  key: "charges",
  title: "Cobros",
  pluralLabel: "cobros",
  singularCountLabel: "cobro",
  pluralCountLabel: "cobros",
  createLabel: "Nuevo cobro",
  createTitle: "Nuevo cobro",
  editTitle: "Editar cobro",
  submitLabel: "Guardar cobro",
  archiveButtonLabel: "Cancelar",
  archiveConfirmLabel: "Cancelar cobro",
  archiveTitle: "Cancelar cobro",
  archiveMessage: (row) => `El cobro "${row?.concept || ""}" quedará cancelado.`,
  emptyTitle: "Sin cobros",
  emptyMessage:
    "Registrá lo que les cobrás a tus clientes: proyectos, mantenimiento mensual, dominios.",
  formDescription:
    "Para un mantenimiento mensual, cargá un cobro por mes o uno mensual y marcalo pagado cada vez.",
  emptyForm: {
    concept: "",
    type: "MAINTENANCE",
    amount: "",
    currency: "ARS",
    frequency: "ONE_TIME",
    dueDate: "",
    status: "PENDING",
    clientId: "",
    projectId: "",
    notes: "",
  },
  sortRows: (rows) =>
    [...rows].sort((a, b) => {
      const openA = OPEN.includes(a.status) ? 0 : 1;
      const openB = OPEN.includes(b.status) ? 0 : 1;
      if (openA !== openB) return openA - openB;
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    }),
  columns: [
    {
      key: "concept",
      label: "Concepto",
      render: (row) => (
        <span>
          <strong className="crm-table-primary">{row.concept}</strong>
          <small className="crm-cell-hint">
            {label(row.type)} · {label(row.frequency)}
          </small>
        </span>
      ),
    },
    { key: "client", label: "Cliente", render: (row) => row.client?.businessName ?? "—" },
    {
      key: "amount",
      label: "Monto",
      render: (row) => <strong>{formatMoney(row.amount, row.currency)}</strong>,
    },
    {
      key: "dueDate",
      label: "Vence",
      render: (row) => {
        if (!row.dueDate) return "Sin fecha";
        const late = OPEN.includes(row.status) && daysUntil(row.dueDate) < 0;
        return (
          <span className={late ? "crm-text-danger" : ""}>
            {formatDate(row.dueDate)}
            {OPEN.includes(row.status) ? (
              <small className="crm-cell-hint">{relativeDay(row.dueDate)}</small>
            ) : null}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => (
        <span>
          <CrmStatusBadge status={row.status} />
          {row.paidAt ? <small className="crm-cell-hint">{formatDate(row.paidAt)}</small> : null}
        </span>
      ),
    },
  ],
  fields: [
    { label: "Concepto", name: "concept", required: true, placeholder: "Mantenimiento web noviembre" },
    {
      label: "Cliente",
      name: "clientId",
      type: "select",
      options: (context) => relationOptions(context.clients, "businessName", "Sin cliente"),
    },
    {
      label: "Web o proyecto",
      name: "projectId",
      type: "select",
      options: (context) => projectOptions(context.projects, "Sin web asociada"),
    },
    { label: "Tipo", name: "type", type: "select", options: enumOptions(CHARGE_TYPES) },
    { label: "Monto", name: "amount", type: "number", required: true },
    {
      label: "Moneda",
      name: "currency",
      type: "select",
      options: CURRENCIES.map((value) => ({ label: value, value })),
    },
    { label: "Frecuencia", name: "frequency", type: "select", options: enumOptions(BILLING_FREQUENCIES) },
    { label: "Vence", name: "dueDate", type: "date" },
    { label: "Estado", name: "status", type: "select", options: enumOptions(CHARGE_STATUSES) },
    { label: "Notas", name: "notes", type: "textarea" },
  ],
  onFieldChange: syncProjectClient,
  toForm: (row) => ({
    concept: row.concept ?? "",
    type: row.type ?? "OTHER",
    amount: row.amount ?? "",
    currency: row.currency ?? "ARS",
    frequency: row.frequency ?? "ONE_TIME",
    dueDate: toDateInput(row.dueDate),
    status: row.status ?? "PENDING",
    clientId: row.clientId ?? "",
    projectId: row.projectId ?? "",
    notes: row.notes ?? "",
  }),
  toPayload: (form) => ({
    ...prune(form),
    amount: Number(form.amount),
    dueDate: dateToIso(form.dueDate),
    clientId: form.clientId,
    projectId: form.projectId,
    notes: form.notes.trim(),
  }),
  quickActions: (row) =>
    OPEN.includes(row.status)
      ? [{ label: "Cobrado", run: (request) => updateCharge(request, row.id, { status: "PAID" }) }]
      : [],
  canArchive: (row) => row.status !== "CANCELLED",
  create: createCharge,
  update: updateCharge,
  archive: cancelCharge,
};

function CrmCharges() {
  const { user } = useAuth();
  const { data, errors, isLoading, reload, authenticatedRequest } = useCrmLists(loaders);
  const context = useMemo(
    () => ({ clients: data.clients, projects: data.projects }),
    [data.clients, data.projects],
  );

  const pending = totalsBy(data.charges, (row) => OPEN.includes(row.status));
  const now = new Date();
  const paidThisMonth = totalsBy(data.charges, (row) => {
    if (row.status !== "PAID" || !row.paidAt) return false;
    const paid = new Date(row.paidAt);
    return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
  });

  return (
    <>
      <CrmSectionHeader
        eyebrow="Ingresos"
        title="Cobros"
        description="Lo que les cobrás a tus clientes y si ya te pagaron."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={reload}
      />
      <section className="crm-summary-strip">
        <article>
          <span>Pendiente de cobro</span>
          <strong>{formatTotals(pending)}</strong>
        </article>
        <article>
          <span>Cobrado este mes</span>
          <strong>{formatTotals(paidThisMonth)}</strong>
        </article>
      </section>
      <CrmOperationsModule
        authenticatedRequest={authenticatedRequest}
        canWrite={user?.role !== "READONLY"}
        config={chargesConfig}
        context={context}
        error={errors.charges}
        isLoading={isLoading}
        onReload={reload}
        rows={data.charges}
      />
    </>
  );
}

export default CrmCharges;
