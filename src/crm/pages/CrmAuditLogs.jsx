import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmAuditLogs() {
  return (
    <CrmResourcePage
      eyebrow="Seguridad"
      title="Auditoria"
      description="Vista restringida para revisar acciones internas relevantes del CRM."
      actionLabel="Filtrar logs"
      columns={["Accion", "Entidad", "Usuario", "Fecha"]}
      rows={crmTables.auditLogs}
      note="Solo ADMIN podra consumir GET /api/audit-logs en la integracion real."
    />
  );
}

export default CrmAuditLogs;
