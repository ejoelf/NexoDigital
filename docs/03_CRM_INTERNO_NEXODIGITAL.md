# CRM Interno NexoDigital

Versión: 1.0

---

## Objetivo

El CRM interno será el centro de control operativo de NexoDigital. Su función será ordenar clientes, proyectos, trabajos realizados, proveedores, suscripciones, vencimientos, documentación y tareas internas.

No debe construirse completo en la primera etapa. Primero se documenta, luego se desarrolla por módulos.

---

## Módulos principales

### Dashboard

Debe mostrar clientes activos, proyectos activos, trabajos publicados, próximos vencimientos, alertas y tareas pendientes.

### Clientes

Ficha con datos comerciales, contacto, rubro, ciudad, país, proyectos asociados, servicios contratados, estado y notas internas.

### Proyectos

Registro de cada web, CRM, SaaS, ecommerce, landing o sistema interno. Debe incluir estado, cliente, dominio, repositorios, tecnologías, proveedores y documentación relacionada.

### Trabajos realizados

Módulo solicitado para cargar todas las páginas, sistemas y software creados por NexoDigital.

Campos sugeridos:

- título;
- cliente;
- rubro;
- categoría;
- descripción corta;
- descripción larga;
- imagen principal;
- URL pública;
- repositorio;
- tecnologías;
- estado;
- fecha de publicación;
- visible en web pública;
- destacado;
- orden de aparición;
- notas internas.

Este módulo debe poder alimentar en el futuro la sección pública de trabajos realizados.

### Proveedores oficiales

Registro de proveedores predeterminados por categoría:

- frontend;
- backend;
- base de datos;
- IA;
- email;
- dominios;
- hosting;
- storage;
- pagos;
- monitoreo.

Regla: si se usa un proveedor nuevo, debe quedar registrado en el CRM.

### Suscripciones y renovaciones

Debe controlar servicios contratados por NexoDigital o por sus clientes: dominios, hosting, backend, DB, APIs, email, IA y herramientas externas.

Debe registrar proveedor, proyecto, cliente, tipo de servicio, plan, costo, moneda, frecuencia, fecha de inicio, fecha de renovación, responsable, estado y comprobante.

Alertas recomendadas: 30, 15, 7 y 1 día antes del vencimiento.

### Documentación

Debe vincular documentos maestros, fichas técnicas, presupuestos, contratos, manuales, decisiones técnicas y prompts para Codex.

### Equipo interno

Preparado para usuarios internos, roles, permisos, tareas y proyectos asignados.

---

## Prioridad de construcción

### CRM V1

- Auth.
- Dashboard básico.
- Clientes.
- Proyectos.
- Trabajos realizados.
- Proveedores.
- Suscripciones.

### CRM V2

- Renovaciones.
- Alertas.
- Costos.
- Documentación.
- Roles avanzados.

### CRM V3

- IA interna.
- Automatizaciones.
- Métricas.
- Seguridad.
- Reportes.

---

## Regla final

El CRM debe crecer por módulos. La prioridad inicial es ordenar lo que NexoDigital necesita hoy: trabajos realizados, clientes, proyectos, proveedores y suscripciones.
