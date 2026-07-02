import React from "react";
import CrmSectionHeader from "../components/CrmSectionHeader";

function CrmResourcePage({
  eyebrow,
  title,
  description,
  actionLabel,
  columns,
  rows,
  note,
}) {
  return (
    <>
      <CrmSectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actionLabel={actionLabel}
      />

      <section className="crm-panel">
        <div className="crm-table">
          <div className="crm-table-row crm-table-head">
            {columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          {rows.map((row) => (
            <div key={row.join("-")} className="crm-table-row">
              {row.map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <p className="crm-page-note">{note}</p>
    </>
  );
}

export default CrmResourcePage;
