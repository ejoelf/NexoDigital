// Utilidades de formato compartidas por las pantallas del CRM.

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function formatMoney(amount, currency = "ARS") {
  if (amount === undefined || amount === null || amount === "") return "—";
  return `${currency || "ARS"} ${Number(amount).toLocaleString("es-AR", {
    maximumFractionDigits: 2,
  })}`;
}

export function formatTotals(totals) {
  const entries = Object.entries(totals ?? {}).filter(([, value]) => value);
  if (!entries.length) return "—";
  return entries.map(([currency, value]) => formatMoney(value, currency)).join(" · ");
}

// Días que faltan hasta una fecha (negativo si ya pasó).
export function daysUntil(value) {
  if (!value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(value);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

export function relativeDay(value) {
  const days = daysUntil(value);
  if (days === null) return "";
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days === -1) return "ayer";
  if (days < 0) return `hace ${Math.abs(days)} días`;
  return `en ${days} días`;
}

export function fieldValue(value) {
  return value || "—";
}

// Convierte strings vacíos en undefined para no mandarlos a la API.
export function prune(payload) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() || undefined : value,
    ]),
  );
}

// Para updates: los vacíos se mandan como "" para que el backend limpie el campo.
export function trimAll(payload) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
}

export function dateToIso(value) {
  if (!value) return "";
  return new Date(`${value}T12:00:00`).toISOString();
}

export function relationOptions(rows, labelKey, emptyLabel) {
  return [
    { label: emptyLabel, value: "" },
    ...(rows ?? []).map((row) => ({ label: row[labelKey], value: row.id })),
  ];
}

export function projectOptions(projects, emptyLabel = "Sin proyecto asociado") {
  return [
    { label: emptyLabel, value: "" },
    ...(projects ?? []).map((project) => ({
      label: project.client?.businessName
        ? `${project.name} · ${project.client.businessName}`
        : project.name,
      value: project.id,
    })),
  ];
}

export function actionErrorMessage(error) {
  if (error?.status === 403) return "No tenés permisos suficientes para esta acción.";
  return error?.message || "No se pudo cargar esta sección.";
}

export function syncProjectClient(name, value, next, context) {
  if (name === "projectId") {
    const project = context.projects?.find((item) => item.id === value);
    if (project?.clientId) next.clientId = project.clientId;
  }

  return next;
}
