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
import { listProjects } from "../services/projectsService";
import {
  archiveWork,
  createWork,
  listWorks,
  updateWork,
} from "../services/worksService";

const workStatuses = [
  "IDEA",
  "ANALYSIS",
  "DESIGN",
  "DEVELOPMENT",
  "REVIEW",
  "PUBLISHED",
  "MAINTENANCE",
  "PAUSED",
  "CLOSED",
];

const emptyWork = {
  title: "",
  slug: "",
  clientId: "",
  projectId: "",
  category: "",
  industry: "",
  shortDescription: "",
  longDescription: "",
  mainImageUrl: "",
  galleryUrls: "",
  publicUrl: "",
  frontendRepositoryUrl: "",
  backendRepositoryUrl: "",
  technologies: "",
  includedServices: "",
  status: "DEVELOPMENT",
  isPublic: false,
  featured: false,
  displayOrder: "0",
  publishedAt: "",
  internalNotes: "",
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

function arrayToInput(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function inputToArray(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toWorkForm(work) {
  if (!work) return emptyWork;

  return {
    title: work.title ?? "",
    slug: work.slug ?? "",
    clientId: work.clientId ?? work.client?.id ?? "",
    projectId: work.projectId ?? work.project?.id ?? "",
    category: work.category ?? "",
    industry: work.industry ?? "",
    shortDescription: work.shortDescription ?? "",
    longDescription: work.longDescription ?? "",
    mainImageUrl: work.mainImageUrl ?? "",
    galleryUrls: arrayToInput(work.galleryUrls),
    publicUrl: work.publicUrl ?? "",
    frontendRepositoryUrl: work.frontendRepositoryUrl ?? "",
    backendRepositoryUrl: work.backendRepositoryUrl ?? "",
    technologies: arrayToInput(work.technologies),
    includedServices: arrayToInput(work.includedServices),
    status: work.status ?? "DEVELOPMENT",
    isPublic: Boolean(work.isPublic),
    featured: Boolean(work.featured),
    displayOrder: String(work.displayOrder ?? 0),
    publishedAt: toDateInput(work.publishedAt),
    internalNotes: work.internalNotes ?? "",
  };
}

function cleanPayload(form) {
  const payload = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    clientId: form.clientId.trim(),
    projectId: form.projectId.trim(),
    category: form.category.trim(),
    industry: form.industry.trim(),
    shortDescription: form.shortDescription.trim(),
    longDescription: form.longDescription.trim(),
    mainImageUrl: form.mainImageUrl.trim(),
    galleryUrls: inputToArray(form.galleryUrls),
    publicUrl: form.publicUrl.trim(),
    frontendRepositoryUrl: form.frontendRepositoryUrl.trim(),
    backendRepositoryUrl: form.backendRepositoryUrl.trim(),
    technologies: inputToArray(form.technologies),
    includedServices: inputToArray(form.includedServices),
    status: form.status,
    isPublic: Boolean(form.isPublic),
    featured: Boolean(form.featured),
    displayOrder: Number.parseInt(form.displayOrder, 10) || 0,
    publishedAt: form.publishedAt,
    internalNotes: form.internalNotes.trim(),
  };

  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]),
  );
}

function VisibilityBadge({ isPublic }) {
  return (
    <span
      className={`crm-status-badge ${
        isPublic ? "crm-status-badge--active" : "crm-status-badge--inactive"
      }`}
    >
      {isPublic ? "publico" : "privado"}
    </span>
  );
}

function FeaturedBadge({ featured }) {
  return (
    <span
      className={`crm-status-badge ${
        featured ? "crm-status-badge--deployed" : "crm-status-badge--inactive"
      }`}
    >
      {featured ? "destacado" : "normal"}
    </span>
  );
}

function CrmWorks() {
  const { authenticatedRequest, user } = useAuth();
  const [works, setWorks] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingWork, setEditingWork] = useState(undefined);
  const [workToArchive, setWorkToArchive] = useState(null);
  const [form, setForm] = useState(emptyWork);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const canWrite = user?.role !== "READONLY";

  const loadWorks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [nextWorks, nextClients, nextProjects] = await Promise.all([
        listWorks(authenticatedRequest),
        listClients(authenticatedRequest),
        listProjects(authenticatedRequest),
      ]);
      setWorks(nextWorks);
      setClients(nextClients);
      setProjects(nextProjects);
    } catch (loadError) {
      setError(actionErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(loadWorks, 0);
    return () => window.clearTimeout(timer);
  }, [loadWorks]);

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

  const projectOptions = useMemo(
    () => [
      { label: "Sin proyecto asociado", value: "" },
      ...projects.map((project) => ({
        label: project.client?.businessName
          ? `${project.name} · ${project.client.businessName}`
          : project.name,
        value: project.id,
      })),
    ],
    [projects],
  );

  const columns = useMemo(
    () => [
      {
        key: "title",
        label: "Trabajo",
        render: (work) => <strong className="crm-table-primary">{work.title}</strong>,
      },
      {
        key: "client",
        label: "Cliente",
        render: (work) => fieldValue(work.client?.businessName || work.clientName),
      },
      {
        key: "project",
        label: "Proyecto",
        render: (work) => fieldValue(work.project?.name),
      },
      {
        key: "category",
        label: "Categoria",
        render: (work) => fieldValue(work.category),
      },
      {
        key: "industry",
        label: "Industria",
        render: (work) => fieldValue(work.industry),
      },
      {
        key: "status",
        label: "Estado",
        render: (work) => <CrmStatusBadge status={work.status} />,
      },
      {
        key: "isPublic",
        label: "Visibilidad",
        render: (work) => <VisibilityBadge isPublic={work.isPublic} />,
      },
      {
        key: "featured",
        label: "Destacado",
        render: (work) => <FeaturedBadge featured={work.featured} />,
      },
      {
        key: "publishedAt",
        label: "Publicado",
        render: (work) => formatDate(work.publishedAt),
      },
      {
        key: "updatedAt",
        label: "Actualizado",
        render: (work) => formatDate(work.updatedAt ?? work.createdAt),
      },
    ],
    [],
  );
  const filteredWorks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return works.filter((work) => {
      const matchesSearch =
        !search ||
        [
          work.title,
          work.slug,
          work.category,
          work.industry,
          work.shortDescription,
          work.client?.businessName,
          work.clientName,
          work.project?.name,
          ...(work.technologies ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus = !filters.status || work.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters.search, filters.status, works]);

  function openCreateModal() {
    setActionError("");
    setEditingWork(null);
    setForm(emptyWork);
  }

  function openEditModal(work) {
    setActionError("");
    setEditingWork(work);
    setForm(toWorkForm(work));
  }

  function closeModal() {
    if (isSaving) return;
    setEditingWork(undefined);
    setForm(emptyWork);
    setActionError("");
  }

  function updateForm(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "projectId") {
        const selectedProject = projects.find((project) => project.id === value);
        if (selectedProject?.clientId) {
          next.clientId = selectedProject.clientId;
        }
      }

      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setActionError("");

    try {
      const payload = cleanPayload(form);

      if (editingWork?.id) {
        await updateWork(authenticatedRequest, editingWork.id, payload);
      } else {
        await createWork(authenticatedRequest, payload);
      }

      closeModal();
      await loadWorks();
    } catch (submitError) {
      setActionError(actionErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!workToArchive) return;
    setIsSaving(true);
    setActionError("");

    try {
      await archiveWork(authenticatedRequest, workToArchive.id);
      setWorkToArchive(null);
      await loadWorks();
    } catch (archiveError) {
      setActionError(actionErrorMessage(archiveError));
    } finally {
      setIsSaving(false);
    }
  }

  const modalOpen = editingWork !== undefined;

  return (
    <>
      <CrmSectionHeader
        eyebrow="Portfolio operativo"
        title="Trabajos realizados"
        description="Gestion real de trabajos que podran alimentar la seccion publica en una fase futura."
      />

      <CrmPageToolbar
        actionLabel="Nuevo trabajo"
        canCreate={canWrite}
        count={filteredWorks.length}
        label={filteredWorks.length === 1 ? "trabajo visible" : "trabajos visibles"}
        onAction={openCreateModal}
        onSearchChange={(search) =>
          setFilters((current) => ({ ...current, search }))
        }
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))
        }
        searchPlaceholder="Buscar trabajo..."
        searchValue={filters.search}
        statusOptions={workStatuses}
        statusValue={filters.status}
      />

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading ? <CrmLoadingState label="Cargando trabajos realizados..." /> : null}

      {!isLoading && !error ? (
        <section className="crm-panel">
          <CrmDataTable
            actions={
              canWrite
                ? (work) => (
                    <>
                      <button
                        className="crm-row-action"
                        onClick={() => openEditModal(work)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="crm-row-action crm-row-action--danger"
                        onClick={() => {
                          setActionError("");
                          setWorkToArchive(work);
                        }}
                        type="button"
                      >
                        Archivar
                      </button>
                    </>
                  )
                : null
            }
            columns={columns}
            emptyMessage="Todavia no hay trabajos cargados. Crea el primer work para preparar la futura conexion con la web publica."
            emptyTitle="Sin trabajos realizados"
            rows={filteredWorks}
          />
        </section>
      ) : null}

      <CrmModal
        description="Los arrays como tecnologias, galeria y servicios se cargan separados por coma en esta V1."
        footer={
          <>
            <button className="crm-button crm-button--secondary" onClick={closeModal} type="button">
              Cancelar
            </button>
            <button
              className="crm-button crm-button--primary"
              disabled={isSaving}
              form="crm-work-form"
              type="submit"
            >
              {isSaving ? "Guardando..." : "Guardar trabajo"}
            </button>
          </>
        }
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingWork?.id ? "Editar trabajo" : "Nuevo trabajo"}
      >
        {actionError ? <CrmErrorState message={actionError} /> : null}
        <form className="crm-form-grid" id="crm-work-form" onSubmit={handleSubmit}>
          <CrmFormField
            label="Titulo"
            name="title"
            onChange={updateForm}
            required
            value={form.title}
          />
          <CrmFormField
            label="Slug"
            name="slug"
            onChange={updateForm}
            placeholder="Se genera automaticamente si queda vacio"
            value={form.slug}
          />
          <CrmFormField
            label="Cliente"
            name="clientId"
            onChange={updateForm}
            options={clientOptions}
            type="select"
            value={form.clientId}
          />
          <CrmFormField
            label="Proyecto"
            name="projectId"
            onChange={updateForm}
            options={projectOptions}
            type="select"
            value={form.projectId}
          />
          <CrmFormField
            label="Categoria"
            name="category"
            onChange={updateForm}
            required
            value={form.category}
          />
          <CrmFormField
            label="Industria"
            name="industry"
            onChange={updateForm}
            value={form.industry}
          />
          <CrmFormField
            label="Estado"
            name="status"
            onChange={updateForm}
            options={workStatuses.map((status) => ({ label: status, value: status }))}
            type="select"
            value={form.status}
          />
          <CrmFormField
            label="Orden"
            name="displayOrder"
            onChange={updateForm}
            type="number"
            value={form.displayOrder}
          />
          <CrmFormField
            label="Publicado"
            name="isPublic"
            onChange={updateForm}
            type="checkbox"
            value={form.isPublic}
          />
          <CrmFormField
            label="Destacado"
            name="featured"
            onChange={updateForm}
            type="checkbox"
            value={form.featured}
          />
          <CrmFormField
            label="Fecha de publicacion"
            name="publishedAt"
            onChange={updateForm}
            type="date"
            value={form.publishedAt}
          />
          <CrmFormField
            label="URL publica"
            name="publicUrl"
            onChange={updateForm}
            value={form.publicUrl}
          />
          <CrmFormField
            label="Imagen principal"
            name="mainImageUrl"
            onChange={updateForm}
            value={form.mainImageUrl}
          />
          <CrmFormField
            label="Galeria URLs"
            name="galleryUrls"
            onChange={updateForm}
            placeholder="https://... , https://..."
            value={form.galleryUrls}
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
            label="Tecnologias"
            name="technologies"
            onChange={updateForm}
            placeholder="React, Vite, CSS"
            value={form.technologies}
          />
          <CrmFormField
            label="Servicios incluidos"
            name="includedServices"
            onChange={updateForm}
            placeholder="Web, mantenimiento, deploy"
            value={form.includedServices}
          />
          <CrmFormField
            label="Descripcion corta"
            name="shortDescription"
            onChange={updateForm}
            required
            type="textarea"
            value={form.shortDescription}
          />
          <CrmFormField
            label="Descripcion larga"
            name="longDescription"
            onChange={updateForm}
            type="textarea"
            value={form.longDescription}
          />
          <CrmFormField
            label="Notas internas"
            name="internalNotes"
            onChange={updateForm}
            type="textarea"
            value={form.internalNotes}
          />
        </form>
      </CrmModal>

      <CrmConfirmDialog
        confirmLabel="Archivar trabajo"
        error={actionError}
        isOpen={Boolean(workToArchive)}
        isSubmitting={isSaving}
        message={`El trabajo ${workToArchive?.title || ""} quedara CLOSED, privado y sin destacado.`}
        onCancel={() => {
          setActionError("");
          setWorkToArchive(null);
        }}
        onConfirm={handleArchive}
        title="Archivar trabajo"
      />
    </>
  );
}

export default CrmWorks;
