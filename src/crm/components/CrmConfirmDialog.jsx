import React from "react";
import CrmErrorState from "./CrmErrorState";
import CrmModal from "./CrmModal";

function CrmConfirmDialog({
  isOpen,
  title,
  message,
  error,
  confirmLabel = "Confirmar",
  isSubmitting = false,
  onCancel,
  onConfirm,
}) {
  return (
    <CrmModal
      description={message}
      footer={
        <>
          <button className="crm-button crm-button--secondary" onClick={onCancel} type="button">
            Cancelar
          </button>
          <button
            className="crm-button crm-button--danger"
            disabled={isSubmitting}
            onClick={onConfirm}
            type="button"
          >
            {isSubmitting ? "Procesando..." : confirmLabel}
          </button>
        </>
      }
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
    >
      {error ? <CrmErrorState message={error} /> : null}
    </CrmModal>
  );
}

export default CrmConfirmDialog;
