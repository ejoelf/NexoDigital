import React, { useMemo } from "react";
import CrmEmptyState from "../components/CrmEmptyState";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import { LEAD_STAGES, label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { useCrmLists } from "../hooks/useCrmLists";
import { listClients, updateClient } from "../services/clientsService";
import { daysUntil, formatDate, relativeDay } from "../utils/format";
import { buildClientConfig, whatsappUrl } from "../config/clientConfig";

const loaders = { clients: listClients };

function PipelineBoard({ rows, edit, canWrite, onConvert }) {
  if (!rows.length) {
    return (
      <CrmEmptyState
        title="Sin prospectos"
        message="Cuando visites o contactes un negocio, cargalo acá con la fecha del próximo seguimiento."
      />
    );
  }

  return (
    <section className="crm-pipeline">
      {LEAD_STAGES.filter((stage) => stage !== "WON").map((stage) => {
        const items = rows.filter((row) => (row.leadStage ?? "NEW") === stage);
        return (
          <div className="crm-pipeline-column" key={stage}>
            <header>
              <span>{label(stage)}</span>
              <small>{items.length}</small>
            </header>
            {items.map((client) => {
              const days = daysUntil(client.nextFollowUpAt);
              return (
                <article className="crm-pipeline-card" key={client.id}>
                  <strong>{client.businessName}</strong>
                  <small>{[client.industry, client.city].filter(Boolean).join(" · ") || "—"}</small>
                  {client.nextFollowUpAt ? (
                    <p className={days < 0 ? "crm-text-danger" : days <= 1 ? "crm-text-warning" : ""}>
                      Seguimiento {formatDate(client.nextFollowUpAt)} ({relativeDay(client.nextFollowUpAt)})
                    </p>
                  ) : (
                    <p className="crm-cell-hint">Sin fecha de seguimiento</p>
                  )}
                  <div className="crm-pipeline-actions">
                    {client.whatsapp ? (
                      <a
                        className="crm-row-action"
                        href={whatsappUrl(client.whatsapp)}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        WhatsApp
                      </a>
                    ) : null}
                    {canWrite ? (
                      <>
                        <button className="crm-row-action" onClick={() => edit(client)} type="button">
                          Editar
                        </button>
                        {stage !== "LOST" ? (
                          <button
                            className="crm-row-action crm-row-action--quick"
                            onClick={() => onConvert(client)}
                            type="button"
                          >
                            Pasar a cliente
                          </button>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}

function CrmPipeline() {
  const { user } = useAuth();
  const { data, errors, isLoading, reload, authenticatedRequest } = useCrmLists(loaders);
  const config = useMemo(() => buildClientConfig({ defaultStatus: "LEAD" }), []);
  const leads = data.clients.filter((client) => client.status === "LEAD");

  async function convert(client) {
    await updateClient(authenticatedRequest, client.id, {
      status: "ACTIVE",
      leadStage: "WON",
    });
    await reload();
  }

  return (
    <>
      <CrmSectionHeader
        eyebrow="Ventas"
        title="Prospectos"
        description="Negocios que contactaste o querés contactar. Al cerrar una venta, pasalos a cliente."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={reload}
      />
      <CrmOperationsModule
        authenticatedRequest={authenticatedRequest}
        canWrite={user?.role !== "READONLY"}
        config={config}
        context={{}}
        error={errors.clients}
        isLoading={isLoading}
        onReload={reload}
        renderList={(rows, helpers) => (
          <PipelineBoard rows={rows} {...helpers} onConvert={convert} />
        )}
        rows={leads}
      />
    </>
  );
}

export default CrmPipeline;
