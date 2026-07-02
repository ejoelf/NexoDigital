import React from "react";

const severityLabels = {
  critical: "Critica",
  warning: "Warning",
  info: "Info",
  informational: "Info",
};

function CrmAlertCard({ alert, severity = "info" }) {
  const tone = severity === "informational" ? "info" : severity;

  return (
    <article className={`crm-alert-card crm-alert-card--${tone}`}>
      <div>
        <span className="crm-alert-badge">{severityLabels[severity] || "Info"}</span>
        <strong>{alert.message || alert.resourceLabel || "Alerta operativa"}</strong>
        {alert.dueDate ? (
          <p>Vence: {new Date(alert.dueDate).toLocaleDateString("es-AR")}</p>
        ) : null}
      </div>
      {alert.type ? <small>{alert.type}</small> : null}
    </article>
  );
}

export default CrmAlertCard;
