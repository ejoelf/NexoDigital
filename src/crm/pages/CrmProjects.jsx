import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmProjects() {
  return (
    <CrmResourcePage
      eyebrow="Produccion"
      title="Proyectos"
      description="Seguimiento inicial de proyectos, tipo de solucion, estado y cliente asociado."
      actionLabel="Nuevo proyecto"
      columns={["Proyecto", "Tipo", "Estado", "Cliente"]}
      rows={crmTables.projects}
      note="Preparado para GET /api/projects y acciones de creacion, edicion y archivado."
    />
  );
}

export default CrmProjects;
