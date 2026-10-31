import React from "react";

function CrmEmptyState({ title = "Sin datos todavía", message }) {
  return (
    <div className="crm-state crm-state--empty">
      <strong>{title}</strong>
      <p>{message || "Cuando existan registros, esta vista se completara automaticamente."}</p>
    </div>
  );
}

export default CrmEmptyState;
