# Backend V1 Test Checklist

Ejecutar antes de avanzar al panel frontend.

## Configuracion

- [ ] `backend/.env` existe localmente y no esta versionado.
- [ ] `DATABASE_URL` apunta a PostgreSQL real de desarrollo.
- [ ] `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` no usan valores de ejemplo.
- [ ] `CORS_ORIGIN` incluye el origen del panel frontend.
- [ ] `npm run prisma:generate` pasa.
- [ ] `npm run build` pasa dentro de `backend`.

## Auth

- [ ] `POST /api/auth/login` con credenciales validas devuelve user, access token y refresh token.
- [ ] `POST /api/auth/login` con credenciales invalidas devuelve `401`.
- [ ] `GET /api/auth/me` con access token valido devuelve usuario.
- [ ] `POST /api/auth/refresh` rota refresh token.
- [ ] `POST /api/auth/logout` revoca refresh token.
- [ ] Login fallido queda auditado sin password.
- [ ] Login rate limit devuelve `429` luego del limite.

## CRUDs principales

- [ ] Clientes: crear, listar, ver, editar, archivar.
- [ ] Proyectos: crear, listar, ver, editar, archivar.
- [ ] Works: crear, listar admin, ver, editar, archivar.
- [ ] Public works: solo muestra `isPublic = true` y no expone notas internas.

## Operaciones

- [ ] Providers: crear, listar, ver, editar, archivar.
- [ ] Subscriptions: crear, listar, ver, editar, cancelar.
- [ ] Domains: crear, listar, ver, editar, aparcar.
- [ ] Renewals: crear, listar, ver, editar, cancelar.
- [ ] Costs: crear, listar, ver, editar, archivar.

## Alertas

- [ ] `GET /api/alerts/summary`
- [ ] `GET /api/alerts/upcoming-renewals`
- [ ] `GET /api/alerts/expired-renewals`
- [ ] `GET /api/alerts/expiring-domains`
- [ ] `GET /api/alerts/active-subscriptions`
- [ ] `GET /api/alerts/recurring-costs`
- [ ] `days` valida rango `1..365`.

## Dashboard

- [ ] `GET /api/dashboard/overview`
- [ ] `GET /api/dashboard/operations`
- [ ] `GET /api/dashboard/financials`
- [ ] `GET /api/dashboard/recent-activity`
- [ ] Respuestas no exponen secretos ni notas internas extensas.

## Auditoria

- [ ] Mutaciones operativas crean `AuditLog`.
- [ ] `GET /api/audit-logs` funciona con `ADMIN`.
- [ ] `GET /api/audit-logs/:id` funciona con `ADMIN`.
- [ ] Token con rol no autorizado recibe `403`.
- [ ] Metadata no incluye password, token, secret, cookie ni authorization.

## Validacion raiz

- [ ] Desde raiz: `npm run lint`.
- [ ] Desde raiz: `npm run build`.
- [ ] Desde raiz: `git diff --check`.
