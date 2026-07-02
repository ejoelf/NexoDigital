import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmOperations() {
  return (
    <CrmResourcePage
      eyebrow="Infraestructura y costos"
      title="Operaciones"
      description="Vista agrupada para proveedores, suscripciones, dominios, renovaciones y costos."
      actionLabel="Registrar servicio"
      columns={["Proveedor", "Servicio", "Estado", "Responsable"]}
      rows={crmTables.operations}
      note="Conectara con providers, subscriptions, domains, renewals y costs."
    />
  );
}

export default CrmOperations;
