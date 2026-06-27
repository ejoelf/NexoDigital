# NexoDigital CRM Backend

Backend inicial del futuro CRM interno de NexoDigital.

Stack V1:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL

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
  "password": "password-local"
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

## Variables de entorno

Copiar `.env.example` a `.env` cuando se configure el entorno real.

No subir `.env` al repositorio.

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

Esta fase implementa autenticación base. No implementa CRUDs completos, IA, emails, pagos ni storage real.
