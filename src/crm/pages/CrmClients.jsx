import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmErrorState from "../components/CrmErrorState";
import CrmLoadingState from "../components/CrmLoadingState";
import CrmModal from "../components/CrmModal";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { label } from "../data/crmLabels";
import { useAuth } from "../hooks/useAuth";
import { useCrmLists } from "../hooks/useCrmLists";
import { buildClientConfig, externalUrl, instagramUrl, whatsappUrl } from "../config/clientConfig";
import { getClient, listClients } from "../services/clientsService";
import { actionErrorMessage, formatDate, formatMoney, relativeDay } from "../utils/format";

const loaders = { clients: listClients };

function ClientSheet({ clientId, onClose }) {
  const { authenticatedRequest } = useAuth();
  const [client, setClient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId) return undefined;
    let active = true;
    getClient(authenticatedRequest, clientId)
      .then((result) => active && setClient(result))
      .catch((loadError) => active && setError(actionErrorMessage(loadError)));
    return () => {
      active = false;
    };
  }, [authenticatedRequest, clientId]);

  const openTasks = client?.tasks?.filter((task) => ["PENDING", "IN_PROGRESS"].includes(task.status)) ?? [];
  const charges = client?.charges?.filter((charge) => charge.status !== "CANCELLED") ?? [];

  return (
    <CrmModal
      isOpen={Boolean(clientId)}
      onClose={onClose}
      title={client?.businessName ?? "Ficha del cliente"}
      description={client ? [client.industry, client.city, client.country].filter(Boolean).join(" · ") : ""}
    >
      {error ? <CrmErrorState message={error} /> : null}
      {!client && !error ? <CrmLoadingState label="Cargando ficha..." /> : null}
      {client ? (
        <div className="crm-sheet">
          <section className="crm-sheet-block">
            <h3>Contacto</h3>
            <dl className="crm-sheet-list">
              <dt>Persona</dt>
              <dd>{client.contactName || "—"}</dd>
              <dt>WhatsApp</dt>
              <dd>
                {client.whatsapp ? (
                  <a href={whatsappUrl(client.whatsapp)} rel="noopener noreferrer" target="_blank">
                    {client.whatsapp}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt>Email</dt>
              <dd>{client.email ? <a href={`mailto:${client.email}`}>{client.email}</a> : "—"}</dd>
              <dt>Teléfono</dt>
              <dd>{client.phone || "—"}</dd>
              <dt>Web</dt>
              <dd>
                {client.website ? (
                  <a href={externalUrl(client.website)} rel="noopener noreferrer" target="_blank">
                    {client.website}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt>Instagram</dt>
              <dd>
                {client.instagram ? (
                  <a href={instagramUrl(client.instagram)} rel="noopener noreferrer" target="_blank">
                    {client.instagram}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt>Estado</dt>
              <dd>
                <CrmStatusBadge status={client.status} />{" "}
                {client.leadStage ? label(client.leadStage) : ""}
              </dd>
              <dt>Próximo seguimiento</dt>
              <dd>{client.nextFollowUpAt ? `${formatDate(client.nextFollowUpAt)} (${relativeDay(client.nextFollowUpAt)})` : "—"}</dd>
            </dl>
            {client.notes ? <p className="crm-sheet-notes">{client.notes}</p> : null}
          </section>

          <section className="crm-sheet-block">
            <h3>Webs y proyectos ({client.projects.length})</h3>
            {client.projects.length ? (
              <ul className="crm-sheet-items">
                {client.projects.map((project) => (
                  <li key={project.id}>
                    <strong>{project.name}</strong> <CrmStatusBadge status={project.status} />
                    {project.publicUrl ? (
                      <a href={project.publicUrl} rel="noopener noreferrer" target="_blank">
                        {project.publicUrl.replace(/^https?:\/\//, "")}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-sheet-empty">Sin webs cargadas.</p>
            )}
          </section>

          <section className="crm-sheet-block">
            <h3>Dominios</h3>
            {client.domains.length ? (
              <ul className="crm-sheet-items">
                {client.domains.map((domain) => (
                  <li key={domain.id}>
                    <strong>{domain.domainName}</strong> vence {formatDate(domain.expirationDate)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-sheet-empty">Sin dominios.</p>
            )}
          </section>

          <section className="crm-sheet-block">
            <h3>Tareas abiertas ({openTasks.length})</h3>
            {openTasks.length ? (
              <ul className="crm-sheet-items">
                {openTasks.map((task) => (
                  <li key={task.id}>
                    <strong>{task.title}</strong>
                    {task.dueDate ? ` · ${formatDate(task.dueDate)}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-sheet-empty">Nada pendiente.</p>
            )}
          </section>

          <section className="crm-sheet-block">
            <h3>Cobros</h3>
            {charges.length ? (
              <ul className="crm-sheet-items">
                {charges.map((charge) => (
                  <li key={charge.id}>
                    <strong>{charge.concept}</strong> {formatMoney(charge.amount, charge.currency)}{" "}
                    <CrmStatusBadge status={charge.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-sheet-empty">Sin cobros registrados.</p>
            )}
          </section>
        </div>
      ) : null}
    </CrmModal>
  );
}

function CrmClients() {
  const { user } = useAuth();
  const { data, errors, isLoading, reload, authenticatedRequest } = useCrmLists(loaders);
  const [viewingId, setViewingId] = useState(null);
  const openSheet = useCallback((record) => setViewingId(record.id), []);
  const config = useMemo(() => buildClientConfig({ onView: openSheet }), [openSheet]);
  // Los prospectos se gestionan en su propia sección.
  const rows = data.clients.filter((client) => client.status !== "LEAD");

  return (
    <>
      <CrmSectionHeader
        eyebrow="Gestión"
        title="Clientes"
        description="Los negocios con los que trabajás. Los prospectos están en su propia sección."
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
        rows={rows}
      />
      {viewingId ? (
        <ClientSheet clientId={viewingId} key={viewingId} onClose={() => setViewingId(null)} />
      ) : null}
    </>
  );
}

export default CrmClients;
