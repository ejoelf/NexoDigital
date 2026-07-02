import React from "react";

function CrmErrorState({ title = "No se pudo cargar esta seccion", message }) {
  return (
    <div className="crm-state crm-state--error" role="alert">
      <strong>{title}</strong>
      <p>{message || "Revisa permisos, sesion o disponibilidad del backend."}</p>
    </div>
  );
}

export default CrmErrorState;
