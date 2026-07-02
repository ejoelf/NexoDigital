import React from "react";
import CrmEmptyState from "./CrmEmptyState";

function CrmActivityList({ items }) {
  if (!items?.length) {
    return (
      <CrmEmptyState
        title="Sin actividad reciente"
        message="Los ultimos cambios apareceran cuando el CRM tenga registros creados o actualizados."
      />
    );
  }

  return (
    <div className="crm-activity-list">
      {items.map((item) => (
        <div key={`${item.type}-${item.id}`} className="crm-activity-item">
          <span />
          <div>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </div>
          <small>{item.time}</small>
        </div>
      ))}
    </div>
  );
}

export default CrmActivityList;
