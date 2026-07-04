import React from "react";
import { crmNavigation } from "../data/crmNavigation";
import { useAuth } from "../hooks/useAuth";

function CrmSidebar({ activeKey }) {
  const { user } = useAuth();
  const visibleNavigation = crmNavigation.filter(
    (item) => !item.adminOnly || user?.role === "ADMIN",
  );

  return (
    <aside className="crm-sidebar">
      <a className="crm-sidebar-brand" href="/crm/dashboard">
        <img
          src="/brand/nexodigital-monochrome-white.svg"
          alt="NexoDigital"
        />
      </a>

      <nav className="crm-sidebar-nav" aria-label="Navegacion CRM">
        {visibleNavigation.map((item) => (
          <a
            key={item.key}
            className={`crm-nav-link ${
              item.key === activeKey ? "crm-nav-link--active" : ""
            }`}
            href={item.path}
          >
            <span className="crm-nav-mark" aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="crm-sidebar-footer">
        <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
        <p>CRM V1 preparado para conectar con API.</p>
      </div>
    </aside>
  );
}

export default CrmSidebar;
