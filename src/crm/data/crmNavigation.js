export const crmNavigation = [
  { label: "Inicio", path: "/crm/dashboard", key: "dashboard", section: "General" },
  { label: "Tareas", path: "/crm/tasks", key: "tasks", section: "General" },
  { label: "Clientes", path: "/crm/clients", key: "clients", section: "Clientes" },
  { label: "Prospectos", path: "/crm/pipeline", key: "pipeline", section: "Clientes" },
  { label: "Cobros", path: "/crm/charges", key: "charges", section: "Clientes" },
  { label: "Webs y proyectos", path: "/crm/projects", key: "projects", section: "Webs" },
  {
    label: "Proveedores y vencimientos",
    path: "/crm/operations",
    key: "operations",
    section: "Webs",
  },
  { label: "Portfolio", path: "/crm/works", key: "works", section: "Webs" },
  { label: "Alertas", path: "/crm/alerts", key: "alerts", section: "Control" },
  {
    label: "Historial de cambios",
    path: "/crm/audit-logs",
    key: "audit-logs",
    section: "Control",
    adminOnly: true,
  },
  { label: "Configuración", path: "/crm/settings", key: "settings", section: "Control" },
];

export function getCrmPageKey(pathname) {
  const path = pathname.replace(/\/+$/, "");
  if (path === "/crm") return "dashboard";

  const match = crmNavigation.find((item) => item.path === path);
  return match?.key ?? "dashboard";
}
