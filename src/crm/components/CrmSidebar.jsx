import React from "react";
import { crmNavigation } from "../data/crmNavigation";
import { useAuth } from "../hooks/useAuth";

const ICON_PATHS = {
  dashboard:
    "M3 3h8v8H3V3Zm10 0h8v5h-8V3ZM3 13h8v8H3v-8Zm10-3h8v11h-8V10Z",
  clients:
    "M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 1c-2.67 0-8 1.34-8 4v4h14v-4c0-2.66-3.33-4-6-4ZM8 14c-3.11 0-6 1.56-6 4v3h4v-4c0-1.17.58-2.18 1.52-3H8Z",
  projects:
    "M3 5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm4 4v2h10V9H7Zm0 4v2h7v-2H7Z",
  works:
    "M9 3h6a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V5a2 2 0 0 1 2-2Zm0 3h6V5H9v1Zm-4 6v7h14v-7h-5v2h-4v-2H5Zm0-4v2h5v-1h4v1h5v-2H5Z",
  operations:
    "M12 2a2 2 0 0 1 2 2v1.07a7.01 7.01 0 0 1 2.21.92l.76-.76a2 2 0 1 1 2.83 2.83l-.76.76c.42.69.73 1.43.92 2.21H21a2 2 0 1 1 0 4h-1.04a7.01 7.01 0 0 1-.92 2.21l.76.76a2 2 0 1 1-2.83 2.83l-.76-.76a7.01 7.01 0 0 1-2.21.92V21a2 2 0 1 1-4 0v-1.04a7.01 7.01 0 0 1-2.21-.92l-.76.76a2 2 0 1 1-2.83-2.83l.76-.76A7.01 7.01 0 0 1 4.04 14H3a2 2 0 1 1 0-4h1.04c.19-.78.5-1.52.92-2.21l-.76-.76A2 2 0 1 1 7.03 4.2l.76.76A7.01 7.01 0 0 1 10 4.04V3a2 2 0 0 1 2-2Zm0 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  alerts:
    "M12 2a7 7 0 0 1 7 7v3.59l1.7 2.55A1 1 0 0 1 19.87 17H4.13a1 1 0 0 1-.83-1.56L5 12.59V9a7 7 0 0 1 7-7Zm-2 17h4a2 2 0 1 1-4 0Z",
  "audit-logs":
    "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h10v-2H7Zm0 4v2h6v-2H7Z",
  settings:
    "M12 2a2 2 0 0 1 2 2v.35c.76.2 1.47.5 2.12.89l.25-.25a2 2 0 1 1 2.83 2.83l-.25.25c.39.65.69 1.36.89 2.12H20a2 2 0 1 1 0 4h-.35a7.9 7.9 0 0 1-.89 2.12l.25.25a2 2 0 1 1-2.83 2.83l-.25-.25a7.9 7.9 0 0 1-2.12.89V20a2 2 0 1 1-4 0v-.35a7.9 7.9 0 0 1-2.12-.89l-.25.25a2 2 0 1 1-2.83-2.83l.25-.25A7.9 7.9 0 0 1 4.35 14H4a2 2 0 1 1 0-4h.35c.2-.76.5-1.47.89-2.12l-.25-.25A2 2 0 1 1 7.82 4.8l.25.25A7.9 7.9 0 0 1 10.19 4.16V4a2 2 0 0 1 2-2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
};

function NavIcon({ itemKey }) {
  return (
    <span className="crm-nav-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={ICON_PATHS[itemKey]} />
      </svg>
    </span>
  );
}

function CrmSidebar({ activeKey, isOpen, onClose }) {
  const { user } = useAuth();
  const visibleNavigation = crmNavigation.filter(
    (item) => !item.adminOnly || user?.role === "ADMIN",
  );
  const groupedNavigation = visibleNavigation.reduce((groups, item) => {
    const section = item.section || "General";
    groups[section] = [...(groups[section] || []), item];
    return groups;
  }, {});

  return (
    <aside
      className={`crm-sidebar ${isOpen ? "crm-sidebar--open" : ""}`}
      aria-label="Navegación del CRM"
    >
      <div className="crm-sidebar-header">
        <a className="crm-sidebar-brand" href="/crm/dashboard">
          <img
            src="/brand/nexodigital-monochrome-white.svg"
            alt="NexoDigital"
          />
          <span>CRM</span>
        </a>

        <button
          aria-label="Cerrar navegación"
          className="crm-sidebar-close"
          onClick={onClose}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6.7 5.3 12 12-1.4 1.4-12-12 1.4-1.4Zm10.6 0 1.4 1.4-12 12-1.4-1.4 12-12Z" />
          </svg>
        </button>
      </div>

      <div className="crm-sidebar-context">
        <span className="crm-sidebar-context-dot" aria-hidden="true" />
        <div>
          <strong>Centro operativo</strong>
          <small>Datos y procesos conectados</small>
        </div>
      </div>

      <nav className="crm-sidebar-nav" aria-label="Secciones del CRM">
        {Object.entries(groupedNavigation).map(([section, items]) => (
          <div className="crm-nav-group" key={section}>
            <p>{section}</p>
            <div>
              {items.map((item) => (
                <a
                  key={item.key}
                  className={`crm-nav-link ${
                    item.key === activeKey ? "crm-nav-link--active" : ""
                  }`}
                  href={item.path}
                  aria-current={item.key === activeKey ? "page" : undefined}
                  onClick={onClose}
                >
                  <NavIcon itemKey={item.key} />
                  <span>{item.label}</span>
                  <i aria-hidden="true">›</i>
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="crm-sidebar-footer">
        <div className="crm-sidebar-footer-icon" aria-hidden="true">
          <img src="/brand/nexodigital-isotipo.svg" alt="" />
        </div>
        <div>
          <strong>Entorno privado</strong>
          <p>Sesión protegida y operación centralizada.</p>
        </div>
      </div>
    </aside>
  );
}

export default CrmSidebar;
