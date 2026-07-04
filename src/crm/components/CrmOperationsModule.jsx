import React, { useState } from "react";
import CrmConfirmDialog from "./CrmConfirmDialog";
import CrmDataTable from "./CrmDataTable";
import CrmErrorState from "./CrmErrorState";
import CrmFormField from "./CrmFormField";
import CrmLoadingState from "./CrmLoadingState";
import CrmModal from "./CrmModal";
import CrmPageToolbar from "./CrmPageToolbar";

function actionErrorMessage(error) {
  if (error?.status === 403) {
    return "No tenes permisos suficientes para esta accion.";
  }

  return error?.message || "No se pudo completar la accion.";
}

function resolveOptions(field, context, form) {
  if (typeof field.options === "function") return field.options(context, form);
  return field.options ?? [];
}

function matchesSearch(row, search) {
  if (!search.trim()) return true;
  return JSON.stringify(row).toLowerCase().includes(search.trim().toLowerCase());
}

function CrmOperationsModule({
  config,
  rows,
  context,
  authenticatedRequest,
  canWrite,
  isLoading,
  error,
  onReload,
}) {
  const [editingRecord, setEditingRecord] = useState(undefined);
  const [recordToArchive, setRecordToArchive] = useState(null);
  const [form, setForm] = useState(config.emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "" });
  const statusOptions = [
    ...new Set(rows.map((row) => row.status).filter(Boolean)),
  ].sort();
  const filteredRows = rows.filter((row) => {
    const matchesStatus = !filters.status || row.status === filters.status;
    return matchesStatus && matchesSearch(row, filters.search);
  });

  function openCreateModal() {
    setActionError("");
    setEditingRecord(null);
    setForm(config.emptyForm);
  }

  function openEditModal(record) {
    setActionError("");
    setEditingRecord(record);
    setForm(config.toForm(record));
  }

  function closeModal() {
    if (isSaving) return;
    setEditingRecord(undefined);
    setForm(config.emptyForm);
    setActionError("");
  }

  function updateForm(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      return config.onFieldChange
        ? config.onFieldChange(name, value, next, context)
        : next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setActionError("");

    try {
      const payload = config.toPayload(form);

      if (editingRecord?.id) {
        await config.update(authenticatedRequest, editingRecord.id, payload);
      } else {
        await config.create(authenticatedRequest, payload);
      }

      closeModal();
      await onReload();
    } catch (submitError) {
      setActionError(actionErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!recordToArchive) return;
    setIsSaving(true);
    setActionError("");

    try {
      await config.archive(authenticatedRequest, recordToArchive.id);
      setRecordToArchive(null);
      await onReload();
    } catch (archiveError) {
      setActionError(actionErrorMessage(archiveError));
    } finally {
      setIsSaving(false);
    }
  }

  const modalOpen = editingRecord !== undefined;

  return (
    <section className="crm-operations-module">
      <CrmPageToolbar
        actionLabel={config.createLabel}
        canCreate={canWrite}
        count={filteredRows.length}
        label={filteredRows.length === 1 ? config.singularCountLabel : config.pluralCountLabel}
        onAction={openCreateModal}
        onSearchChange={(search) =>
          setFilters((current) => ({ ...current, search }))
        }
        onStatusChange={(status) =>
          setFilters((current) => ({ ...current, status }))
        }
        searchPlaceholder={`Buscar ${config.pluralLabel}...`}
        searchValue={filters.search}
        statusOptions={statusOptions}
        statusValue={filters.status}
      />

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading ? <CrmLoadingState label={`Cargando ${config.pluralLabel}...`} /> : null}

      {!isLoading && !error ? (
        <section className="crm-panel">
          <CrmDataTable
            actions={
              canWrite
                ? (record) => (
                    <>
                      <button
                        className="crm-row-action"
                        onClick={() => openEditModal(record)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="crm-row-action crm-row-action--danger"
                        onClick={() => {
                          setActionError("");
                          setRecordToArchive(record);
                        }}
                        type="button"
                      >
                        {config.archiveButtonLabel}
                      </button>
                    </>
                  )
                : null
            }
            columns={config.columns}
            emptyMessage={config.emptyMessage}
            emptyTitle={config.emptyTitle}
            rows={filteredRows}
          />
        </section>
      ) : null}

      <CrmModal
        description={config.formDescription}
        footer={
          <>
            <button className="crm-button crm-button--secondary" onClick={closeModal} type="button">
              Cancelar
            </button>
            <button
              className="crm-button crm-button--primary"
              disabled={isSaving}
              form={`crm-${config.key}-form`}
              type="submit"
            >
              {isSaving ? "Guardando..." : config.submitLabel}
            </button>
          </>
        }
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingRecord?.id ? config.editTitle : config.createTitle}
      >
        {actionError ? <CrmErrorState message={actionError} /> : null}
        <form className="crm-form-grid" id={`crm-${config.key}-form`} onSubmit={handleSubmit}>
          {config.fields.map((field) => (
            <CrmFormField
              key={field.name}
              label={field.label}
              name={field.name}
              onChange={updateForm}
              options={resolveOptions(field, context, form)}
              placeholder={field.placeholder}
              required={field.required}
              rows={field.rows}
              type={field.type}
              value={form[field.name]}
            />
          ))}
        </form>
      </CrmModal>

      <CrmConfirmDialog
        confirmLabel={config.archiveConfirmLabel}
        error={actionError}
        isOpen={Boolean(recordToArchive)}
        isSubmitting={isSaving}
        message={config.archiveMessage(recordToArchive)}
        onCancel={() => {
          setActionError("");
          setRecordToArchive(null);
        }}
        onConfirm={handleArchive}
        title={config.archiveTitle}
      />
    </section>
  );
}

export default CrmOperationsModule;
