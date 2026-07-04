import React from "react";
import CrmEmptyState from "./CrmEmptyState";

function CrmDataTable({
  columns,
  rows,
  getRowKey = (row) => row.id,
  actions,
  emptyTitle,
  emptyMessage,
}) {
  if (!rows?.length) {
    return <CrmEmptyState title={emptyTitle} message={emptyMessage} />;
  }

  const columnCount = columns.length + (actions ? 1 : 0);

  return (
    <div
      className="crm-data-table"
      role="table"
      style={{ "--crm-table-columns": columnCount }}
    >
      <div className="crm-data-table-row crm-data-table-head" role="row">
        {columns.map((column) => (
          <span key={column.key} role="columnheader">
            {column.label}
          </span>
        ))}
        {actions ? <span role="columnheader">Acciones</span> : null}
      </div>

      {rows.map((row) => (
        <div key={getRowKey(row)} className="crm-data-table-row" role="row">
          {columns.map((column) => (
            <span key={column.key} data-label={column.label} role="cell">
              {column.render ? column.render(row) : row[column.key] || "-"}
            </span>
          ))}
          {actions ? (
            <span className="crm-data-table-actions" data-label="Acciones" role="cell">
              {actions(row)}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default CrmDataTable;
