import React from "react";

function formatStatus(status) {
  if (!status) return "Sin estado";
  return String(status).replaceAll("_", " ").toLowerCase();
}

function CrmStatusBadge({ status }) {
  const tone = String(status || "neutral").toLowerCase();

  return (
    <span className={`crm-status-badge crm-status-badge--${tone}`}>
      {formatStatus(status)}
    </span>
  );
}

export default CrmStatusBadge;
