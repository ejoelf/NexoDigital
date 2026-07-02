import React from "react";
import { useAuth } from "../hooks/useAuth";

function CrmTopbar({ title }) {
  const { logout, user } = useAuth();

  return (
    <header className="crm-topbar">
      <div>
        <p className="crm-topbar-kicker">Panel privado</p>
        <h2>{title}</h2>
      </div>

      <div className="crm-topbar-actions">
        {user ? (
          <div className="crm-user-chip">
            <span>{user.name}</span>
            <small>
              {user.role} · {user.email}
            </small>
          </div>
        ) : null}
        <span className="crm-env-pill">Sesion real</span>
        <a className="crm-topbar-link" href="/">
          Ver web publica
        </a>
        <button className="crm-logout-button" onClick={logout} type="button">
          Salir
        </button>
      </div>
    </header>
  );
}

export default CrmTopbar;
