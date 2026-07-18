import React, { useEffect } from "react";

function CrmModal({ isOpen, title, description, children, footer, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="crm-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-modal="true"
        className="crm-modal"
        role="dialog"
        aria-labelledby="crm-modal-title"
      >
        <header className="crm-modal-header">
          <div>
            <p className="crm-modal-eyebrow">CRM NexoDigital</p>
            <h2 id="crm-modal-title">{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button
            aria-label="Cerrar"
            className="crm-icon-button"
            onClick={onClose}
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.7 5.3 12 12-1.4 1.4-12-12 1.4-1.4Zm10.6 0 1.4 1.4-12 12-1.4-1.4 12-12Z" />
            </svg>
          </button>
        </header>

        <div className="crm-modal-body">{children}</div>

        {footer ? <footer className="crm-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}

export default CrmModal;
