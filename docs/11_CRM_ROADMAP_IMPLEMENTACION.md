# CRM NexoDigital - Roadmap de implementación

Versión: 1.0  
Estado: propuesta documental previa a implementación

---

## 1. Principio general

El CRM debe construirse por fases. No se debe programar todo junto ni mezclar backend, frontend, IA, alertas y seguridad en una misma etapa.

Cada fase debe terminar con:

- código funcionando si corresponde;
- build o tests ejecutados si corresponde;
- documentación actualizada;
- pendientes claros;
- sin romper la web pública.

---

## 2. Fase CRM 0 - Documentación y decisiones

Objetivo:

- cerrar el diseño técnico antes de programar.

Tareas:

- revisar documentos 07 a 11;
- confirmar stack backend;
- confirmar stack del panel interno;
- confirmar autenticación;
- confirmar proveedor de base de datos;
- confirmar estrategia de storage para imágenes y documentos;
- confirmar estrategia de email para alertas.

Entregable:

- documentación aprobada;
- decisiones técnicas mínimas para iniciar backend.

---

## 3. Fase CRM 1 - Backend base

Objetivo:

- crear la base backend sin módulos complejos.

Tareas:

- crear carpeta backend solo con aprobación;
- configurar Node.js + Express;
- configurar Prisma;
- configurar PostgreSQL;
- crear `.env.example`;
- crear healthcheck;
- definir estructura modular;
- preparar manejo de errores;
- preparar validaciones base.

Entregable:

- API base corriendo;
- conexión DB validada;
- estructura lista para módulos.

---

## 4. Fase CRM 2 - Autenticación y usuarios internos

Objetivo:

- proteger el CRM con acceso interno.

Tareas:

- modelo User;
- registro inicial controlado;
- login;
- JWT;
- refresh token;
- middleware de auth;
- roles básicos;
- endpoint de perfil.

Roles iniciales:

- ADMIN.
- MEMBER.
- COLLABORATOR.
- READONLY.

Entregable:

- usuarios internos autenticados;
- rutas protegidas.

---

## 5. Fase CRM 3 - Clientes y proyectos

Objetivo:

- administrar la base operativa principal.

Tareas:

- CRUD de clientes;
- CRUD de proyectos;
- relación cliente-proyecto;
- estados de proyecto;
- notas internas;
- filtros básicos;
- endpoints protegidos.

Entregable:

- NexoDigital puede registrar clientes y proyectos reales.

---

## 6. Fase CRM 4 - Trabajos realizados conectables a la web pública

Objetivo:

- crear el módulo que luego podrá alimentar la web pública.

Tareas:

- modelo Work;
- CRUD de trabajos;
- campos públicos y privados;
- `isPublic`;
- `featured`;
- `displayOrder`;
- tecnologías;
- URL pública;
- imagen principal;
- endpoint interno para administración;
- endpoint público futuro para trabajos visibles.

Reglas:

- no exponer notas internas;
- no mostrar trabajos no públicos;
- no mostrar botón si no hay URL real.

Entregable:

- módulo de trabajos listo para reemplazar o alimentar `src/data/works.js` en una etapa futura.

---

## 7. Fase CRM 5 - Proveedores, suscripciones y renovaciones

Objetivo:

- controlar servicios, costos recurrentes y vencimientos.

Tareas:

- CRUD de proveedores;
- marcar proveedores oficiales;
- CRUD de suscripciones;
- CRUD de dominios;
- CRUD de renovaciones;
- responsable de pago;
- frecuencia;
- costo;
- moneda;
- estado de pago;
- comprobante.

Entregable:

- NexoDigital puede saber qué se paga, cuándo vence y quién debe pagarlo.

---

## 8. Fase CRM 6 - Alertas

Objetivo:

- evitar vencimientos olvidados.

Tareas:

- generar alertas para renovaciones;
- alertas 30, 15, 7 y 1 día antes;
- alertas vencidas;
- notificaciones internas;
- email transaccional futuro con Resend;
- configuración básica por tipo de renovación.

Entregable:

- vencimientos visibles y alertas operativas.

---

## 9. Fase CRM 7 - IA interna

Objetivo:

- sumar IA cuando los datos ya estén ordenados.

Funciones posibles:

- generar descripción corta/larga de trabajos;
- resumir estado de cliente;
- sugerir mejoras por proyecto;
- detectar renovaciones críticas;
- generar borradores de emails;
- asistente interno para consultar información.

Proveedor sugerido:

- OpenAI.

Reglas:

- no enviar información sensible sin criterio;
- respetar permisos;
- registrar prompts importantes si afectan decisiones.

---

## 10. Fase CRM 8 - Seguridad y auditoría

Objetivo:

- preparar NexoDigital Security y control interno.

Tareas:

- checklist de seguridad por proyecto;
- control de accesos;
- backups;
- SSL;
- variables de entorno;
- revisión de dependencias;
- logs de auditoría;
- historial de acciones críticas.

Entregable:

- base de seguridad operativa y trazabilidad interna.

---

## 11. Orden recomendado

1. Aprobar documentación.
2. Decidir stack y proveedores.
3. Crear backend base.
4. Implementar auth.
5. Implementar clientes/proyectos.
6. Implementar trabajos realizados.
7. Implementar proveedores/suscripciones/dominios.
8. Implementar renovaciones.
9. Implementar alertas.
10. Implementar IA.
11. Implementar seguridad/auditoría.

---

## 12. Riesgos si se salta el orden

- construir un backend sin modelo claro;
- crear pantallas que luego no coincidan con la DB;
- mezclar datos públicos y privados;
- publicar trabajos incompletos;
- perder control de costos;
- implementar IA sin datos confiables;
- crear alertas sobre fechas mal cargadas;
- sobrecargar el sistema antes de validar uso real.
