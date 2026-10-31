// Traducciones al español de los valores que guarda el backend (enums).
// El valor que se envía a la API sigue siendo el original en inglés.

export const LABELS = {
  // Estados generales
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  PAUSED: "Pausado",
  LEAD: "Prospecto",
  CANDIDATE: "Candidato",
  DEPRECATED: "En desuso",
  ARCHIVED: "Archivado",
  CANCELLED: "Cancelado",
  EXPIRED: "Vencido",
  TRIAL: "Prueba",

  // Proyectos y trabajos
  IDEA: "Idea",
  ANALYSIS: "Análisis",
  DESIGN: "Diseño",
  DEVELOPMENT: "Desarrollo",
  TESTING: "Pruebas",
  REVIEW: "Revisión",
  DEPLOYED: "Publicado",
  PUBLISHED: "Publicado",
  MAINTENANCE: "Mantenimiento",
  CLOSED: "Cerrado",

  // Tipos de proyecto
  WEBSITE: "Sitio web",
  LANDING: "Landing",
  ECOMMERCE: "Tienda online",
  CRM: "CRM",
  SAAS: "SaaS",
  INTERNAL_SYSTEM: "Sistema interno",
  CUSTOM_SOFTWARE: "Software a medida",
  AUTOMATION: "Automatización",

  // Categorías de proveedor
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Base de datos",
  AUTH: "Autenticación",
  STORAGE: "Almacenamiento",
  AI: "IA",
  EMAIL: "Email",
  DOMAIN: "Dominio",
  HOSTING: "Hosting",
  PAYMENTS: "Pagos",
  ANALYTICS: "Analítica",
  SECURITY: "Seguridad",
  MONITORING: "Monitoreo",
  OTHER: "Otro",

  // Frecuencias
  MONTHLY: "Mensual",
  YEARLY: "Anual",
  ONE_TIME: "Pago único",
  USAGE_BASED: "Según uso",

  // Dominios
  EXPIRING: "Por vencer",
  TRANSFERRED: "Transferido",
  PARKED: "Estacionado",

  // Renovaciones, cobros
  PENDING: "Pendiente",
  PAID: "Pagado",
  OVERDUE: "Vencido",
  SUBSCRIPTION: "Suscripción",
  PROVIDER_SERVICE: "Servicio de proveedor",
  LICENSE: "Licencia",
  PROJECT: "Proyecto",
  CONSULTING: "Consultoría",

  // Costos
  INFRASTRUCTURE: "Infraestructura",
  PAYMENT_FEE: "Comisión de pago",

  // Tareas
  IN_PROGRESS: "En curso",
  DONE: "Hecha",
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",

  // Prospectos
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  PROPOSAL_SENT: "Propuesta enviada",
  NEGOTIATION: "Negociando",
  WON: "Ganado",
  LOST: "Perdido",

  // Roles
  ADMIN: "Administrador",
  MEMBER: "Miembro",
  COLLABORATOR: "Colaborador",
  READONLY: "Solo lectura",
};

export function label(value) {
  if (value === undefined || value === null || value === "") return "—";
  return LABELS[value] ?? String(value).replaceAll("_", " ").toLowerCase();
}

export function enumOptions(values) {
  return values.map((value) => ({ label: label(value), value }));
}

export const PROJECT_TYPES = [
  "WEBSITE",
  "LANDING",
  "ECOMMERCE",
  "CRM",
  "SAAS",
  "INTERNAL_SYSTEM",
  "CUSTOM_SOFTWARE",
  "AUTOMATION",
];

export const PROJECT_STATUSES = [
  "IDEA",
  "ANALYSIS",
  "DESIGN",
  "DEVELOPMENT",
  "TESTING",
  "DEPLOYED",
  "MAINTENANCE",
  "PAUSED",
  "CLOSED",
];

export const CLIENT_STATUSES = ["LEAD", "ACTIVE", "PAUSED", "INACTIVE"];
export const LEAD_STAGES = ["NEW", "CONTACTED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"];
export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "DONE", "CANCELLED"];
export const TASK_PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
export const CHARGE_TYPES = ["MAINTENANCE", "PROJECT", "DOMAIN", "HOSTING", "CONSULTING", "OTHER"];
export const CHARGE_STATUSES = ["PENDING", "PAID", "OVERDUE", "CANCELLED"];
export const BILLING_FREQUENCIES = ["MONTHLY", "YEARLY", "ONE_TIME", "USAGE_BASED"];
export const CURRENCIES = ["ARS", "USD", "EUR", "BRL"];
