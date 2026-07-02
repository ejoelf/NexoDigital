import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmAlerts() {
  return (
    <CrmResourcePage
      eyebrow="Control interno"
      title="Alertas"
      description="Panel visual para proximos vencimientos, renovaciones y costos recurrentes."
      actionLabel="Revisar alertas"
      columns={["Alerta", "Nivel", "Ventana", "Estado"]}
      rows={crmTables.alerts}
      note="Preparado para /api/alerts/summary y endpoints de vencimientos."
    />
  );
}

export default CrmAlerts;
