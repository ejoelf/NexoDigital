import React from "react";
import CrmSidebar from "./CrmSidebar";
import CrmTopbar from "./CrmTopbar";

function CrmLayout({ activeKey, title, children }) {
  return (
    <div className="crm-shell">
      <CrmSidebar activeKey={activeKey} />
      <div className="crm-main">
        <CrmTopbar title={title} />
        <main className="crm-content">{children}</main>
      </div>
    </div>
  );
}

export default CrmLayout;
