import React from "react";
import CrmSectionHeader from "../components/CrmSectionHeader";

function CrmSettings() {
  return (
    <>
      <CrmSectionHeader
        eyebrow="Sistema"
        title="Configuracion"
        description="Placeholder para variables visuales, roles, preferencias internas y conexion futura con backend."
      />

      <section className="crm-settings-grid">
        <article className="crm-panel">
          <h3>Roles V1</h3>
          <p>ADMIN, MEMBER, COLLABORATOR y READONLY.</p>
        </article>
        <article className="crm-panel">
          <h3>Brand Kit</h3>
          <p>Panel alineado a azul Nexo, cian digital, grafito y logos oficiales.</p>
        </article>
        <article className="crm-panel">
          <h3>API futura</h3>
          <p>Base esperada: variable de entorno del frontend en FRONT 2.</p>
        </article>
      </section>
    </>
  );
}

export default CrmSettings;
