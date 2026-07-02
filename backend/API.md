# NexoDigital CRM API V1

Base URL local:

```txt
http://localhost:4000
```

Header para endpoints privados:

```txt
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

## Acceso

- Publico: `GET /health`, `GET /api/health`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/public/works`.
- Privado con token: todos los endpoints internos del CRM.
- Mutaciones operativas: `ADMIN` o `MEMBER`.
- Auditoria: solo `ADMIN`.

## Auth

```txt
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me
```

Flujo:

1. Enviar email/password a login.
2. Guardar `accessToken` para requests privados.
3. Usar `refreshToken` para renovar sesion cuando el access token expire.
4. En `401`, intentar refresh una vez; si falla, cerrar sesion.
5. En `403`, mostrar acceso denegado por rol.

No guardar tokens en logs ni enviarlos a auditoria.

## Modulos CRUD

Clientes:

```txt
GET /api/clients
GET /api/clients/:id
POST /api/clients
PUT /api/clients/:id
DELETE /api/clients/:id
```

Proyectos:

```txt
GET /api/projects
GET /api/projects/:id
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

Trabajos realizados:

```txt
GET /api/works
GET /api/works/:id
POST /api/works
PUT /api/works/:id
DELETE /api/works/:id
GET /api/public/works
```

Proveedores:

```txt
GET /api/providers
GET /api/providers/:id
POST /api/providers
PUT /api/providers/:id
DELETE /api/providers/:id
```

Suscripciones:

```txt
GET /api/subscriptions
GET /api/subscriptions/:id
POST /api/subscriptions
PUT /api/subscriptions/:id
DELETE /api/subscriptions/:id
```

Dominios:

```txt
GET /api/domains
GET /api/domains/:id
POST /api/domains
PUT /api/domains/:id
DELETE /api/domains/:id
```

Renovaciones:

```txt
GET /api/renewals
GET /api/renewals/:id
POST /api/renewals
PUT /api/renewals/:id
DELETE /api/renewals/:id
```

Costos:

```txt
GET /api/costs
GET /api/costs/:id
POST /api/costs
PUT /api/costs/:id
DELETE /api/costs/:id
```

Los `DELETE` operativos son archivados/cancelaciones logicas, no borrado fisico.

## Alertas

```txt
GET /api/alerts/summary?days=30
GET /api/alerts/upcoming-renewals?days=30
GET /api/alerts/expired-renewals
GET /api/alerts/expiring-domains?days=30
GET /api/alerts/active-subscriptions
GET /api/alerts/recurring-costs
```

`days` es opcional, default `30`, rango `1..365`.

## Dashboard

```txt
GET /api/dashboard/overview?days=30
GET /api/dashboard/operations?days=30
GET /api/dashboard/financials?days=30
GET /api/dashboard/recent-activity
```

Endpoints principales para el primer panel:

- `GET /api/dashboard/overview`
- `GET /api/alerts/summary`
- `GET /api/clients`
- `GET /api/projects`
- `GET /api/works`

## Auditoria

```txt
GET /api/audit-logs
GET /api/audit-logs/:id
```

Filtros:

```txt
action
entityType
userId
from
to
limit
```

Solo `ADMIN`.

## Errores esperados

```txt
400 Bad Request: payload invalido.
401 Unauthorized: falta token o token vencido.
403 Forbidden: rol insuficiente.
404 Not Found: recurso inexistente.
409 Conflict: duplicado o conflicto de unicidad.
429 Too Many Requests: rate limit.
500 Internal Server Error: error no esperado.
```
