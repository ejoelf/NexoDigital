# NexoDigital - Deploy Guide V1

Infraestructura principal V1:

- Frontend: Hostinger.
- Backend: Railway.
- Base de datos: Neon PostgreSQL existente.

Render y Vercel quedan solo como alternativas futuras. No son la guía principal de esta V1.

---

## 1. Arquitectura de deploy

```txt
Usuario
  -> Hostinger
     -> React/Vite build
     -> / web pública
     -> /crm/* panel privado

CRM frontend
  -> VITE_API_BASE_URL
     -> Railway backend
        -> DATABASE_URL
           -> Neon PostgreSQL
```

La web pública y el CRM privado viven en el mismo build frontend. El backend corre separado en Railway.

## 2. Frontend en Hostinger

### Build local

Desde la raíz del repo:

```bash
npm install
npm run build
```

El resultado queda en:

```txt
dist/
```

Subir el contenido de `dist/` a Hostinger.

### Variable frontend

Configurar antes de compilar:

```txt
VITE_API_BASE_URL=https://<URL_PUBLICA_DEL_BACKEND_EN_RAILWAY>
```

Ejemplo:

```txt
VITE_API_BASE_URL=https://nexodigital-crm-api.up.railway.app
```

No hardcodear la URL del backend en componentes.

### Rutas SPA

Hostinger debe servir `index.html` para rutas directas como:

- `/crm/login`
- `/crm/dashboard`
- `/crm/clients`
- `/crm/projects`
- `/crm/works`
- `/crm/operations`
- `/crm/alerts`
- `/crm/audit-logs`

El archivo `public/.htaccess` queda preparado para copiarse al build y aplicar fallback SPA:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule ^ index.html [L]
</IfModule>
```

Si Hostinger no lo copia automáticamente, subir `.htaccess` junto a `index.html` dentro del directorio público del hosting.

## 3. Backend en Railway

### Servicio

Crear un servicio Railway apuntando a la carpeta:

```txt
backend/
```

Si Railway detecta el repo desde la raíz, configurar el root directory del servicio como `backend`.

### Build command

Usar:

```bash
npm install && npm run prisma:generate && npm run build
```

### Start command

Usar:

```bash
npm run start
```

El backend escucha `PORT`, que Railway inyecta automáticamente. Dejar `PORT` configurado o disponible como variable.

### Healthcheck

Configurar healthcheck con:

```txt
/health
```

También existe:

```txt
/api/health
```

## 4. Variables backend en Railway

Configurar en Railway:

```txt
DATABASE_URL=<URL_DE_NEON>
PORT=<PORT_DE_RAILWAY_O_AUTOINYECTADO>
NODE_ENV=production
CORS_ORIGIN=<DOMINIO_DE_HOSTINGER>
JWT_ACCESS_SECRET=<VALOR_LARGO_RANDOM>
JWT_REFRESH_SECRET=<VALOR_LARGO_RANDOM>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ADMIN_EMAIL=<EMAIL_ADMIN>
ADMIN_PASSWORD=<PASSWORD_ADMIN_INICIAL>
ADMIN_NAME=<NOMBRE_ADMIN>
ADMIN_ROLE=ADMIN
```

`CORS_ORIGIN` debe ser el origen exacto de Hostinger. Ejemplos:

```txt
CORS_ORIGIN=https://nexo-digital.tech
CORS_ORIGIN=https://nexo-digital.tech,https://www.nexo-digital.tech
```

Si se usa dominio temporal o subdominio, incluirlo explícitamente:

```txt
CORS_ORIGIN=https://preview.nexo-digital.tech,https://nexo-digital.tech
```

No usar `*` en producción.

## 5. Base de datos Neon

Neon ya está creado. No crear otra base de datos para esta V1.

En Railway:

```txt
DATABASE_URL=<connection string de Neon>
```

Debe incluir SSL si Neon lo requiere, por ejemplo:

```txt
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

## 6. Migraciones Prisma en producción

Después de configurar `DATABASE_URL` en Railway, ejecutar una tarea/one-off command:

```bash
npm run prisma:deploy
```

Este comando usa:

```bash
prisma migrate deploy
```

No usar `prisma migrate dev` en producción.

## 7. Seed admin inicial

Con las variables `ADMIN_*` configuradas:

```bash
npm run seed:admin
```

Recomendación:

1. Ejecutar seed una vez.
2. Iniciar sesión en `/crm/login`.
3. Cambiar la contraseña inicial cuando exista pantalla de usuarios.
4. Rotar `ADMIN_PASSWORD` si se sospecha exposición.

## 8. Smoke test post-deploy

Backend:

```txt
GET https://<railway-url>/health
POST https://<railway-url>/api/auth/login
GET https://<railway-url>/api/auth/me
GET https://<railway-url>/api/dashboard/overview
GET https://<railway-url>/api/alerts/summary
GET https://<railway-url>/api/audit-logs
```

Frontend:

```txt
https://<hostinger-domain>/
https://<hostinger-domain>/crm/login
https://<hostinger-domain>/crm/dashboard
https://<hostinger-domain>/crm/clients
https://<hostinger-domain>/crm/projects
https://<hostinger-domain>/crm/works
https://<hostinger-domain>/crm/operations
https://<hostinger-domain>/crm/alerts
https://<hostinger-domain>/crm/audit-logs
```

## 9. Pendientes de deploy

- Definir dominio final de Hostinger.
- Definir URL pública final de Railway.
- Configurar `VITE_API_BASE_URL` antes del build.
- Configurar `CORS_ORIGIN` con dominio real.
- Ejecutar migraciones en Neon desde Railway.
- Ejecutar seed admin inicial.
- Validar login real.
- Validar que Hostinger sirve rutas `/crm/*` por fallback SPA.
