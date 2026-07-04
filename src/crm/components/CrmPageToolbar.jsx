import React from "react";

function CrmPageToolbar({
  count,
  label,
  actionLabel,
  canCreate,
  onAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  statusValue,
  onStatusChange,
  statusOptions = [],
}) {
  return (
    <div className="crm-page-toolbar">
      <p>
        <strong>{count}</strong> {label}
      </p>

      {onSearchChange || onStatusChange ? (
        <div className="crm-toolbar-filters">
          {onSearchChange ? (
            <input
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          ) : null}
          {onStatusChange ? (
            <select
              value={statusValue ?? ""}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="">Todos los estados</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ) : null}

      {canCreate ? (
        <button className="crm-button crm-button--primary" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default CrmPageToolbar;
