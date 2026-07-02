# Preparacion para Panel Frontend CRM

Este backend queda listo para que el futuro panel privado consuma la API V1.

## Base URL

Desarrollo local:

```txt
http://localhost:4000
```

Produccion:

```txt
https://api.nexodigital.com
```

La URL real de produccion debe definirse al momento del deploy.

## CORS

En desarrollo se permiten origenes localhost.

En produccion configurar `CORS_ORIGIN` con el dominio exacto del panel privado:

```txt
CORS_ORIGIN=https://admin.nexodigital.com
```

Si hay mas de un origen permitido, separarlos por coma.

## Auth Flow

1. Login:

```txt
POST /api/auth/login
```

2. Guardar respuesta:

```txt
accessToken
refreshToken
user
```

3. Enviar requests privados:

```txt
Authorization: Bearer ACCESS_TOKEN
```

4. Cuando un request devuelva `401`:

- intentar `POST /api/auth/refresh`;
- reemplazar access/refresh tokens;
- reintentar una vez el request original;
- si refresh falla, cerrar sesion.

5. Cuando un request devuelva `403`:

- no reintentar;
- mostrar acceso restringido por rol.

6. Logout:

```txt
POST /api/auth/logout
```

## Roles V1

Roles actuales:

- `ADMIN`
- `MEMBER`
- `COLLABORATOR`
- `READONLY`

Reglas:

- `ADMIN`: acceso completo, incluida auditoria.
- `MEMBER`: puede operar CRUDs principales.
- `COLLABORATOR` y `READONLY`: lectura interna donde aplique.

Decision futura:

- `FOUNDER` puede agregarse mas adelante si se necesita separar el fundador del admin tecnico.
- No se implemento todavia para evitar migraciones de rol y cambios de permisos antes del panel.

## Pantallas iniciales sugeridas

Dashboard:

```txt
GET /api/dashboard/overview
GET /api/dashboard/operations
GET /api/dashboard/financials
GET /api/dashboard/recent-activity
```

Alertas:

```txt
GET /api/alerts/summary
GET /api/alerts/upcoming-renewals
GET /api/alerts/expired-renewals
GET /api/alerts/expiring-domains
```

CRUD inicial:

```txt
GET /api/clients
GET /api/projects
GET /api/works
GET /api/providers
GET /api/subscriptions
GET /api/domains
GET /api/renewals
GET /api/costs
```

Auditoria para ADMIN:

```txt
GET /api/audit-logs
```

## Consideraciones de UI

- No mostrar notas internas largas en tarjetas; reservarlas para vistas de detalle.
- Mostrar estados como chips.
- Mostrar errores `400` como validaciones de formulario.
- Mostrar `401` como sesion expirada.
- Mostrar `403` como permisos insuficientes.
- No guardar tokens en logs, analytics ni audit trails frontend.
