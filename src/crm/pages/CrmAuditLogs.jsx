import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmDataTable from "../components/CrmDataTable";
import CrmEmptyState from "../components/CrmEmptyState";
import CrmErrorState from "../components/CrmErrorState";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmModal from "../components/CrmModal";
import CrmSectionHeader from "../components/CrmSectionHeader";
import { useAuth } from "../hooks/useAuth";
import { getAuditLog, listAuditLogs } from "../services/auditLogsService";

function fieldValue(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR");
}

function shortUserAgent(value) {
  if (!value) return "—";
  return value.length > 54 ? `${value.slice(0, 54)}...` : value;
}

function errorMessage(error) {
  if (error?.status === 403) {
    return "No tenes permisos suficientes para ver auditoria.";
  }

  return error?.message || "No se pudo cargar auditoria.";
}

function safeMetadata(metadata) {
  if (!metadata) return "Sin metadata.";
  return JSON.stringify(metadata, null, 2);
}

function matchesSearch(log, search) {
  if (!search.trim()) return true;

  const text = [
    log.action,
    log.entityType,
    log.entityId,
    log.user?.name,
    log.user?.email,
    log.ip,
    log.userAgent,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes(search.trim().toLowerCase());
}

function CrmAuditLogs() {
  const { authenticatedRequest, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    search: "",
  });

  const isAdmin = user?.role === "ADMIN";

  const loadAuditLogs = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setLogs(
        await listAuditLogs(authenticatedRequest, {
          action: filters.action,
          entityType: filters.entityType,
          limit: 100,
        }),
      );
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequest, filters.action, filters.entityType, isAdmin]);

  useEffect(() => {
    const timer = window.setTimeout(loadAuditLogs, 0);
    return () => window.clearTimeout(timer);
  }, [loadAuditLogs]);

  const actionOptions = useMemo(
    () => [...new Set(logs.map((log) => log.action).filter(Boolean))].sort(),
    [logs],
  );
  const entityOptions = useMemo(
    () => [...new Set(logs.map((log) => log.entityType).filter(Boolean))].sort(),
    [logs],
  );
  const filteredLogs = useMemo(
    () => logs.filter((log) => matchesSearch(log, filters.search)),
    [filters.search, logs],
  );

  async function openDetail(log) {
    setIsDetailLoading(true);
    setSelectedLog(log);

    try {
      setSelectedLog(await getAuditLog(authenticatedRequest, log.id));
    } catch (detailError) {
      setError(errorMessage(detailError));
    } finally {
      setIsDetailLoading(false);
    }
  }

  const columns = [
    { key: "createdAt", label: "Fecha", render: (row) => formatDate(row.createdAt) },
    {
      key: "user",
      label: "Usuario",
      render: (row) => fieldValue(row.user?.name || row.user?.email),
    },
    { key: "action", label: "Accion", render: (row) => <strong className="crm-table-primary">{row.action}</strong> },
    { key: "entityType", label: "Entidad", render: (row) => fieldValue(row.entityType) },
    { key: "entityId", label: "Relacion", render: (row) => fieldValue(row.entityId) },
    { key: "ip", label: "IP", render: (row) => fieldValue(row.ip) },
    { key: "userAgent", label: "User agent", render: (row) => shortUserAgent(row.userAgent) },
  ];

  if (!isAdmin) {
    return (
      <>
        <CrmSectionHeader
          eyebrow="Seguridad"
          title="Auditoria"
          description="Vista restringida para administradores del CRM."
        />
        <CrmErrorState
          title="Acceso restringido"
          message="No tenes permisos suficientes para ver auditoria."
        />
      </>
    );
  }

  return (
    <>
      <CrmSectionHeader
        eyebrow="Seguridad"
        title="Auditoria"
        description="Eventos auditados del backend CRM. La metadata sensible se mantiene sanitizada por backend."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={loadAuditLogs}
      />

      <div className="crm-filter-bar crm-filter-bar--wide">
        <label>
          Buscar
          <input
            placeholder="accion, usuario, entidad, IP..."
            type="search"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
          />
        </label>
        <label>
          Accion
          <select
            value={filters.action}
            onChange={(event) =>
              setFilters((current) => ({ ...current, action: event.target.value }))
            }
          >
            <option value="">Todas</option>
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
        <label>
          Entidad
          <select
            value={filters.entityType}
            onChange={(event) =>
              setFilters((current) => ({ ...current, entityType: event.target.value }))
            }
          >
            <option value="">Todas</option>
            {entityOptions.map((entityType) => (
              <option key={entityType} value={entityType}>
                {entityType}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <CrmErrorState message={error} /> : null}
      {isLoading ? <CrmLoadingState label="Cargando auditoria..." /> : null}

      {!isLoading && !error ? (
        <section className="crm-panel">
          <CrmDataTable
            actions={(row) => (
              <button className="crm-row-action" onClick={() => openDetail(row)} type="button">
                Ver detalle
              </button>
            )}
            columns={columns}
            emptyMessage="No hay eventos auditados para los filtros actuales."
            emptyTitle="Sin audit logs"
            rows={filteredLogs}
          />
        </section>
      ) : null}

      <CrmModal
        footer={
          <button
            className="crm-button crm-button--secondary"
            onClick={() => setSelectedLog(null)}
            type="button"
          >
            Cerrar
          </button>
        }
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title="Detalle de auditoria"
      >
        {isDetailLoading ? <CrmLoadingState label="Cargando detalle..." /> : null}
        {selectedLog && !isDetailLoading ? (
          <div className="crm-audit-detail">
            <div className="crm-detail-grid">
              <p><span>Fecha</span>{formatDate(selectedLog.createdAt)}</p>
              <p><span>Usuario</span>{fieldValue(selectedLog.user?.email || selectedLog.user?.name)}</p>
              <p><span>Accion</span>{fieldValue(selectedLog.action)}</p>
              <p><span>Entidad</span>{fieldValue(selectedLog.entityType)}</p>
              <p><span>Relacion</span>{fieldValue(selectedLog.entityId)}</p>
              <p><span>IP</span>{fieldValue(selectedLog.ip)}</p>
            </div>
            <h3>Metadata</h3>
            <pre>{safeMetadata(selectedLog.metadata)}</pre>
            <h3>User agent</h3>
            <p>{fieldValue(selectedLog.userAgent)}</p>
          </div>
        ) : null}
      </CrmModal>
    </>
  );
}

export default CrmAuditLogs;
