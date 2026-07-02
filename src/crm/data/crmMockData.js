export const crmStats = [
  {
    label: "Clientes activos",
    value: "12",
    trend: "+3 este mes",
    tone: "primary",
  },
  {
    label: "Proyectos en curso",
    value: "7",
    trend: "4 en desarrollo",
    tone: "cyan",
  },
  {
    label: "Renovaciones proximas",
    value: "5",
    trend: "30 dias",
    tone: "warning",
  },
  {
    label: "Costos recurrentes",
    value: "USD 184",
    trend: "estimado mensual",
    tone: "dark",
  },
];

export const crmRecentActivity = [
  {
    title: "Nuevo trabajo cargado",
    detail: "Tapiceria Lider paso a revision publica.",
    time: "Hoy",
  },
  {
    title: "Dominio por renovar",
    detail: "electricidadzacarias.com vence dentro de 18 dias.",
    time: "Ayer",
  },
  {
    title: "Proyecto actualizado",
    detail: "CRM interno avanzo a fase de dashboard.",
    time: "2 dias",
  },
];

export const crmTables = {
  clients: [
    ["Nico Galicia Stylist Mens", "Servicios", "Activo", "Web publica"],
    ["Tapiceria Lider", "Comercio", "Mantenimiento", "Landing"],
    ["CF MetalPintura", "Industrial", "Activo", "Web institucional"],
  ],
  projects: [
    ["CRM NexoDigital", "Sistema interno", "En desarrollo", "NexoDigital"],
    ["TurnosGo", "SaaS", "Planificacion", "Producto propio"],
    ["Electricidad Zacarias", "Web publica", "Publicado", "Servicios"],
  ],
  works: [
    ["NexoDigital", "Empresa madre", "Privado", "React"],
    ["Tapiceria Lider", "Web comercial", "Publicado", "Vite"],
    ["CF MetalPintura", "Institucional", "Publicado", "React"],
  ],
  operations: [
    ["Vercel", "Frontend hosting", "Activo", "NexoDigital"],
    ["Neon", "PostgreSQL", "Activo", "Infraestructura"],
    ["Namecheap/Hostinger", "Dominios", "Revisar", "Clientes"],
  ],
  alerts: [
    ["Renovacion dominio", "Warning", "30 dias", "Pendiente"],
    ["Costo recurrente", "Info", "Mensual", "Activo"],
    ["Auditoria", "Info", "Hoy", "Sin incidentes"],
  ],
  auditLogs: [
    ["AUTH_LOGIN_SUCCESS", "AUTH", "Admin", "Hoy"],
    ["CLIENT_UPDATED", "CLIENT", "Admin", "Ayer"],
    ["WORK_ARCHIVED", "WORK", "Admin", "2 dias"],
  ],
};
