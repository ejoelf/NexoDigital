export const crmNavigation = [
  {
    label: "Dashboard",
    path: "/crm/dashboard",
    key: "dashboard",
    section: "General",
  },
  {
    label: "Clientes",
    path: "/crm/clients",
    key: "clients",
    section: "Gestion",
  },
  {
    label: "Proyectos",
    path: "/crm/projects",
    key: "projects",
    section: "Gestion",
  },
  {
    label: "Trabajos",
    path: "/crm/works",
    key: "works",
    section: "Gestion",
  },
  {
    label: "Operaciones",
    path: "/crm/operations",
    key: "operations",
    section: "Operacion",
  },
  {
    label: "Alertas",
    path: "/crm/alerts",
    key: "alerts",
    section: "Control",
  },
  {
    label: "Auditoria",
    path: "/crm/audit-logs",
    key: "audit-logs",
    section: "Control",
    adminOnly: true,
  },
  {
    label: "Configuracion",
    path: "/crm/settings",
    key: "settings",
    section: "Sistema",
  },
];

export function getCrmPageKey(pathname) {
  if (pathname === "/crm" || pathname === "/crm/") return "dashboard";

  const match = crmNavigation.find((item) => item.path === pathname);
  return match?.key ?? "dashboard";
}
