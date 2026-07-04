# NexoDigital - Release V1 Checklist

Estado: checklist final previo a deploy  
Infraestructura V1: Hostinger + Railway + Neon PostgreSQL

---

## 1. Estructura general

- [x] La web pública vive en `/`.
- [x] El CRM privado vive bajo `/crm/*`.
- [x] La web pública y el CRM comparten el mismo build React/Vite.
- [x] El backend vive separado en `backend/`.
- [x] La base de datos usa PostgreSQL vía Neon.
- [x] El backend expone healthcheck en `/health` y `/api/health`.

## 2. Brand Kit

- [x] Navbar público usa logo oficial horizontal.
- [x] Footer público usa identidad oficial.
- [x] CRM usa logo oficial en login/sidebar.
- [x] Favicon público coincide con el Brand Kit.
- [x] Tokens visuales base están en `src/styles/base.css`.
- [x] `logoND.jpg` fue removido por no estar en uso.

## 3. Web pública

- [x] Navbar.
- [x] Hero.
- [x] About.
- [x] Services.
- [x] Ecosystem.
- [x] Process.
- [x] TechStack.
- [x] Trabajos realizados desde data local.
- [x] Contact.
- [x] Footer.

Pendiente V1:

- Definir estrategia real del formulario de contacto: `contact.php` en Hostinger o API/email service futuro.
- No conectar todavía la web pública a `/api/public/works`.

## 4. CRM privado

- [x] Login real contra backend.
- [x] Sesión con access token y refresh token.
- [x] Rutas privadas protegidas.
- [x] Logout.
- [x] Dashboard real.
- [x] Clientes reales.
- [x] Proyectos reales.
- [x] Works reales.
- [x] Operaciones reales.
- [x] Alertas reales.
- [x] Auditoría real para ADMIN.
- [x] Settings queda como placeholder intencional.
- [x] READONLY no ve acciones sensibles.
- [x] Auditoría se oculta en navegación para no ADMIN.
- [x] Loading, empty y error states implementados.
- [x] Búsqueda/filtros básicos en módulos principales.

## 5. Backend

- [x] Express + TypeScript.
- [x] Prisma.
- [x] PostgreSQL provider.
- [x] Auth JWT + refresh tokens.
- [x] Roles básicos.
- [x] Rate limiting en memoria.
- [x] Audit logs.
- [x] CRUDs principales.
- [x] Dashboard.
- [x] Alertas calculadas.
- [x] Endpoint público `/api/public/works`.
- [x] `.env.example` actualizado para Railway + Neon.

## 6. Seguridad

- [x] No hay secretos reales en `.env.example`.
- [x] `backend/.env` real no debe versionarse.
- [x] No se imprimen tokens en frontend.
- [x] Audit metadata se sanitiza en backend.
- [x] Audit logs solo ADMIN.
- [x] READONLY no puede mutar recursos.
- [ ] Evaluar refresh token en cookie httpOnly antes de producción sensible.
- [ ] Evaluar rate limiting persistente si Railway escala a múltiples instancias.

## 7. Deploy V1

- [x] Frontend objetivo: Hostinger.
- [x] Backend objetivo: Railway.
- [x] Base de datos: Neon ya existente.
- [x] `public/.htaccess` preparado para fallback SPA.
- [x] `VITE_API_BASE_URL` documentado para Hostinger.
- [x] `CORS_ORIGIN` documentado para dominio real de Hostinger.
- [x] Script `prisma:deploy` disponible para migraciones productivas.

## 8. Validación mínima previa a deploy

Frontend desde raíz:

```bash
npm run lint
npm run build
git diff --check
```

Backend desde `backend/`:

```bash
npm run prisma:generate
npm run build
```

Producción Railway, después de configurar variables:

```bash
npm run prisma:deploy
npm run seed:admin
```

Smoke test:

- [ ] `GET /health`.
- [ ] `POST /api/auth/login`.
- [ ] `GET /api/auth/me`.
- [ ] `GET /api/dashboard/overview`.
- [ ] `GET /api/alerts/summary`.
- [ ] `GET /api/audit-logs` con ADMIN.

## 9. Decisión final V1

La V1 queda preparada para:

- publicar frontend en Hostinger;
- servir rutas SPA `/crm/*` con fallback a `index.html`;
- desplegar backend en Railway;
- conectar Railway a Neon PostgreSQL;
- mantener la web pública estable mientras el CRM opera de forma privada.
