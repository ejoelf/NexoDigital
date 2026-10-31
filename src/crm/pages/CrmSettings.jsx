import React from "react";
import CrmSectionHeader from "../components/CrmSectionHeader";
import { label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";

function CrmSettings() {
  const { user } = useAuth();

  return (
    <>
      <CrmSectionHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Tu cuenta y cómo está armado el panel."
      />

      <section className="crm-settings-grid">
        <article className="crm-panel">
          <h3>Tu cuenta</h3>
          <dl className="crm-sheet-list">
            <dt>Nombre</dt>
            <dd>{user?.name ?? "—"}</dd>
            <dt>Email</dt>
            <dd>{user?.email ?? "—"}</dd>
            <dt>Rol</dt>
            <dd>{label(user?.role)}</dd>
          </dl>
        </article>

        <article className="crm-panel">
          <h3>Contraseñas</h3>
          <p>
            El panel no guarda contraseñas de Render, Vercel, Neon ni de tus clientes, a propósito:
            si alguien entrara, no tendría acceso a todo. Guardalas en un gestor de contraseñas
            (por ejemplo Bitwarden, que es gratis) y acá anotá solo el email de cada cuenta y el
            enlace al panel.
          </p>
        </article>

        <article className="crm-panel">
          <h3>Dónde vive el panel</h3>
          <p>
            La pantalla está en Render junto con la web pública. El servidor del panel también está
            en Render, en el plan gratis: si nadie lo usa por un rato se duerme y la primera carga
            puede tardar alrededor de un minuto. Los datos están en Neon, en el proyecto
            nexo_digital.
          </p>
        </article>

        <article className="crm-panel">
          <h3>Cómo usarlo</h3>
          <ul className="crm-settings-list">
            <li>Todo lo que tenga fecha (tareas, cobros, dominios, suscripciones, seguimientos) aparece en el Inicio.</li>
            <li>Los prospectos pasan a cliente con un botón cuando cerrás la venta.</li>
            <li>Nada se borra: tareas y cobros se cancelan, clientes se desactivan, proyectos se cierran.</li>
          </ul>
        </article>
      </section>
    </>
  );
}

export default CrmSettings;
