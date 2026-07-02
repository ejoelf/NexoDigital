import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmWorks() {
  return (
    <CrmResourcePage
      eyebrow="Portfolio operativo"
      title="Trabajos realizados"
      description="Control de trabajos publicos y privados que podran alimentar la web publica."
      actionLabel="Nuevo trabajo"
      columns={["Trabajo", "Categoria", "Visibilidad", "Stack"]}
      rows={crmTables.works}
      note="Luego se conectara con GET /api/works y GET /api/public/works."
    />
  );
}

export default CrmWorks;
