import React, { useEffect, useState } from "react";
import CrmSidebar from "./CrmSidebar";
import CrmTopbar from "./CrmTopbar";

function CrmLayout({ activeKey, title, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsSidebarOpen(false);
    }

    function handleResize() {
      if (window.innerWidth > 1040) setIsSidebarOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <div className={`crm-shell ${isSidebarOpen ? "crm-shell--menu-open" : ""}`}>
      <CrmSidebar
        activeKey={activeKey}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <button
        aria-label="Cerrar navegación"
        className="crm-sidebar-backdrop"
        onClick={() => setIsSidebarOpen(false)}
        tabIndex={isSidebarOpen ? 0 : -1}
        type="button"
      />

      <div className="crm-main">
        <CrmTopbar
          onMenuToggle={() => setIsSidebarOpen((current) => !current)}
          title={title}
        />
        <main className="crm-content">{children}</main>
      </div>
    </div>
  );
}

export default CrmLayout;
