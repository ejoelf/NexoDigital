import React from "react";

function CrmStatCard({ label, value, trend, tone = "primary" }) {
  return (
    <article className={`crm-stat-card crm-stat-card--${tone}`}>
      <p className="crm-stat-label">{label}</p>
      <strong className="crm-stat-value">{value}</strong>
      <span className="crm-stat-trend">{trend}</span>
    </article>
  );
}

export default CrmStatCard;
