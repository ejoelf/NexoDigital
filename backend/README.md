# NexoDigital CRM Backend

Backend inicial del futuro CRM interno de NexoDigital.

Stack V1:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

## Documentacion V1

- [API.md](./API.md): endpoints, roles y headers para consumir la API.
- [FRONTEND_HANDOFF.md](./FRONTEND_HANDOFF.md): guia para conectar el futuro panel privado.
- [V1_TEST_CHECKLIST.md](./V1_TEST_CHECKLIST.md): checklist de pruebas antes del frontend.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:migrate
npm run seed:admin
```

## Endpoint inicial

```txt
GET /health
GET /api/health
```

Ambos devuelven estado básico del servicio.

## Autenticación inicial

Endpoints disponibles:

```txt
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me
```

### Login

Body:

```json
{
  "email": "admin@example.com",
  "password": "<ADMIN_PASSWORD_LOCAL>"
}
```

Respuesta:

```json
{
  "ok": true,
  "user": {},
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Me

Enviar el access token:

```txt
Authorization: Bearer ACCESS_TOKEN
```

### Refresh

Body:

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

El refresh token se rota: el token anterior queda revocado y se emite uno nuevo.

### Logout

Body:

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

Revoca el refresh token si existe.

## Clientes

Todas las rutas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Endpoints:

```txt
GET /api/clients
GET /api/clients/:id
POST /api/clients
PUT /api/clients/:id
DELETE /api/clients/:id
```

Campos principales:

```json
{
  "businessName": "Cliente Demo",
  "contactName": "Nombre de contacto",
  "email": "cliente@example.com",
  "phone": "+549...",
  "country": "Argentina",
  "city": "Río Cuarto",
  "industry": "Servicios",
  "status": "ACTIVE",
  "notes": "Notas internas"
}
```

`DELETE /api/clients/:id` no borra físicamente: marca el cliente como `INACTIVE`.

## Proyectos

Todas las rutas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Endpoints:

```txt
GET /api/projects
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

Campos principales:

```json
{
  "name": "Proyecto Demo",
  "clientId": "client_id",
  "type": "WEBSITE",
  "status": "DEVELOPMENT",
  "description": "Descripción interna",
  "domain": "demo.com",
  "frontendRepositoryUrl": "https://github.com/...",
  "backendRepositoryUrl": "https://github.com/...",
  "frontendProviderId": "provider_id",
  "backendProviderId": "provider_id",
  "databaseProviderId": "provider_id",
  "startDate": "2026-07-02",
  "estimatedDeliveryDate": "2026-08-01",
  "notes": "Notas internas"
}
```

`DELETE /api/projects/:id` no borra físicamente: marca el proyecto como `CLOSED`.

## Trabajos realizados

Rutas administrativas. Todas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Endpoints:

```txt
GET /api/works
GET /api/works/:id
POST /api/works
PUT /api/works/:id
DELETE /api/works/:id
```

Campos principales:

```json
{
  "title": "Trabajo Demo",
  "slug": "trabajo-demo",
  "clientId": "client_id",
  "projectId": "project_id",
  "category": "Web institucional",
  "industry": "Servicios",
  "shortDescription": "Descripción corta pública",
  "longDescription": "Descripción extendida pública",
  "image": "https://...",
  "gallery": ["https://..."],
  "publicUrl": "https://...",
  "frontendRepo": "https://github.com/...",
  "backendRepo": "https://github.com/...",
  "technologies": ["React", "Vite"],
  "servicesIncluded": ["Diseño web", "Desarrollo"],
  "status": "PUBLISHED",
  "isPublic": true,
  "isFeatured": true,
  "displayOrder": 1,
  "publishedAt": "2026-07-02",
  "internalNotes": "Notas privadas"
}
```

`DELETE /api/works/:id` no borra físicamente: marca el trabajo como `CLOSED`, `isPublic: false` y `featured: false`.

## Trabajos públicos

Endpoint público futuro para alimentar la web:

```txt
GET /api/public/works
```

Reglas:

- devuelve solo trabajos con `isPublic = true`;
- no requiere autenticación;
- no expone `internalNotes`, `internalLearnings`, repositorios ni costos;
- ordena por destacados primero, luego `displayOrder` y fecha de publicación.

## Operaciones: proveedores, suscripciones, dominios, renovaciones y costos

Todas las rutas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Las rutas `POST`, `PUT` y `DELETE` requieren rol `ADMIN` o `MEMBER`.

### Providers

```txt
GET /api/providers
GET /api/providers/:id
POST /api/providers
PUT /api/providers/:id
DELETE /api/providers/:id
```

Campos principales: `name`, `category`, `website`, `accountEmail`, `status`, `notes`, `isOfficial`, `recommendedUse`, `internalOwner`.

`DELETE /api/providers/:id` no borra fisicamente: marca el proveedor como `DEPRECATED` y `isOfficial: false`.

### Subscriptions

```txt
GET /api/subscriptions
GET /api/subscriptions/:id
POST /api/subscriptions
PUT /api/subscriptions/:id
DELETE /api/subscriptions/:id
```

Campos principales: `providerId`, `clientId`, `projectId`, `name`, `serviceType`, `planName`, `amount`, `currency`, `billingCycle`, `startDate`, `renewalDate`, `paymentResponsible`, `status`, `notes`.

`billingCycle` se guarda internamente como `billingFrequency`. `DELETE /api/subscriptions/:id` marca la suscripcion como `CANCELLED`.

### Domains

```txt
GET /api/domains
GET /api/domains/:id
POST /api/domains
PUT /api/domains/:id
DELETE /api/domains/:id
```

Campos principales: `domainName`, `providerId`, `clientId`, `projectId`, `registrationDate`, `expirationDate`, `autoRenew`, `status`, `notes`.

`registrationDate` se guarda internamente como `purchaseDate`. `DELETE /api/domains/:id` marca el dominio como `PARKED` y desactiva `autoRenew`.

### Renewals

```txt
GET /api/renewals
GET /api/renewals/:id
POST /api/renewals
PUT /api/renewals/:id
DELETE /api/renewals/:id
```

Campos principales: `relatedType`, `relatedId`, `clientId`, `projectId`, `dueDate`, `amount`, `currency`, `status`, `reminderDays`, `notes`.

`relatedType` se guarda internamente como `entityType` y `relatedId` como `entityId`. Para `SUBSCRIPTION` y `DOMAIN`, el backend valida que el recurso exista. `DELETE /api/renewals/:id` marca la renovacion como `CANCELLED`.

### Costs

```txt
GET /api/costs
GET /api/costs/:id
POST /api/costs
PUT /api/costs/:id
DELETE /api/costs/:id
```

Campos principales: `clientId`, `projectId`, `providerId`, `subscriptionId`, `name`, `type`, `amount`, `currency`, `billingCycle`, `costDate`, `notes`.

`name` se guarda internamente como `concept`, `type` como `category`, `billingCycle` como `frequency` y `costDate` como `date`. `DELETE /api/costs/:id` no borra fisicamente: marca el costo como `ARCHIVED`.

No guardar contrasenas, secretos de proveedores, datos de tarjetas ni pagos reales en estos modulos.

## Alertas internas y resumen operativo

Las alertas de esta V1 son calculadas por endpoint. No se guardan en base de datos, no envian emails y no ejecutan cron jobs.

Todas las rutas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Endpoints:

```txt
GET /api/alerts/summary
GET /api/alerts/upcoming-renewals
GET /api/alerts/expired-renewals
GET /api/alerts/expiring-domains
GET /api/alerts/active-subscriptions
GET /api/alerts/recurring-costs
```

Los endpoints `summary`, `upcoming-renewals` y `expiring-domains` aceptan `days`:

```txt
GET /api/alerts/summary?days=30
```

Reglas de calculo:

- renovaciones proximas: vencen entre hoy y los proximos `days` dias, con estado distinto de `PAID` y `CANCELLED`;
- renovaciones vencidas: `dueDate` menor a hoy, con estado distinto de `PAID` y `CANCELLED`;
- dominios por vencer: `expirationDate` entre hoy y los proximos `days` dias, con estado `ACTIVE`;
- suscripciones activas: estados `ACTIVE` y `TRIAL`;
- costos recurrentes: costos `ACTIVE` con frecuencia `MONTHLY`, `YEARLY` o `USAGE_BASED`;
- costos estimados: se agrupan por moneda y se devuelven como estimado mensual/anual.

`days` debe ser un entero entre `1` y `365`. Si no se envia, se usa `30`.

## Dashboard operativo

El dashboard es calculado por endpoint. No persiste metricas, no crea auditoria y no ejecuta automatizaciones.

Todas las rutas requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Endpoints:

```txt
GET /api/dashboard/overview
GET /api/dashboard/operations
GET /api/dashboard/financials
GET /api/dashboard/recent-activity
```

Los endpoints `overview`, `operations` y `financials` aceptan `days` para ventanas de vencimientos:

```txt
GET /api/dashboard/overview?days=30
```

Resumen de datos:

- `overview`: clientes, proyectos, trabajos, proveedores oficiales, suscripciones, dominios, renovaciones, costos recurrentes y alertas.
- `operations`: proyectos/clientes/trabajos por estado, proximas renovaciones, dominios por vencer, suscripciones activas y ultimos proyectos/trabajos.
- `financials`: costos activos por moneda, costos recurrentes estimados, costos por proveedor/proyecto, suscripciones por moneda y proximas renovaciones con monto.
- `recent-activity`: ultimos clientes, proyectos, trabajos, suscripciones, dominios, renovaciones y costos segun fechas de creacion/actualizacion.

El dashboard no devuelve notas internas extensas, secretos, contrasenas, datos de tarjetas ni credenciales de proveedores.

## Seguridad, auditoria y rate limiting

### Auditoria

La auditoria se guarda en la tabla `AuditLog`. No se guardan passwords, tokens, secrets, cookies ni headers de autorizacion en metadata.

Endpoints:

```txt
GET /api/audit-logs
GET /api/audit-logs/:id
```

Requieren:

```txt
Authorization: Bearer ACCESS_TOKEN
```

Solo rol `ADMIN` puede consultar auditoria. El modelo actual no tiene rol `FOUNDER`.

Filtros soportados en `GET /api/audit-logs`:

```txt
action
entityType
userId
from
to
limit
```

Ejemplo:

```txt
GET /api/audit-logs?entityType=CLIENT&limit=50
```

Eventos auditados inicialmente:

- `AUTH_LOGIN_SUCCESS`
- `AUTH_LOGIN_FAILED`
- `AUTH_REFRESH_TOKEN`
- `AUTH_REFRESH_FAILED`
- `AUTH_LOGOUT`
- `CLIENT_CREATED`, `CLIENT_UPDATED`, `CLIENT_ARCHIVED`
- `PROJECT_CREATED`, `PROJECT_UPDATED`, `PROJECT_ARCHIVED`
- `WORK_CREATED`, `WORK_UPDATED`, `WORK_ARCHIVED`
- `PROVIDER_CREATED`, `PROVIDER_UPDATED`, `PROVIDER_ARCHIVED`
- `SUBSCRIPTION_CREATED`, `SUBSCRIPTION_UPDATED`, `SUBSCRIPTION_ARCHIVED`
- `DOMAIN_CREATED`, `DOMAIN_UPDATED`, `DOMAIN_ARCHIVED`
- `RENEWAL_CREATED`, `RENEWAL_UPDATED`, `RENEWAL_ARCHIVED`
- `COST_CREATED`, `COST_UPDATED`, `COST_ARCHIVED`

### Rate limiting

Rate limiting en memoria para V1:

- Login: 10 intentos cada 15 minutos por IP.
- API general: 600 requests por minuto por IP.

Estos limites son deliberadamente suaves para no bloquear desarrollo local. En produccion conviene moverlos a Redis/servicio externo si hay multiples instancias.

### Permisos

- Lecturas internas: requieren token valido.
- Crear/editar/archivar clientes, proyectos, trabajos y modulos operativos: `ADMIN` o `MEMBER`.
- Auditoria: solo `ADMIN`.
- El backend no expone passwords, tokens ni secretos en respuestas.

## Variables de entorno

Copiar `.env.example` a `.env` cuando se configure el entorno real.

No subir `.env` al repositorio.

Variables base esperadas:

```txt
DATABASE_URL
PORT
NODE_ENV
CORS_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_ROLE
```

En produccion, `CORS_ORIGIN` debe apuntar al dominio exacto del panel privado. No dejar origenes abiertos.

Variables requeridas para auth:

```txt
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
```

Variables para seed admin:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_ROLE
```

Crear admin inicial:

```bash
npm run seed:admin
```

El seed requiere una base de datos accesible en `DATABASE_URL`. No usar credenciales reales en `.env.example`.

## Validación con base real

Antes de avanzar a CRUDs, crear un archivo local `backend/.env` basado en `.env.example` y completar, como mínimo:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
ADMIN_ROLE
```

Luego ejecutar:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed:admin
npm run build
```

Con el backend levantado, validar:

```txt
GET /health
POST /api/auth/login
GET /api/auth/me
POST /api/auth/refresh
POST /api/auth/logout
```

No imprimir ni compartir valores reales de `.env`, tokens ni contraseñas.

## Estado actual

Backend CRM V1 listo para ser consumido por el futuro panel privado.

Incluye auth, clientes, proyectos, trabajos, proveedores, suscripciones, dominios, renovaciones, costos, alertas, dashboard, auditoria y rate limiting basico.

No incluye IA, emails, cron jobs, pagos reales, storage real ni panel frontend.
