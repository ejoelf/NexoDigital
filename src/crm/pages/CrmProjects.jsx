import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmConfirmDialog from "../components/CrmConfirmDialog";
import CrmDataTable from "../components/CrmDataTable";
import CrmErrorState from "../components/CrmErrorState";
import CrmFormField from "../components/CrmFormField";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmModal from "../components/CrmModal";
import CrmPageToolbar from "../components/CrmPageToolbar";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { useAuth } from "../hooks/useAuth";
import { listClients } from "../services/clientsService";
import {
  archiveProject,
  createProject,
  listProjects,
  updateProject,
} from "../services/projectsService";

const projectTypes = [
  "WEBSITE",
  "LANDING",
  "ECOMMERCE",
  "CRM",
  "SAAS",
  "INTERNAL_SYSTEM",
  "CUSTOM_SOFTWARE",
  "AUTOMATION",
];

const projectStatuses = [
  "IDEA",
  "ANALYSIS",
  "DESIGN",
  "DEVELOPMENT",
  "TESTING",
  "DEPLOYED",
  "MAINTENANCE",
  "PAUSED",
  "CLOSED",
];

const emptyProject = {
  name: "",
  clientId: "",
  type: "WEBSITE",
  status: "IDEA",
  description: "",
  domain: "",
  frontendRepositoryUrl: "",
  backendRepositoryUrl: "",
  startDate: "",
  estimatedDeliveryDate: "",
  notes: "",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
}

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function fieldValue(value) {
  return value || "—";
}

function actionErrorMessage(error) {
  if (error?.status === 403) {
    return "No tenes permisos suficientes para esta accion.";
  }

  return error?.message || "No se pudo completar la accion.";
}

function toProjectForm(project) {
  if (!project) return emptyProject;

  return {
    name: project.name ?? "",
    clientId: project.clientId ?? project.client?.id ?? "",
    type: project.type ?? "WEBSITE",
    status: project.status ?? "IDEA",
    description: project.description ?? "",
    domain: project.domain ?? "",
    frontendRepositoryUrl: project.frontendRepositoryUrl ?? "",
    backendRepositoryUrl: project.backendRepositoryUrl ?? "",
    startDate: toDateInput(project.startDate),
    estimatedDeliveryDate: toDateInput(project.estimatedDeliveryDate),
    notes: project.notes ?? "",
  };
}

function cleanPayload(form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
}

function CrmProjects() {
  const { authenticatedRequest, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingProject, setEditingProject] = useState(undefined);
  const [projectToArchive, setProjectToArchive] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const canWrite = user?.role !== "READONLY";

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextProjects, nextClients] = await Promise.all([
        listProjects(authenticatedRequest),
        listClients(authenticatedRequest),
      ]);
      setProjects(nextProjects);
      setClients(nextClients);
    } catch (loadError) {
      setError(actionErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(loadProjects, 0);
    return () => window.clearTimeout(timer);
  }, [loadProjects]);

  const clientOptions = useMemo(
    () => [
      { label: "Sin cliente asociado", value: "" },
      ...clients.map((client) => ({
        label: client.businessName,
        value: client.id,
      })),
    ],
    [clients],
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Proyecto",
        render: (project) => (
          <strong className="crm-table-primary">{project.name}</strong>
        ),
      },
      {
        key: "client",
        label: "Cliente",
        render: (project) => fieldValue(project.client?.businessName),
      },
      {
        key: "status",
        label: "Estado",
        render: (project) => <CrmStatusBadge status={project.status} />,
      },
      { key: "type", label: "Tipo", render: (project) => fieldValue(project.type) },
      {
        key: "domain",
        label: "Dominio",
        render: (project) => fieldValue(project.domain),
      },
      {
        key: "estimatedDeliveryDate",
        label: "Entrega",
        render: (project) => formatDate(project.estimatedDeliveryDate),
      },
      {
        key: "updatedAt",
        label: "Actualizado",
        render: (project) => formatDate(project.updatedAt ?? project.createdAt),
      },
    ],
    [],
  );
  const filteredProjects = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        [
          project.name,
          project.type,
          project.domain,
          project.description,
          project.client?.businessName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus = !filters.status || project.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters.search, filters.status, projects]);

  function openCreateModal() {
    setActionError("");
    setEditingProject(null);
    setForm(emptyProject);
  }

  function openEditModal(project) {
    setActionError("");
    setEditingProject(project);
    setForm(toProjectForm(project));
  }

  function closeModal() {
    if (isSaving) return;
    setEditingProject(undefined);
    setForm(emptyProject);
    setActionError("");
  }

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setActionError("");

    try {
      if (editingProject?.id) {
        await updateProject(authenticatedRequest, editingProject.id, cleanPayload(form));
      } else {
        await createProject(authenticatedRequest, cleanPayload(form));
      }

      closeModal();
      await loadProjects();
    } catch (submitError) {
      setActionError(actionErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!projectToArchive) return;
    setIsSaving(true);
    setActionError("");

    try {
      await archiveProject(authenticatedRequest, projectToArchive.id);
      setProjectToArchive(null);
      await loadProjects();
    } catch (archiveError) {
      setActionError(actionErrorMessage(archiveError));
    } finally {
      setIsSaving(false);
    }
  }

  const modalOpen = editingProject !== undefined;

  return (
    <>
      <CrmSectionHeader
        eyebrow="Produccion"
        title="Proyectos"
        description="Seguimiento real de proyectos, clientes asociados, estados y datos tecnicos principales."
      />

      <CrmPageToolbar
        actionLabel="Nuevo proyecto"
        canCreate={canWrite}
        count={filteredProjects.length}
        label={filteredProjects.length === 1 ? "proyecto visible" : "proyectos visibles"}
        onAction={openCreateModal}
        onSearchChange={(search) =>
          setFilters((current) => ({ ...current, search }))
        }
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))
        }
        searchPlaceholder="Buscar proyecto..."
        searchValue={filters.search}
        statusOptions={projectStatuses}
        statusValue={filters.status}
      />

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading ? <CrmLoadingState label="Cargando proyectos..." /> : null}

      {!isLoading && !error ? (
        <section className="crm-panel">
          <CrmDataTable
            actions={
              canWrite
                ? (project) => (
                    <>
                      <button
                        className="crm-row-action"
                        onClick={() => openEditModal(project)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="crm-row-action crm-row-action--danger"
                        onClick={() => {
                          setActionError("");
                          setProjectToArchive(project);
                        }}
                        type="button"
                      >
                        Cerrar
                      </button>
                    </>
                  )
                : null
            }
            columns={columns}
            emptyMessage="Todavia no hay proyectos cargados. Crea el primer proyecto para vincularlo a clientes y operaciones."
            emptyTitle="Sin proyectos"
            rows={filteredProjects}
          />
        </section>
      ) : null}

      <CrmModal
        description="Carga los datos operativos principales. Proveedores y costos se gestionan desde modulos posteriores."
        footer={
          <>
            <button className="crm-button crm-button--secondary" onClick={closeModal} type="button">
              Cancelar
            </button>
            <button
              className="crm-button crm-button--primary"
              disabled={isSaving}
              form="crm-project-form"
              type="submit"
            >
              {isSaving ? "Guardando..." : "Guardar proyecto"}
            </button>
          </>
        }
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingProject?.id ? "Editar proyecto" : "Nuevo proyecto"}
      >
        {actionError ? <CrmErrorState message={actionError} /> : null}
        <form className="crm-form-grid" id="crm-project-form" onSubmit={handleSubmit}>
          <CrmFormField
            label="Nombre"
            name="name"
            onChange={updateForm}
            required
            value={form.name}
          />
          <CrmFormField
            label="Cliente asociado"
            name="clientId"
            onChange={updateForm}
            options={clientOptions}
            type="select"
            value={form.clientId}
          />
          <CrmFormField
            label="Tipo"
            name="type"
            onChange={updateForm}
            options={projectTypes.map((type) => ({ label: type, value: type }))}
            required
            type="select"
            value={form.type}
          />
          <CrmFormField
            label="Estado"
            name="status"
            onChange={updateForm}
            options={projectStatuses.map((status) => ({ label: status, value: status }))}
            type="select"
            value={form.status}
          />
          <CrmFormField
            label="Dominio"
            name="domain"
            onChange={updateForm}
            value={form.domain}
          />
          <CrmFormField
            label="Repositorio frontend"
            name="frontendRepositoryUrl"
            onChange={updateForm}
            value={form.frontendRepositoryUrl}
          />
          <CrmFormField
            label="Repositorio backend"
            name="backendRepositoryUrl"
            onChange={updateForm}
            value={form.backendRepositoryUrl}
          />
          <CrmFormField
            label="Inicio"
            name="startDate"
            onChange={updateForm}
            type="date"
            value={form.startDate}
          />
          <CrmFormField
            label="Entrega estimada"
            name="estimatedDeliveryDate"
            onChange={updateForm}
            type="date"
            value={form.estimatedDeliveryDate}
          />
          <CrmFormField
            label="Descripcion"
            name="description"
            onChange={updateForm}
            type="textarea"
            value={form.description}
          />
          <CrmFormField
            label="Notas internas"
            name="notes"
            onChange={updateForm}
            type="textarea"
            value={form.notes}
          />
        </form>
      </CrmModal>

      <CrmConfirmDialog
        confirmLabel="Cerrar proyecto"
        error={actionError}
        isOpen={Boolean(projectToArchive)}
        isSubmitting={isSaving}
        message={`El proyecto ${projectToArchive?.name || ""} quedara marcado como CLOSED.`}
        onCancel={() => {
          setActionError("");
          setProjectToArchive(null);
        }}
        onConfirm={handleArchive}
        title="Cerrar proyecto"
      />
    </>
  );
}

export default CrmProjects;
