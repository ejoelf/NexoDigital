import React, { useEffect } from "react";
import CrmLayout from "./components/CrmLayout";
import { AuthProvider } from "./context/AuthContext";
import { getCrmPageKey } from "./data/crmNavigation";
import { useAuth } from "./hooks/useAuth";
import CrmAlerts from "./pages/CrmAlerts";
import CrmAuditLogs from "./pages/CrmAuditLogs";
import CrmClients from "./pages/CrmClients";
import CrmCharges from "./pages/CrmCharges";
import CrmHome from "./pages/CrmHome";
import CrmLogin from "./pages/CrmLogin";
import CrmOperations from "./pages/CrmOperations";
import CrmPipeline from "./pages/CrmPipeline";
import CrmProjects from "./pages/CrmProjects";
import CrmSettings from "./pages/CrmSettings";
import CrmTasks from "./pages/CrmTasks";
import CrmWorks from "./pages/CrmWorks";
import "./styles/crm.css";
import "./styles/crm-layout.css";
import "./styles/crm-login.css";
import "./styles/crm-auth-screen.css";
import "./styles/crm-v2.css";
import "./styles/crm-v3.css";

const pages = {
  dashboard: {
    title: "Inicio",
    component: <CrmHome />,
  },
  tasks: {
    title: "Tareas",
    component: <CrmTasks />,
  },
  pipeline: {
    title: "Prospectos",
    component: <CrmPipeline />,
  },
  charges: {
    title: "Cobros",
    component: <CrmCharges />,
  },
  clients: {
    title: "Clientes",
    component: <CrmClients />,
  },
  projects: {
    title: "Webs y proyectos",
    component: <CrmProjects />,
  },
  works: {
    title: "Portfolio",
    component: <CrmWorks />,
  },
  operations: {
    title: "Proveedores y vencimientos",
    component: <CrmOperations />,
  },
  alerts: {
    title: "Alertas",
    component: <CrmAlerts />,
  },
  "audit-logs": {
    title: "Historial de cambios",
    component: <CrmAuditLogs />,
  },
  settings: {
    title: "Configuración",
    component: <CrmSettings />,
  },
};

function CrmLoadingScreen() {
  return (
    <main className="crm-loading-screen">
      <img src="/brand/nd-monogram.webp" alt="" aria-hidden="true" />
      <p>Validando sesión...</p>
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
