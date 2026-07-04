import React from "react";

function CrmModal({ isOpen, title, description, children, footer, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="crm-modal-backdrop" role="presentation">
      <section
        aria-modal="true"
        className="crm-modal"
        role="dialog"
        aria-labelledby="crm-modal-title"
      >
        <header className="crm-modal-header">
          <div>
            <h2 id="crm-modal-title">{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button
            aria-label="Cerrar"
            className="crm-icon-button"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </header>

        <div className="crm-modal-body">{children}</div>

        {footer ? <footer className="crm-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}

export default CrmModal;
