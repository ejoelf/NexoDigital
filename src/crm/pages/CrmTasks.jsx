import React, { useMemo } from "react";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { TASK_PRIORITIES, TASK_STATUSES, enumOptions, label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { useCrmLists } from "../hooks/useCrmLists";
import { listClients } from "../services/clientsService";
import { listProjects } from "../services/projectsService";
import { cancelTask, createTask, listTasks, updateTask } from "../services/tasksService";
import {
  dateToIso,
  daysUntil,
  formatDate,
  projectOptions,
  prune,
  relationOptions,
  relativeDay,
  syncProjectClient,
  toDateInput,
} from "../utils/format";

const loaders = { tasks: listTasks, clients: listClients, projects: listProjects };

const OPEN = ["PENDING", "IN_PROGRESS"];
const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function dueCell(task) {
  if (!task.dueDate) return "Sin fecha";
  const days = daysUntil(task.dueDate);
  const late = OPEN.includes(task.status) && days < 0;
  return (
    <span className={late ? "crm-text-danger" : days <= 2 && OPEN.includes(task.status) ? "crm-text-warning" : ""}>
      {formatDate(task.dueDate)}
      <small className="crm-cell-hint">{relativeDay(task.dueDate)}</small>
    </span>
  );
}

const tasksConfig = {
  key: "tasks",
  title: "Tareas",
  pluralLabel: "tareas",
  singularCountLabel: "tarea",
  pluralCountLabel: "tareas",
  createLabel: "Nueva tarea",
  createTitle: "Nueva tarea",
  editTitle: "Editar tarea",
  submitLabel: "Guardar tarea",
  archiveButtonLabel: "Cancelar",
  archiveConfirmLabel: "Cancelar tarea",
  archiveTitle: "Cancelar tarea",
  archiveMessage: (row) => `La tarea "${row?.title || ""}" quedará cancelada.`,
  emptyTitle: "Sin tareas",
  emptyMessage: "Anotá acá todo lo que tenés que hacer para no olvidarte de nada.",
  formDescription: "Una tarea puede estar ligada a un cliente o a una web. Con fecha, aparece en el inicio.",
  emptyForm: {
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
    clientId: "",
    projectId: "",
  },
  // Primero las abiertas, por fecha; después las hechas y canceladas.
  sortRows: (rows) =>
    [...rows].sort((a, b) => {
      const openA = OPEN.includes(a.status) ? 0 : 1;
      const openB = OPEN.includes(b.status) ? 0 : 1;
      if (openA !== openB) return openA - openB;
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      if (dateA !== dateB) return dateA - dateB;
      return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
    }),
  columns: [
    {
      key: "title",
      label: "Tarea",
      render: (row) => (
        <span>
          <strong className="crm-table-primary">{row.title}</strong>
          {row.description ? <small className="crm-cell-hint">{row.description}</small> : null}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Prioridad",
      render: (row) => (
        <span className={`crm-priority crm-priority--${String(row.priority).toLowerCase()}`}>
          {label(row.priority)}
        </span>
      ),
    },
    { key: "dueDate", label: "Fecha", render: dueCell },
    {
      key: "relation",
      label: "Cliente / web",
      render: (row) =>
        [row.client?.businessName, row.project?.name].filter(Boolean).join(" · ") || "—",
    },
    { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
  ],
  fields: [
    { label: "Tarea", name: "title", required: true, placeholder: "Llamar a Nico por la V2" },
    { label: "Prioridad", name: "priority", type: "select", options: enumOptions(TASK_PRIORITIES) },
    { label: "Fecha límite", name: "dueDate", type: "date" },
    { label: "Estado", name: "status", type: "select", options: enumOptions(TASK_STATUSES) },
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
    { label: "Detalle", name: "description", type: "textarea" },
  ],
  onFieldChange: syncProjectClient,
  toForm: (row) => ({
    title: row.title ?? "",
    description: row.description ?? "",
    status: row.status ?? "PENDING",
    priority: row.priority ?? "MEDIUM",
    dueDate: toDateInput(row.dueDate),
    clientId: row.clientId ?? "",
    projectId: row.projectId ?? "",
  }),
  toPayload: (form) => ({
    ...prune(form),
    dueDate: dateToIso(form.dueDate),
    clientId: form.clientId,
    projectId: form.projectId,
    description: form.description.trim(),
  }),
  quickActions: (row) =>
    OPEN.includes(row.status)
      ? [{ label: "Hecha", run: (request) => updateTask(request, row.id, { status: "DONE" }) }]
      : row.status === "DONE"
        ? [{ label: "Reabrir", run: (request) => updateTask(request, row.id, { status: "PENDING" }) }]
        : [],
  canArchive: (row) => row.status !== "CANCELLED",
  create: createTask,
  update: updateTask,
  archive: cancelTask,
};

function CrmTasks() {
  const { user } = useAuth();
  const { data, errors, isLoading, reload, authenticatedRequest } = useCrmLists(loaders);
  const context = useMemo(
    () => ({ clients: data.clients, projects: data.projects }),
    [data.clients, data.projects],
  );
  const openCount = data.tasks.filter((task) => OPEN.includes(task.status)).length;

  return (
    <>
      <CrmSectionHeader
        eyebrow="Organización"
        title="Tareas"
        description={`${openCount} ${openCount === 1 ? "tarea abierta" : "tareas abiertas"}. Las que tienen fecha aparecen en el inicio.`}
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={reload}
      />
      <CrmOperationsModule
        authenticatedRequest={authenticatedRequest}
        canWrite={user?.role !== "READONLY"}
        config={tasksConfig}
        context={context}
        error={errors.tasks}
        isLoading={isLoading}
        onReload={reload}
        rows={data.tasks}
      />
    </>
  );
}

export default CrmTasks;
