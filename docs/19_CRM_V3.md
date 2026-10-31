# CRM v3 (31 de octubre de 2026)

## Qué se agregó

- **Inicio:** agenda única con todo lo que vence en 30 días (tareas, cobros, renovaciones, dominios, suscripciones y seguimientos de prospectos), separada en vencido, esta semana y hasta 30 días. Números principales y accesos directos a Render, Vercel, Neon, GitHub, Hostinger, Google, Instagram y WhatsApp Business. Endpoint: `GET /api/dashboard/home?days=30`.
- **Tareas** (`/api/tasks`): título, detalle, prioridad, fecha, estado, cliente y web. Botón rápido "Hecha".
- **Cobros** (`/api/charges`): lo que se les cobra a los clientes (proyecto, mantenimiento, dominio, hosting, consultoría), con monto, moneda (ARS por defecto), frecuencia, vencimiento y estado. Botón rápido "Cobrado".
- **Prospectos:** tablero por etapa (nuevo, contactado, propuesta enviada, negociando, perdido) con fecha de próximo seguimiento y botón "Pasar a cliente".
- **Clientes:** WhatsApp, web, Instagram, origen, último contacto y próximo seguimiento. Ficha con webs, dominios, tareas y cobros.
- **Webs y proyectos:** fichas con URL pública, panel del cliente, repos, dónde está cada parte (frontend, backend, base) con enlace al panel, vencimiento del dominio y avisos de alojamiento.
- **Proveedores:** enlace al panel y plan.
- Textos en español, logo ND.

## Migración

`backend/prisma/migrations/20261031150000_tasks_charges_pipeline`: solo agrega tipos, columnas opcionales y las tablas `Task` y `Charge`. Se aplica sola al iniciar el backend (`prisma migrate deploy` en el `start`).

## Datos

Se cargaron los clientes, webs, proveedores, dominios y tareas reales relevados de Render, Vercel, Neon, Hostinger y GitHub. Los registros de prueba quedaron inactivos o cerrados (no se borró nada).

## Pendiente (segunda etapa)

- Avisos por email antes de cada vencimiento.
- Sincronización automática con las APIs de Render, Vercel y Neon.
