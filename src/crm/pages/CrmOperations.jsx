import React, { useCallback, useEffect, useMemo, useState } from "react";
import CrmOperationsModule from "../components/CrmOperationsModule";
import CrmSectionHeader from "../components/CrmSectionHeader";
import CrmStatusBadge from "../components/CrmStatusBadge";
import { useAuth } from "../hooks/useAuth";
import { listClients } from "../services/clientsService";
import {
  archiveCost,
  createCost,
  listCosts,
  updateCost,
} from "../services/costsService";
import {
  archiveDomain,
  createDomain,
  listDomains,
  updateDomain,
} from "../services/domainsService";
import { listProjects } from "../services/projectsService";
import {
  archiveProvider,
  createProvider,
  listProviders,
  updateProvider,
} from "../services/providersService";
import {
  cancelRenewal,
  createRenewal,
  listRenewals,
  updateRenewal,
} from "../services/renewalsService";
import {
  cancelSubscription,
  createSubscription,
  listSubscriptions,
  updateSubscription,
} from "../services/subscriptionsService";

const providerCategories = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "AUTH",
  "STORAGE",
  "AI",
  "EMAIL",
  "DOMAIN",
  "HOSTING",
  "PAYMENTS",
  "ANALYTICS",
  "SECURITY",
  "MONITORING",
  "OTHER",
];
const providerStatuses = ["ACTIVE", "CANDIDATE", "DEPRECATED"];
const billingFrequencies = ["MONTHLY", "YEARLY", "ONE_TIME", "USAGE_BASED"];
const subscriptionStatuses = ["ACTIVE", "TRIAL", "CANCELLED", "EXPIRED", "PAUSED"];
const domainStatuses = ["ACTIVE", "EXPIRING", "EXPIRED", "TRANSFERRED", "PARKED"];
const renewalTypes = ["SUBSCRIPTION", "DOMAIN", "PROVIDER_SERVICE", "LICENSE", "OTHER"];
const renewalStatuses = ["PENDING", "PAID", "OVERDUE", "CANCELLED"];
const costCategories = [
  "INFRASTRUCTURE",
  "DOMAIN",
  "EMAIL",
  "AI",
  "DEVELOPMENT",
  "MAINTENANCE",
  "LICENSE",
  "PAYMENT_FEE",
  "OTHER",
];
const costStatuses = ["ACTIVE", "ARCHIVED", "CANCELLED"];

function fieldValue(value) {
  return value || "—";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR");
}

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function formatMoney(amount, currency = "USD") {
  if (amount === undefined || amount === null || amount === "") return "—";
  return `${currency || "USD"} ${Number(amount).toLocaleString("es-AR")}`;
}

function enumOptions(values) {
  return values.map((value) => ({ label: value, value }));
}

function relationOptions(rows, labelKey, emptyLabel) {
  return [
    { label: emptyLabel, value: "" },
    ...(rows ?? []).map((row) => ({ label: row[labelKey], value: row.id })),
  ];
}

function projectOptions(projects) {
  return [
    { label: "Sin proyecto asociado", value: "" },
    ...(projects ?? []).map((project) => ({
      label: project.client?.businessName
        ? `${project.name} · ${project.client.businessName}`
        : project.name,
      value: project.id,
    })),
  ];
}

function subscriptionOptions(subscriptions) {
  return [
    { label: "Sin suscripcion asociada", value: "" },
    ...(subscriptions ?? []).map((subscription) => ({
      label: subscription.provider?.name
        ? `${subscription.name} · ${subscription.provider.name}`
        : subscription.name,
      value: subscription.id,
    })),
  ];
}

function domainOptions(domains) {
  return [
    { label: "Sin dominio asociado", value: "" },
    ...(domains ?? []).map((domain) => ({
      label: domain.domainName,
      value: domain.id,
    })),
  ];
}

function prune(payload) {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]),
  );
}

function parseNumber(value) {
  if (value === "" || value === undefined || value === null) return undefined;
  return Number(value);
}

function parseInteger(value) {
  if (value === "" || value === undefined || value === null) return undefined;
  return Number.parseInt(value, 10);
}

function booleanChip(active, activeLabel, inactiveLabel) {
  return (
    <span
      className={`crm-status-badge ${
        active ? "crm-status-badge--active" : "crm-status-badge--inactive"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function actionErrorMessage(error) {
  if (error?.status === 403) return "No tenes permisos suficientes para esta accion.";
  return error?.message || "No se pudo cargar este modulo.";
}

function syncProjectClient(name, value, next, context) {
  if (name === "projectId") {
    const project = context.projects.find((item) => item.id === value);
    if (project?.clientId) next.clientId = project.clientId;
  }

  return next;
}

function syncSubscriptionRelations(name, value, next, context) {
  if (name === "subscriptionId") {
    const subscription = context.subscriptions.find((item) => item.id === value);
    if (subscription?.providerId) next.providerId = subscription.providerId;
    if (subscription?.clientId) next.clientId = subscription.clientId;
    if (subscription?.projectId) next.projectId = subscription.projectId;
  }

  return syncProjectClient(name, value, next, context);
}

function syncRenewalRelations(name, value, next, context) {
  if (name === "entityType") {
    next.entityId = "";
  }

  return syncProjectClient(name, value, next, context);
}

function baseRelationFields(includeProvider = false, includeSubscription = false) {
  return [
    ...(includeProvider
      ? [
          {
            label: "Proveedor",
            name: "providerId",
            type: "select",
            options: (context) =>
              relationOptions(context.providers, "name", "Sin proveedor asociado"),
          },
        ]
      : []),
    {
      label: "Cliente",
      name: "clientId",
      type: "select",
      options: (context) =>
        relationOptions(context.clients, "businessName", "Sin cliente asociado"),
    },
    {
      label: "Proyecto",
      name: "projectId",
      type: "select",
      options: (context) => projectOptions(context.projects),
    },
    ...(includeSubscription
      ? [
          {
            label: "Suscripcion",
            name: "subscriptionId",
            type: "select",
            options: (context) => subscriptionOptions(context.subscriptions),
          },
        ]
      : []),
  ];
}

function buildConfigs() {
  const providers = {
    key: "providers",
    title: "Proveedores",
    pluralLabel: "proveedores",
    singularCountLabel: "proveedor registrado",
    pluralCountLabel: "proveedores registrados",
    createLabel: "Nuevo proveedor",
    createTitle: "Nuevo proveedor",
    editTitle: "Editar proveedor",
    submitLabel: "Guardar proveedor",
    archiveButtonLabel: "Deprecated",
    archiveConfirmLabel: "Marcar deprecated",
    archiveTitle: "Marcar proveedor como deprecated",
    archiveMessage: (row) =>
      `El proveedor ${row?.name || ""} quedara DEPRECATED y dejara de figurar como oficial.`,
    emptyTitle: "Sin proveedores",
    emptyMessage: "Todavia no hay proveedores cargados.",
    formDescription: "Registra proveedores oficiales, candidatos o servicios de apoyo.",
    emptyForm: {
      name: "",
      category: "OTHER",
      websiteUrl: "",
      accountEmail: "",
      recommendedUse: "",
      internalOwner: "",
      status: "CANDIDATE",
      isOfficial: false,
      notes: "",
    },
    columns: [
      {
        key: "name",
        label: "Nombre",
        render: (row) => <strong className="crm-table-primary">{row.name}</strong>,
      },
      { key: "category", label: "Categoria", render: (row) => fieldValue(row.category) },
      { key: "websiteUrl", label: "Website", render: (row) => fieldValue(row.websiteUrl) },
      {
        key: "recommendedUse",
        label: "Uso",
        render: (row) => fieldValue(row.recommendedUse),
      },
      {
        key: "internalOwner",
        label: "Owner",
        render: (row) => fieldValue(row.internalOwner),
      },
      {
        key: "isOfficial",
        label: "Oficial",
        render: (row) => booleanChip(row.isOfficial, "oficial", "no oficial"),
      },
      { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
      { key: "updatedAt", label: "Actualizado", render: (row) => formatDate(row.updatedAt) },
    ],
    fields: [
      { label: "Nombre", name: "name", required: true },
      { label: "Categoria", name: "category", type: "select", options: enumOptions(providerCategories), required: true },
      { label: "Website", name: "websiteUrl" },
      { label: "Email de cuenta", name: "accountEmail", type: "email" },
      { label: "Uso recomendado", name: "recommendedUse" },
      { label: "Owner interno", name: "internalOwner" },
      { label: "Estado", name: "status", type: "select", options: enumOptions(providerStatuses) },
      { label: "Proveedor oficial", name: "isOfficial", type: "checkbox" },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      name: row.name ?? "",
      category: row.category ?? "OTHER",
      websiteUrl: row.websiteUrl ?? "",
      accountEmail: row.accountEmail ?? "",
      recommendedUse: row.recommendedUse ?? "",
      internalOwner: row.internalOwner ?? "",
      status: row.status ?? "CANDIDATE",
      isOfficial: Boolean(row.isOfficial),
      notes: row.notes ?? "",
    }),
    toPayload: (form) => prune(form),
    create: createProvider,
    update: updateProvider,
    archive: archiveProvider,
  };

  const subscriptions = {
    key: "subscriptions",
    title: "Suscripciones",
    pluralLabel: "suscripciones",
    singularCountLabel: "suscripcion registrada",
    pluralCountLabel: "suscripciones registradas",
    createLabel: "Nueva suscripcion",
    createTitle: "Nueva suscripcion",
    editTitle: "Editar suscripcion",
    submitLabel: "Guardar suscripcion",
    archiveButtonLabel: "Cancelar",
    archiveConfirmLabel: "Cancelar suscripcion",
    archiveTitle: "Cancelar suscripcion",
    archiveMessage: (row) => `La suscripcion ${row?.name || ""} quedara CANCELLED.`,
    emptyTitle: "Sin suscripciones",
    emptyMessage: "Todavia no hay suscripciones cargadas.",
    formDescription: "Registra servicios contratados, ciclos y responsables de pago.",
    emptyForm: {
      name: "",
      providerId: "",
      clientId: "",
      projectId: "",
      serviceType: "",
      planName: "",
      amount: "",
      currency: "USD",
      billingFrequency: "MONTHLY",
      startDate: "",
      renewalDate: "",
      paymentResponsibleName: "",
      status: "ACTIVE",
      notes: "",
    },
    columns: [
      { key: "name", label: "Nombre", render: (row) => <strong className="crm-table-primary">{row.name}</strong> },
      { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
      { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
      { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
      { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
      { key: "billingFrequency", label: "Frecuencia", render: (row) => fieldValue(row.billingFrequency) },
      { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
      { key: "renewalDate", label: "Renovacion", render: (row) => formatDate(row.renewalDate) },
      { key: "updatedAt", label: "Actualizado", render: (row) => formatDate(row.updatedAt) },
    ],
    fields: [
      { label: "Nombre", name: "name", required: true },
      ...baseRelationFields(true),
      { label: "Tipo de servicio", name: "serviceType", required: true },
      { label: "Plan", name: "planName" },
      { label: "Monto", name: "amount", type: "number", required: true },
      { label: "Moneda", name: "currency" },
      { label: "Frecuencia", name: "billingFrequency", type: "select", options: enumOptions(billingFrequencies), required: true },
      { label: "Inicio", name: "startDate", type: "date" },
      { label: "Proxima renovacion", name: "renewalDate", type: "date" },
      { label: "Responsable de pago", name: "paymentResponsibleName" },
      { label: "Estado", name: "status", type: "select", options: enumOptions(subscriptionStatuses) },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      name: row.name ?? "",
      providerId: row.providerId ?? row.provider?.id ?? "",
      clientId: row.clientId ?? row.client?.id ?? "",
      projectId: row.projectId ?? row.project?.id ?? "",
      serviceType: row.serviceType ?? "",
      planName: row.planName ?? "",
      amount: row.amount ?? "",
      currency: row.currency ?? "USD",
      billingFrequency: row.billingFrequency ?? "MONTHLY",
      startDate: toDateInput(row.startDate),
      renewalDate: toDateInput(row.renewalDate),
      paymentResponsibleName: row.paymentResponsibleName ?? "",
      status: row.status ?? "ACTIVE",
      notes: row.notes ?? "",
    }),
    toPayload: (form) => prune({ ...form, amount: parseNumber(form.amount) }),
    onFieldChange: syncRenewalRelations,
    create: createSubscription,
    update: updateSubscription,
    archive: cancelSubscription,
  };

  const domains = {
    key: "domains",
    title: "Dominios",
    pluralLabel: "dominios",
    singularCountLabel: "dominio registrado",
    pluralCountLabel: "dominios registrados",
    createLabel: "Nuevo dominio",
    createTitle: "Nuevo dominio",
    editTitle: "Editar dominio",
    submitLabel: "Guardar dominio",
    archiveButtonLabel: "Parkear",
    archiveConfirmLabel: "Parkear dominio",
    archiveTitle: "Parkear dominio",
    archiveMessage: (row) => `El dominio ${row?.domainName || ""} quedara PARKED y sin auto-renew.`,
    emptyTitle: "Sin dominios",
    emptyMessage: "Todavia no hay dominios cargados.",
    formDescription: "Administra dominios, proveedores, expiraciones y renovacion automatica.",
    emptyForm: {
      domainName: "",
      providerId: "",
      clientId: "",
      projectId: "",
      registrar: "",
      dnsProvider: "",
      purchaseDate: "",
      expirationDate: "",
      autoRenew: false,
      paymentResponsibleName: "",
      status: "ACTIVE",
      notes: "",
    },
    columns: [
      { key: "domainName", label: "Dominio", render: (row) => <strong className="crm-table-primary">{row.domainName}</strong> },
      { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
      { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
      { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
      { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
      { key: "expirationDate", label: "Expira", render: (row) => formatDate(row.expirationDate) },
      { key: "autoRenew", label: "Auto-renew", render: (row) => booleanChip(row.autoRenew, "auto", "manual") },
      { key: "updatedAt", label: "Actualizado", render: (row) => formatDate(row.updatedAt) },
    ],
    fields: [
      { label: "Dominio", name: "domainName", required: true },
      ...baseRelationFields(true),
      { label: "Registrador", name: "registrar" },
      { label: "DNS provider", name: "dnsProvider" },
      { label: "Fecha de compra", name: "purchaseDate", type: "date" },
      { label: "Fecha de expiracion", name: "expirationDate", type: "date" },
      { label: "Auto-renew", name: "autoRenew", type: "checkbox" },
      { label: "Responsable de pago", name: "paymentResponsibleName" },
      { label: "Estado", name: "status", type: "select", options: enumOptions(domainStatuses) },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      domainName: row.domainName ?? "",
      providerId: row.providerId ?? row.provider?.id ?? "",
      clientId: row.clientId ?? row.client?.id ?? "",
      projectId: row.projectId ?? row.project?.id ?? "",
      registrar: row.registrar ?? "",
      dnsProvider: row.dnsProvider ?? "",
      purchaseDate: toDateInput(row.purchaseDate),
      expirationDate: toDateInput(row.expirationDate),
      autoRenew: Boolean(row.autoRenew),
      paymentResponsibleName: row.paymentResponsibleName ?? "",
      status: row.status ?? "ACTIVE",
      notes: row.notes ?? "",
    }),
    toPayload: (form) => prune(form),
    onFieldChange: syncProjectClient,
    create: createDomain,
    update: updateDomain,
    archive: archiveDomain,
  };

  const renewals = {
    key: "renewals",
    title: "Renovaciones",
    pluralLabel: "renovaciones",
    singularCountLabel: "renovacion registrada",
    pluralCountLabel: "renovaciones registradas",
    createLabel: "Nueva renovacion",
    createTitle: "Nueva renovacion",
    editTitle: "Editar renovacion",
    submitLabel: "Guardar renovacion",
    archiveButtonLabel: "Cancelar",
    archiveConfirmLabel: "Cancelar renovacion",
    archiveTitle: "Cancelar renovacion",
    archiveMessage: (row) => `La renovacion ${row?.entityType || ""} quedara CANCELLED.`,
    emptyTitle: "Sin renovaciones",
    emptyMessage: "Todavia no hay renovaciones cargadas.",
    formDescription: "Registra vencimientos operativos y recordatorios futuros.",
    emptyForm: {
      entityType: "OTHER",
      entityId: "",
      clientId: "",
      projectId: "",
      dueDate: "",
      amount: "",
      currency: "USD",
      status: "PENDING",
      reminderDays: "30",
      paymentResponsibleName: "",
      notes: "",
    },
    columns: [
      { key: "entityType", label: "Tipo", render: (row) => <strong className="crm-table-primary">{row.entityType}</strong> },
      { key: "dueDate", label: "Vence", render: (row) => formatDate(row.dueDate) },
      { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
      { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
      { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
      { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
      { key: "reminderDays", label: "Aviso", render: (row) => (row.reminderDays ? `${row.reminderDays} dias` : "—") },
      { key: "updatedAt", label: "Actualizado", render: (row) => formatDate(row.updatedAt) },
    ],
    fields: [
      { label: "Tipo relacionado", name: "entityType", type: "select", options: enumOptions(renewalTypes), required: true },
      {
        label: "Registro relacionado",
        name: "entityId",
        type: "select",
        options: (context, form) => {
          if (form.entityType === "SUBSCRIPTION") return subscriptionOptions(context.subscriptions);
          if (form.entityType === "DOMAIN") return domainOptions(context.domains);
          return [{ label: "Sin registro relacionado", value: "" }];
        },
      },
      ...baseRelationFields(false),
      { label: "Fecha de vencimiento", name: "dueDate", type: "date", required: true },
      { label: "Monto", name: "amount", type: "number" },
      { label: "Moneda", name: "currency" },
      { label: "Estado", name: "status", type: "select", options: enumOptions(renewalStatuses) },
      { label: "Dias de recordatorio", name: "reminderDays", type: "number" },
      { label: "Responsable de pago", name: "paymentResponsibleName" },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      entityType: row.entityType ?? "OTHER",
      entityId: row.entityId ?? "",
      clientId: row.clientId ?? row.client?.id ?? "",
      projectId: row.projectId ?? row.project?.id ?? "",
      dueDate: toDateInput(row.dueDate),
      amount: row.amount ?? "",
      currency: row.currency ?? "USD",
      status: row.status ?? "PENDING",
      reminderDays: row.reminderDays ?? "",
      paymentResponsibleName: row.paymentResponsibleName ?? "",
      notes: row.notes ?? "",
    }),
    toPayload: (form) =>
      prune({
        ...form,
        amount: parseNumber(form.amount),
        reminderDays: parseInteger(form.reminderDays),
      }),
    onFieldChange: syncProjectClient,
    create: createRenewal,
    update: updateRenewal,
    archive: cancelRenewal,
  };

  const costs = {
    key: "costs",
    title: "Costos",
    pluralLabel: "costos",
    singularCountLabel: "costo registrado",
    pluralCountLabel: "costos registrados",
    createLabel: "Nuevo costo",
    createTitle: "Nuevo costo",
    editTitle: "Editar costo",
    submitLabel: "Guardar costo",
    archiveButtonLabel: "Archivar",
    archiveConfirmLabel: "Archivar costo",
    archiveTitle: "Archivar costo",
    archiveMessage: (row) => `El costo ${row?.concept || ""} quedara ARCHIVED.`,
    emptyTitle: "Sin costos",
    emptyMessage: "Todavia no hay costos cargados.",
    formDescription: "Registra costos activos, recurrentes, one-time y asociados a operaciones.",
    emptyForm: {
      concept: "",
      providerId: "",
      clientId: "",
      projectId: "",
      subscriptionId: "",
      category: "OTHER",
      amount: "",
      currency: "USD",
      frequency: "MONTHLY",
      date: "",
      status: "ACTIVE",
      notes: "",
    },
    columns: [
      { key: "concept", label: "Concepto", render: (row) => <strong className="crm-table-primary">{row.concept}</strong> },
      { key: "provider", label: "Proveedor", render: (row) => fieldValue(row.provider?.name) },
      { key: "client", label: "Cliente", render: (row) => fieldValue(row.client?.businessName) },
      { key: "project", label: "Proyecto", render: (row) => fieldValue(row.project?.name) },
      { key: "subscription", label: "Suscripcion", render: (row) => fieldValue(row.subscription?.name) },
      { key: "status", label: "Estado", render: (row) => <CrmStatusBadge status={row.status} /> },
      { key: "frequency", label: "Ciclo", render: (row) => fieldValue(row.frequency) },
      { key: "amount", label: "Monto", render: (row) => formatMoney(row.amount, row.currency) },
      { key: "date", label: "Fecha", render: (row) => formatDate(row.date) },
      { key: "updatedAt", label: "Actualizado", render: (row) => formatDate(row.updatedAt) },
    ],
    fields: [
      { label: "Concepto", name: "concept", required: true },
      ...baseRelationFields(true, true),
      { label: "Categoria", name: "category", type: "select", options: enumOptions(costCategories), required: true },
      { label: "Monto", name: "amount", type: "number", required: true },
      { label: "Moneda", name: "currency" },
      { label: "Ciclo", name: "frequency", type: "select", options: enumOptions(billingFrequencies), required: true },
      { label: "Fecha", name: "date", type: "date" },
      { label: "Estado", name: "status", type: "select", options: enumOptions(costStatuses) },
      { label: "Notas", name: "notes", type: "textarea" },
    ],
    toForm: (row) => ({
      concept: row.concept ?? "",
      providerId: row.providerId ?? row.provider?.id ?? "",
      clientId: row.clientId ?? row.client?.id ?? "",
      projectId: row.projectId ?? row.project?.id ?? "",
      subscriptionId: row.subscriptionId ?? row.subscription?.id ?? "",
      category: row.category ?? "OTHER",
      amount: row.amount ?? "",
      currency: row.currency ?? "USD",
      frequency: row.frequency ?? "MONTHLY",
      date: toDateInput(row.date),
      status: row.status ?? "ACTIVE",
      notes: row.notes ?? "",
    }),
    toPayload: (form) =>
      prune({
        ...form,
        amount: parseNumber(form.amount),
      }),
    onFieldChange: syncSubscriptionRelations,
    create: createCost,
    update: updateCost,
    archive: archiveCost,
  };

  return [providers, subscriptions, domains, renewals, costs];
}

const operationConfigs = buildConfigs();

function CrmOperations() {
  const { authenticatedRequest, user } = useAuth();
  const [activeKey, setActiveKey] = useState(operationConfigs[0].key);
  const [data, setData] = useState({
    providers: [],
    subscriptions: [],
    domains: [],
    renewals: [],
    costs: [],
    clients: [],
    projects: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const canWrite = user?.role !== "READONLY";

  const loadOperations = useCallback(async () => {
    setIsLoading(true);
    setErrors({});

    const requests = {
      providers: listProviders(authenticatedRequest),
      subscriptions: listSubscriptions(authenticatedRequest),
      domains: listDomains(authenticatedRequest),
      renewals: listRenewals(authenticatedRequest),
      costs: listCosts(authenticatedRequest),
      clients: listClients(authenticatedRequest),
      projects: listProjects(authenticatedRequest),
    };
    const entries = Object.entries(requests);
    const results = await Promise.allSettled(entries.map(([, request]) => request));
    const nextData = {};
    const nextErrors = {};

    results.forEach((result, index) => {
      const key = entries[index][0];
      if (result.status === "fulfilled") {
        nextData[key] = result.value;
      } else {
        nextData[key] = [];
        nextErrors[key] = actionErrorMessage(result.reason);
      }
    });

    setData(nextData);
    setErrors(nextErrors);
    setIsLoading(false);
  }, [authenticatedRequest]);

  useEffect(() => {
    const timer = window.setTimeout(loadOperations, 0);
    return () => window.clearTimeout(timer);
  }, [loadOperations]);

  const activeConfig = operationConfigs.find((config) => config.key === activeKey);
  const context = useMemo(
    () => ({
      providers: data.providers ?? [],
      subscriptions: data.subscriptions ?? [],
      domains: data.domains ?? [],
      renewals: data.renewals ?? [],
      costs: data.costs ?? [],
      clients: data.clients ?? [],
      projects: data.projects ?? [],
    }),
    [data],
  );

  return (
    <>
      <CrmSectionHeader
        eyebrow="Infraestructura y costos"
        title="Operaciones"
        description="Gestion real de proveedores, suscripciones, dominios, renovaciones y costos del ecosistema NexoDigital."
        actionDisabled={isLoading}
        actionLabel={isLoading ? "Actualizando" : "Actualizar"}
        onAction={loadOperations}
      />

      <nav className="crm-operations-tabs" aria-label="Modulos de operaciones">
        {operationConfigs.map((config) => (
          <button
            className={`crm-operations-tab ${
              activeKey === config.key ? "crm-operations-tab--active" : ""
            }`}
            key={config.key}
            onClick={() => setActiveKey(config.key)}
            type="button"
          >
            <span>{config.title}</span>
            <small>{(data[config.key] ?? []).length}</small>
          </button>
        ))}
      </nav>

      {activeConfig ? (
        <CrmOperationsModule
          authenticatedRequest={authenticatedRequest}
          canWrite={canWrite}
          config={activeConfig}
          context={context}
          error={errors[activeConfig.key]}
          isLoading={isLoading}
          onReload={loadOperations}
          rows={data[activeConfig.key] ?? []}
        />
      ) : null}
    </>
  );
}

export default CrmOperations;
