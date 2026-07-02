import React from "react";
import CrmResourcePage from "./CrmResourcePage";
import { crmTables } from "../data/crmMockData";

function CrmClients() {
  return (
    <CrmResourcePage
      eyebrow="Gestion comercial"
      title="Clientes"
      description="Base visual para listar clientes, estados, rubros y servicios asociados."
      actionLabel="Nuevo cliente"
      columns={["Cliente", "Rubro", "Estado", "Servicio"]}
      rows={crmTables.clients}
      note="Luego se conectara con GET /api/clients y mutaciones protegidas por rol."
    />
  );
}

export default CrmClients;
