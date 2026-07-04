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
import {
  archiveClient,
  createClient,
  listClients,
  updateClient,
} from "../services/clientsService";

const clientStatuses = ["LEAD", "ACTIVE", "PAUSED", "INACTIVE"];

const emptyClient = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  industry: "",
  status: "ACTIVE",
  notes: "",
};

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
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

function toClientForm(client) {
  if (!client) return emptyClient;

  return {
    businessName: client.businessName ?? "",
    contactName: client.contactName ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    country: client.country ?? "",
    city: client.city ?? "",
    industry: client.industry ?? "",
    status: client.status ?? "ACTIVE",
    notes: client.notes ?? "",
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

function CrmClients() {
  const { authenticatedRequest, user } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingClient, setEditingClient] = useState(undefined);
  const [clientToArchive, setClientToArchive] = useState(null);
  const [form, setForm] = useState(emptyClient);
  const [filters, setFilters] = useState({ search: "", status: "" });

  const canWrite = user?.role !== "READONLY";

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setClients(await listClients(authenticatedRequest));
    } catch (loadError) {
      setError(actionErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(loadClients, 0);
    return () => window.clearTimeout(timer);
  }, [loadClients]);

  const columns = useMemo(
    () => [
      {
        key: "businessName",
        label: "Nombre",
        render: (client) => (
          <strong className="crm-table-primary">{client.businessName}</strong>
        ),
      },
      { key: "email", label: "Email", render: (client) => fieldValue(client.email) },
      { key: "phone", label: "Telefono", render: (client) => fieldValue(client.phone) },
      {
        key: "contactName",
        label: "Contacto",
        render: (client) => fieldValue(client.contactName),
      },
      {
        key: "status",
        label: "Estado",
        render: (client) => <CrmStatusBadge status={client.status} />,
      },
      {
        key: "updatedAt",
        label: "Actualizado",
        render: (client) => formatDate(client.updatedAt ?? client.createdAt),
      },
    ],
    [],
  );
  const filteredClients = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !search ||
        [
          client.businessName,
          client.contactName,
          client.email,
          client.phone,
          client.industry,
          client.city,
          client.country,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus = !filters.status || client.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [clients, filters.search, filters.status]);

  function openCreateModal() {
    setActionError("");
    setEditingClient(null);
    setForm(emptyClient);
  }

  function openEditModal(client) {
    setActionError("");
    setEditingClient(client);
    setForm(toClientForm(client));
  }

  function closeModal() {
    if (isSaving) return;
    setEditingClient(undefined);
    setForm(emptyClient);
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
      if (editingClient?.id) {
        await updateClient(authenticatedRequest, editingClient.id, cleanPayload(form));
      } else {
        await createClient(authenticatedRequest, cleanPayload(form));
      }

      closeModal();
      await loadClients();
    } catch (submitError) {
      setActionError(actionErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!clientToArchive) return;
    setIsSaving(true);
    setActionError("");

    try {
      await archiveClient(authenticatedRequest, clientToArchive.id);
      setClientToArchive(null);
      await loadClients();
    } catch (archiveError) {
      setActionError(actionErrorMessage(archiveError));
    } finally {
      setIsSaving(false);
    }
  }

  const modalOpen = editingClient !== undefined;

  return (
    <>
      <CrmSectionHeader
        eyebrow="Gestion comercial"
        title="Clientes"
        description="Base real de clientes conectada al backend del CRM."
      />

      <CrmPageToolbar
        actionLabel="Nuevo cliente"
        canCreate={canWrite}
        count={filteredClients.length}
        label={filteredClients.length === 1 ? "cliente visible" : "clientes visibles"}
        onAction={openCreateModal}
        onSearchChange={(search) =>
          setFilters((current) => ({ ...current, search }))
        }
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))
        }
        searchPlaceholder="Buscar cliente..."
        searchValue={filters.search}
        statusOptions={clientStatuses}
        statusValue={filters.status}
      />

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading ? <CrmLoadingState label="Cargando clientes..." /> : null}

      {!isLoading && !error ? (
        <section className="crm-panel">
          <CrmDataTable
            actions={
              canWrite
                ? (client) => (
                    <>
                      <button
                        className="crm-row-action"
                        onClick={() => openEditModal(client)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="crm-row-action crm-row-action--danger"
                        onClick={() => {
                          setActionError("");
                          setClientToArchive(client);
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
            emptyMessage="Todavia no hay clientes cargados. Crea el primer cliente para empezar a operar el CRM."
            emptyTitle="Sin clientes"
            rows={filteredClients}
          />
        </section>
      ) : null}

      <CrmModal
        description="Completa los datos principales. Los campos tecnicos pueden ampliarse en fases posteriores."
        footer={
          <>
            <button className="crm-button crm-button--secondary" onClick={closeModal} type="button">
              Cancelar
            </button>
            <button
              className="crm-button crm-button--primary"
              disabled={isSaving}
              form="crm-client-form"
              type="submit"
            >
              {isSaving ? "Guardando..." : "Guardar cliente"}
            </button>
          </>
        }
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingClient?.id ? "Editar cliente" : "Nuevo cliente"}
      >
        {actionError ? <CrmErrorState message={actionError} /> : null}
        <form className="crm-form-grid" id="crm-client-form" onSubmit={handleSubmit}>
          <CrmFormField
            label="Nombre comercial"
            name="businessName"
            onChange={updateForm}
            required
            value={form.businessName}
          />
          <CrmFormField
            label="Contacto"
            name="contactName"
            onChange={updateForm}
            value={form.contactName}
          />
          <CrmFormField
            label="Email"
            name="email"
            onChange={updateForm}
            type="email"
            value={form.email}
          />
          <CrmFormField
            label="Telefono"
            name="phone"
            onChange={updateForm}
            value={form.phone}
          />
          <CrmFormField
            label="Pais"
            name="country"
            onChange={updateForm}
            value={form.country}
          />
          <CrmFormField
            label="Ciudad"
            name="city"
            onChange={updateForm}
            value={form.city}
          />
          <CrmFormField
            label="Rubro"
            name="industry"
            onChange={updateForm}
            value={form.industry}
          />
          <CrmFormField
            label="Estado"
            name="status"
            onChange={updateForm}
            options={clientStatuses.map((status) => ({ label: status, value: status }))}
            type="select"
            value={form.status}
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
        confirmLabel="Archivar cliente"
        error={actionError}
        isOpen={Boolean(clientToArchive)}
        isSubmitting={isSaving}
        message={`El cliente ${clientToArchive?.businessName || ""} quedara marcado como INACTIVE.`}
        onCancel={() => {
          setActionError("");
          setClientToArchive(null);
        }}
        onConfirm={handleArchive}
        title="Archivar cliente"
      />
    </>
  );
}

export default CrmClients;
