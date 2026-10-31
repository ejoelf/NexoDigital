import React from "react";
import { label } from "../data/crmLabels";

function CrmStatusBadge({ status }) {
  const tone = String(status || "neutral").toLowerCase();

  return (
    <span className={`crm-status-badge crm-status-badge--${tone}`}>
      {status ? label(status) : "Sin estado"}
    </span>
  );
}

export default CrmStatusBadge;
