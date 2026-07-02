import React from "react";

function CrmSectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
}) {
  return (
    <header className="crm-section-header">
      <div>
        {eyebrow ? <p className="crm-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>

      {actionLabel ? (
        <button
          className="crm-button crm-button--primary"
          disabled={actionDisabled}
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
}

export default CrmSectionHeader;
