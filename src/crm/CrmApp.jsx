import React, { useEffect } from "react";
import CrmLayout from "./components/CrmLayout";
import { AuthProvider } from "./context/AuthContext";
import { getCrmPageKey } from "./data/crmNavigation";
import { useAuth } from "./hooks/useAuth";
import CrmAlerts from "./pages/CrmAlerts";
import CrmAuditLogs from "./pages/CrmAuditLogs";
import CrmClients from "./pages/CrmClients";
import CrmDashboard from "./pages/CrmDashboard";
import CrmLogin from "./pages/CrmLogin";
import CrmOperations from "./pages/CrmOperations";
import CrmProjects from "./pages/CrmProjects";
import CrmSettings from "./pages/CrmSettings";
import CrmWorks from "./pages/CrmWorks";
import "./styles/crm.css";
import "./styles/crm-layout.css";
import "./styles/crm-login.css";
import "./styles/crm-auth-screen.css";

const pages = {
  dashboard: {
    title: "Dashboard",
    component: <CrmDashboard />,
  },
  clients: {
    title: "Clientes",
    component: <CrmClients />,
  },
  projects: {
    title: "Proyectos",
    component: <CrmProjects />,
  },
  works: {
    title: "Trabajos",
    component: <CrmWorks />,
  },
  operations: {
    title: "Operaciones",
    component: <CrmOperations />,
  },
  alerts: {
    title: "Alertas",
    component: <CrmAlerts />,
  },
  "audit-logs": {
    title: "Auditoria",
    component: <CrmAuditLogs />,
  },
  settings: {
    title: "Configuracion",
    component: <CrmSettings />,
  },
};

function CrmLoadingScreen() {
  return (
    <main className="crm-loading-screen">
      <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
      <p>Validando sesion...</p>
    </main>
  );
}

function CrmRedirect({ to }) {
  useEffect(() => {
    window.location.assign(to);
  }, [to]);

  return <CrmLoadingScreen />;
}

function CrmRoutes() {
  const pathname = window.location.pathname;
  const { isAuthenticated, isInitializing } = useAuth();

  if (pathname === "/crm/login") {
    if (isInitializing) return <CrmLoadingScreen />;
    if (isAuthenticated) {
      return <CrmRedirect to="/crm/dashboard" />;
    }

    return <CrmLogin />;
  }

  if (isInitializing) return <CrmLoadingScreen />;

  if (!isAuthenticated) {
    return <CrmRedirect to="/crm/login" />;
  }

  const activeKey = getCrmPageKey(pathname);
  const page = pages[activeKey] ?? pages.dashboard;

  return (
    <CrmLayout activeKey={activeKey} title={page.title}>
      {page.component}
    </CrmLayout>
  );
}

function CrmApp() {
  return (
    <AuthProvider>
      <CrmRoutes />
    </AuthProvider>
  );
}

export default CrmApp;
