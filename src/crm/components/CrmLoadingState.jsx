import React from "react";

function CrmLoadingState({ label = "Cargando datos operativos..." }) {
  return (
    <div className="crm-state crm-state--loading" role="status">
      <span className="crm-state-spinner" />
      <p>{label}</p>
    </div>
  );
}

export default CrmLoadingState;
