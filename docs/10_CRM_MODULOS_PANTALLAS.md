# CRM NexoDigital - Módulos y pantallas

Versión: 1.0  
Estado: propuesta documental previa a implementación

---

## 1. Objetivo

Definir las pantallas principales del futuro panel interno de NexoDigital. Este documento no programa el frontend; solo establece qué debe existir y qué información debe mostrar cada módulo.

---

## 2. Estructura general del panel

Pantallas base:

- Login.
- Dashboard.
- Clientes.
- Proyectos.
- Trabajos realizados.
- Proveedores.
- Suscripciones.
- Dominios.
- Renovaciones.
- Costos.
- Documentación.
- Configuración.

Pantallas futuras:

- IA interna.
- Seguridad.
- Auditoría.
- Reportes.

---

## 3. Login

Objetivo:

- permitir acceso seguro al CRM.

Elementos:

- email;
- contraseña;
- mensaje de error;
- recuperación de acceso futura;
- protección contra intentos excesivos futura.

---

## 4. Dashboard

Objetivo:

- mostrar estado general de la operación.

Métricas recomendadas:

- clientes activos;
- proyectos activos;
- trabajos visibles en web pública;
- proyectos en desarrollo;
- suscripciones próximas a vencer;
- dominios próximos a vencer;
- costos mensuales estimados;
- renovaciones pendientes;
- alertas críticas futuras.

Bloques:

- resumen operativo;
- próximos vencimientos;
- proyectos activos;
- trabajos destacados;
- tareas o notas pendientes futuras.

---

## 5. Clientes

Pantallas:

- listado de clientes;
- ficha de cliente;
- crear/editar cliente.

Listado:

- nombre;
- contacto;
- rubro;
- ciudad/país;
- estado;
- cantidad de proyectos;
- última actualización.

Ficha:

- datos comerciales;
- contacto principal;
- proyectos asociados;
- trabajos realizados asociados;
- suscripciones y dominios asociados;
- documentación;
- notas internas;
- historial futuro.

---

## 6. Proyectos

Pantallas:

- listado de proyectos;
- ficha de proyecto;
- crear/editar proyecto.

Listado:

- nombre;
- cliente;
- tipo;
- estado;
- proveedor frontend;
- proveedor backend;
- dominio;
- fecha de lanzamiento;
- responsable interno.

Ficha:

- descripción;
- estado;
- repositorios;
- URL pública;
- proveedores;
- costos;
- suscripciones;
- dominios;
- documentación;
- trabajo realizado asociado;
- notas internas.

---

## 7. Trabajos realizados

Pantallas:

- listado de trabajos;
- ficha de trabajo;
- crear/editar trabajo.

Objetivo:

- cargar y administrar webs, sistemas, CRMs, SaaS y software creados por NexoDigital.

Campos visibles:

- título;
- cliente;
- categoría;
- rubro;
- estado;
- tecnologías;
- visible en web pública;
- destacado;
- orden;
- URL pública.

Reglas:

- solo trabajos con visibilidad pública deben alimentar la web;
- si no hay URL real, la web no debe mostrar botón;
- notas internas y aprendizajes nunca deben exponerse públicamente.

---

## 8. Proveedores

Pantallas:

- listado de proveedores;
- ficha de proveedor;
- crear/editar proveedor.

Listado:

- nombre;
- categoría;
- oficial/no oficial;
- estado;
- sitio web;
- cuenta responsable.

Categorías:

- frontend;
- backend;
- base de datos;
- IA;
- email;
- dominios;
- hosting;
- storage;
- pagos;
- analítica;
- seguridad;
- monitoreo.

---

## 9. Suscripciones

Pantallas:

- listado de suscripciones;
- ficha de suscripción;
- crear/editar suscripción.

Listado:

- servicio;
- proveedor;
- cliente/proyecto;
- plan;
- costo;
- moneda;
- frecuencia;
- próxima renovación;
- responsable de pago;
- estado.

Uso:

- entender qué servicios se pagan;
- controlar costos mensuales;
- preparar renovaciones y alertas.

---

## 10. Dominios

Pantallas:

- listado de dominios;
- ficha de dominio;
- crear/editar dominio.

Campos:

- dominio;
- cliente;
- proyecto;
- registrador;
- DNS;
- fecha de compra;
- fecha de vencimiento;
- renovación automática;
- responsable de pago;
- estado.

---

## 11. Renovaciones

Pantallas:

- calendario/listado de renovaciones;
- ficha de renovación;
- registrar pago.

Estados:

- pendiente;
- pagada;
- vencida;
- cancelada.

Filtros:

- próximos 30 días;
- próximos 15 días;
- próximos 7 días;
- vencidas;
- por cliente;
- por proveedor.

---

## 12. Costos

Pantallas:

- listado de costos;
- costos por cliente;
- costos por proyecto;
- resumen mensual.

Campos:

- concepto;
- categoría;
- proveedor;
- cliente/proyecto;
- monto;
- moneda;
- frecuencia;
- fecha;
- notas.

Uso:

- analizar rentabilidad;
- saber cuánto cuesta sostener un proyecto;
- decidir precios de mantenimiento.

---

## 13. Documentación

Pantallas:

- biblioteca documental;
- documentos por cliente;
- documentos por proyecto;
- crear/editar documento.

Tipos:

- brief;
- propuesta;
- contrato;
- factura;
- manual;
- nota técnica;
- decisión técnica;
- prompt;
- asset;
- otro.

Reglas:

- cada documento debe poder asociarse a cliente, proyecto o trabajo;
- algunos documentos serán internos;
- otros podrán compartirse con clientes en el futuro.

---

## 14. Configuración

Pantallas:

- usuarios;
- roles;
- proveedores oficiales;
- categorías;
- estados;
- parámetros de alertas futuras.

En V1 puede ser mínima. No conviene sobrediseñar configuración antes de validar uso real.

---

## 15. IA futura

Pantallas futuras:

- asistente interno;
- generación de descripciones para trabajos;
- resumen de cliente/proyecto;
- sugerencias de mejora;
- recordatorios inteligentes.

Regla:

- la IA debe usar datos internos ordenados y permisos adecuados. No debe implementarse antes de tener clientes, proyectos y trabajos consistentes.

---

## 16. Seguridad futura

Pantallas futuras:

- checklist por proyecto;
- revisión de accesos;
- backups;
- SSL;
- variables de entorno;
- dependencias;
- logs;
- auditoría.

Regla:

- no vender ni comunicar auditorías avanzadas hasta tener metodología y capacidad real. Empezar con buenas prácticas básicas.
