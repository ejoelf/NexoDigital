# CRM NexoDigital - Decisiones técnicas V1

Versión: 1.0  
Estado: decisiones recomendadas antes de programar backend  
Alcance: V1 simple, escalable y realista

---

## 1. Criterio general

La V1 del CRM interno debe permitir avanzar rápido sin encerrar a NexoDigital en una arquitectura débil.

La prioridad es construir una base operativa para:

- clientes;
- proyectos;
- trabajos realizados;
- proveedores;
- suscripciones;
- dominios;
- renovaciones;
- costos;
- documentación.

No conviene mezclar demasiadas tecnologías al inicio. La web pública debe seguir estable y el CRM debe crecer por módulos.

---

## 2. Backend recomendado para V1

Decisión recomendada:

- **Node.js + Express**.

Motivo:

- es suficiente para una V1 modular;
- evita la complejidad inicial de frameworks más grandes;
- permite avanzar rápido;
- se integra bien con Prisma, PostgreSQL y JWT;
- permite organizar rutas por módulos sin sobrediseñar.

Estructura futura sugerida:

```txt
backend/
  src/
    modules/
      auth/
      users/
      clients/
      projects/
      works/
      providers/
      subscriptions/
      domains/
      renewals/
      costs/
      documents/
    common/
    config/
    server.ts
```

Nota:

- no crear todavía esta carpeta hasta aprobar el inicio del backend.

---

## 3. Base de datos recomendada

Decisión recomendada:

- **PostgreSQL en Neon**.

Motivo:

- PostgreSQL es sólido para relaciones entre clientes, proyectos, trabajos, costos y renovaciones;
- Neon encaja bien con proyectos Node/Prisma;
- permite empezar con bajo costo y crecer;
- mantiene separación clara entre base de datos y hosting del backend.

Postergado:

- usar Supabase como base principal.

Supabase queda como alternativa si más adelante conviene usar Auth, Storage o Realtime.

---

## 4. ORM recomendado

Decisión recomendada:

- **Prisma**.

Motivo:

- modelado claro;
- migraciones ordenadas;
- buena experiencia con PostgreSQL;
- tipado útil si el backend se hace con TypeScript;
- facilita mantener relaciones complejas sin SQL manual excesivo.

Regla:

- el modelo Prisma debe nacer desde `docs/08_CRM_MODELO_DATOS.md`, no desde improvisación.

---

## 5. Panel interno recomendado

Decisión recomendada para V1:

- **React + Vite en una app interna separada**.

Motivo:

- mantiene coherencia con la web pública actual;
- evita migrar todo a Next.js por necesidad prematura;
- permite construir un panel tipo SaaS simple;
- separa claramente web pública y CRM interno;
- reduce riesgo de romper la landing comercial.

Opciones:

1. Panel en carpeta separada futura, por ejemplo `crm/` o `admin/`.
2. Panel en repositorio separado si se decide separar despliegues.

Decisión recomendada inicial:

- carpeta separada dentro del mismo repo solo cuando se apruebe construir el panel.

Postergado:

- migrar la web pública a Next.js;
- unificar web pública y CRM en una sola app grande.

---

## 6. Autenticación recomendada

Decisión recomendada para V1:

- **Auth propia con JWT + refresh tokens**.

Motivo:

- el CRM será interno;
- la cantidad inicial de usuarios será baja;
- permite controlar roles simples;
- evita depender desde el inicio de un proveedor de Auth externo;
- encaja con Express y Prisma.

Roles iniciales:

- ADMIN.
- MEMBER.
- COLLABORATOR.
- READONLY.

Requisitos mínimos:

- password hasheada;
- access token con expiración corta;
- refresh token con expiración mayor;
- rutas protegidas;
- middleware de roles;
- endpoint `/me`.

Postergado:

- OAuth;
- login social;
- multiempresa;
- permisos ultra granulares;
- SSO.

Alternativa futura:

- Supabase Auth si el proyecto crece y conviene delegar autenticación.

---

## 7. Storage recomendado para imágenes y documentos

Decisión recomendada para V1:

- **Guardar URLs externas en la base de datos y postergar storage propio**.

Motivo:

- evita sumar otro proveedor al inicio;
- permite cargar imágenes/documentos desde URLs controladas;
- simplifica el backend V1;
- no bloquea el modelo de datos.

Para trabajos realizados:

- `mainImageUrl`;
- `galleryUrls`;
- `publicUrl`.

Para documentación:

- `url`;
- `storageProvider`;
- `visibility`.

Decisión futura recomendada:

- evaluar Supabase Storage o Cloudinary cuando exista necesidad real de subir archivos desde el CRM.

Qué NO hacer en V1:

- subir archivos al servidor backend;
- guardar imágenes en la base de datos;
- construir gestor documental avanzado;
- implementar CDN propio.

---

## 8. Estrategia para conectar trabajos realizados con la web pública

Decisión recomendada para V1:

- **mantener la web pública estable con `src/data/works.js` mientras se construye el CRM**.

Luego, cuando el módulo `Work` y la API estén estables:

1. crear endpoint público solo para trabajos visibles;
2. exponer únicamente campos seguros;
3. consumir esos trabajos desde la web pública;
4. mantener fallback estático si la API falla.

Endpoint futuro sugerido:

```txt
GET /public/works
```

Debe devolver solo:

- title;
- client;
- category;
- industry;
- description pública;
- status público;
- image;
- url;
- technologies;
- featured;
- displayOrder.

No debe devolver:

- notas internas;
- aprendizajes internos;
- costos;
- repositorios privados;
- datos sensibles del cliente;
- información de proveedores internos.

Regla:

- `isPublic = true` es obligatorio para aparecer en la web.

---

## 9. Estrategia de email

Decisión recomendada para V1:

- **no implementar emails automáticos en el primer backend base**.

Orden recomendado:

1. construir datos de clientes, proyectos y renovaciones;
2. validar que las fechas sean confiables;
3. implementar alertas visibles en dashboard;
4. después implementar email transaccional.

Proveedor recomendado para email transaccional futuro:

- **Resend**.

Uso futuro:

- alertas de vencimiento;
- avisos internos;
- confirmaciones administrativas.

Proveedor recomendado para marketing:

- **Brevo**.

Uso:

- campañas;
- newsletters;
- comunicaciones comerciales.

Regla:

- Resend y Brevo no deben mezclarse sin criterio. Resend para transaccional; Brevo para marketing.

---

## 10. Estrategia de deploy

Decisión recomendada para V1:

- web pública estable en su deploy actual;
- backend CRM en Render;
- base PostgreSQL en Neon;
- panel interno en Vercel o Render Static Site según stack final.

Propuesta:

```txt
Web pública:
  Vercel o Hostinger, según estrategia final del formulario.

Backend CRM:
  Render Web Service.

Base de datos:
  Neon PostgreSQL.

Panel CRM:
  Vercel si es React/Vite estático.
```

Reglas:

- no mover la web pública solo por crear el CRM;
- no conectar frontend público a backend hasta tener API estable;
- separar variables de entorno por servicio;
- documentar `.env.example` cuando se programe backend.

---

## 11. Qué NO se hará en V1

Para evitar sobrediseño, la V1 no debe incluir:

- IA interna;
- generación automática de textos;
- alertas por email desde el día uno;
- auditoría profunda de seguridad;
- sistema contable completo;
- multiempresa;
- facturación fiscal;
- pasarela de pagos integrada;
- chat interno;
- subida avanzada de archivos;
- storage propio;
- permisos excesivamente granulares;
- dashboards financieros complejos;
- conexión inmediata de la web pública al CRM;
- migración de la web pública a otro stack.

---

## 12. Decisiones postergadas

Quedan para más adelante:

- Supabase Auth vs Auth propia si el equipo crece.
- Supabase Storage vs Cloudinary para archivos.
- Next.js para panel si aparecen necesidades server-side reales.
- OpenAI para asistente interno.
- Resend para alertas por email.
- Brevo para campañas.
- Stripe/Mercado Pago si el CRM necesita gestionar cobros.
- Logs avanzados de auditoría.
- Módulo NexoDigital Security.

---

## 13. Riesgos si se cambia el stack más adelante

### Cambiar Express por otro framework

Riesgo:

- reescribir rutas, middlewares, validaciones y estructura modular.

Mitigación:

- mantener lógica por módulos y servicios desde el inicio.

### Cambiar Neon por Supabase

Riesgo:

- migración de base, variables de entorno y configuración de conexión.

Mitigación:

- usar PostgreSQL estándar y Prisma sin depender de funciones propietarias al inicio.

### Cambiar Auth propia por Supabase Auth

Riesgo:

- migrar usuarios, sesiones, roles y middleware.

Mitigación:

- diseñar roles simples y no acoplar toda la app a detalles internos del JWT.

### Cambiar React + Vite por Next.js

Riesgo:

- reestructurar rutas, layouts, build y deploy.

Mitigación:

- separar el panel de la web pública y construir componentes portables.

### Cambiar storage externo

Riesgo:

- URLs rotas o migración de archivos.

Mitigación:

- guardar `storageProvider` y URLs explícitas en documentos e imágenes.

---

## 14. Decisión final recomendada V1

Stack V1 recomendado:

```txt
Backend:
  Node.js + Express + TypeScript

Base de datos:
  Neon PostgreSQL

ORM:
  Prisma

Auth:
  JWT + refresh tokens

Panel:
  React + Vite separado de la web pública

Storage:
  URLs externas al inicio; Supabase Storage o Cloudinary más adelante

Email:
  sin email automático en backend base; Resend para alertas futuras

Deploy:
  Render para backend, Neon para DB, Vercel/Hostinger para web pública
```

---

## 15. Próximos pasos antes de programar backend

1. Confirmar estas decisiones V1.
2. Definir si el backend usará JavaScript o TypeScript.
3. Elegir nombre de carpeta futura: `backend` recomendado.
4. Crear lista de variables de entorno.
5. Definir entidades V1 exactas para el primer schema Prisma.
6. Definir endpoints iniciales.
7. Preparar `.env.example`.
8. Recién después crear backend base.
