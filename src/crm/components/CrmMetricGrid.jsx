import React from "react";
import CrmStatCard from "./CrmStatCard";
import CrmEmptyState from "./CrmEmptyState";
import CrmErrorState from "./CrmErrorState";
import CrmLoadingState from "./CrmLoadingState";

function CrmMetricGrid({ metrics, isLoading, error }) {
  if (isLoading) {
    return <CrmLoadingState label="Cargando metricas del dashboard..." />;
  }

  if (error) {
    return <CrmErrorState message={error} />;
  }

  if (!metrics?.length) {
    return (
      <CrmEmptyState
        title="Dashboard sin metricas"
        message="La API respondio correctamente, pero todavia no hay indicadores disponibles."
      />
    );
  }

  return (
    <section className="crm-stats-grid">
      {metrics.map((stat) => (
        <CrmStatCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}

export default CrmMetricGrid;
