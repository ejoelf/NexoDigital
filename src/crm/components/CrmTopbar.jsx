import React from "react";
import { useAuth } from "../hooks/useAuth";

function getInitials(name, email) {
  const source = name || email || "ND";
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function CrmTopbar({ title, onMenuToggle }) {
  const { logout, user } = useAuth();
  const today = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  }).format(new Date());

  return (
    <header className="crm-topbar">
      <div className="crm-topbar-heading">
        <button
          aria-label="Abrir navegación"
          className="crm-topbar-menu"
          onClick={onMenuToggle}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
          </svg>
        </button>

        <div>
          <p className="crm-topbar-kicker">Centro operativo · {today}</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="crm-topbar-actions">
        <span className="crm-env-pill">
          <i aria-hidden="true" />
          Sesión activa
        </span>

        <a className="crm-topbar-link" href="/" target="_self">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm5.93 8h-2.01a14.8 14.8 0 0 0-1.2-5.03A7.03 7.03 0 0 1 17.93 11ZM12 5c.8 0 1.98 2.13 2.12 6H9.88C10.02 7.13 11.2 5 12 5ZM9.28 5.97A14.8 14.8 0 0 0 8.08 11H6.07a7.03 7.03 0 0 1 3.21-5.03ZM6.07 13h2.01a14.8 14.8 0 0 0 1.2 5.03A7.03 7.03 0 0 1 6.07 13ZM12 19c-.8 0-1.98-2.13-2.12-6h4.24c-.14 3.87-1.32 6-2.12 6Zm2.72-.97A14.8 14.8 0 0 0 15.92 13h2.01a7.03 7.03 0 0 1-3.21 5.03Z" />
          </svg>
          <span>Web pública</span>
        </a>

        {user ? (
          <div className="crm-user-chip">
            <span className="crm-user-avatar" aria-hidden="true">
              {getInitials(user.name, user.email)}
            </span>
            <div>
              <span>{user.name || "Usuario NexoDigital"}</span>
              <small>
                {user.role} · {user.email}
              </small>
            </div>
          </div>
        ) : null}

        <button
          aria-label="Cerrar sesión"
          className="crm-logout-button"
          onClick={logout}
          type="button"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3h8v2H6v14h6v2H4V3Zm12.59 4L22 12l-5.41 5-1.36-1.47L18.06 13H9v-2h9.06l-2.83-2.53L16.59 7Z" />
          </svg>
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}

export default CrmTopbar;
