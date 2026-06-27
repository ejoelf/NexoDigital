# CRM NexoDigital - Roles y permisos

Versión: 1.0  
Estado: propuesta documental previa a implementación

---

## 1. Objetivo

Definir roles iniciales para el CRM interno sin sobrediseñar permisos. La prioridad es proteger información sensible, evitar cambios accidentales y preparar el sistema para futuros empleados o colaboradores.

---

## 2. Roles iniciales

### Founder / Admin principal

Rol de Joel como administrador total del sistema.

Permisos:

- acceso completo al dashboard;
- crear, editar y eliminar clientes;
- crear, editar y eliminar proyectos;
- crear, editar y publicar trabajos realizados;
- gestionar proveedores oficiales;
- gestionar suscripciones, dominios, renovaciones y costos;
- gestionar documentación;
- crear usuarios internos;
- asignar roles;
- ver logs futuros;
- configurar alertas futuras;
- acceder a módulos futuros de IA y seguridad.

Restricciones:

- ninguna restricción funcional en V1.

---

### Empleado interno NexoDigital

Futuro usuario operativo del equipo.

Permisos sugeridos:

- ver dashboard;
- ver clientes;
- crear y editar clientes asignados;
- crear y editar proyectos asignados;
- cargar trabajos realizados como borrador;
- cargar documentación;
- ver proveedores;
- ver suscripciones asociadas a proyectos asignados;
- registrar notas internas.

Restricciones:

- no eliminar clientes;
- no eliminar proyectos;
- no publicar trabajos en web pública sin aprobación;
- no modificar proveedores oficiales;
- no cambiar costos críticos;
- no administrar usuarios;
- no cambiar configuración global.

---

### Colaborador externo

Usuario temporal o limitado: diseñador, desarrollador, soporte, especialista externo.

Permisos sugeridos:

- ver solo proyectos asignados;
- ver documentación compartida;
- cargar entregables o notas técnicas;
- actualizar estado de tareas asignadas cuando exista módulo de tareas.

Restricciones:

- no ver costos;
- no ver suscripciones;
- no ver renovaciones;
- no ver clientes no asignados;
- no publicar trabajos;
- no editar proveedores;
- no acceder a configuración;
- no administrar usuarios.

---

### Solo lectura

Rol opcional para auditoría interna o revisión.

Permisos:

- ver clientes, proyectos, trabajos y documentación permitida.

Restricciones:

- no crear;
- no editar;
- no eliminar;
- no publicar;
- no gestionar costos;
- no gestionar usuarios.

---

## 3. Permisos por módulo

| Módulo | Founder/Admin | Empleado interno | Colaborador externo | Solo lectura |
|---|---|---|---|---|
| Dashboard | Total | Ver | Limitado | Ver |
| Clientes | Total | Ver/editar asignados | No o limitado | Ver |
| Proyectos | Total | Ver/editar asignados | Ver asignados | Ver |
| Trabajos realizados | Total/publicar | Crear borrador/editar asignados | No o limitado | Ver |
| Proveedores | Total | Ver | No | Ver |
| Suscripciones | Total | Ver asignadas | No | Ver limitado |
| Dominios | Total | Ver asignados | No | Ver limitado |
| Renovaciones | Total | Ver/registrar asignadas | No | Ver limitado |
| Costos | Total | Limitado | No | No |
| Documentación | Total | Crear/editar asignada | Ver/cargar permitida | Ver |
| Configuración | Total | No | No | No |
| Usuarios | Total | No | No | No |
| IA futura | Total | Usar según permiso | No inicial | No |
| Seguridad futura | Total | Ver checklist asignado | No inicial | Ver limitado |

---

## 4. Acciones permitidas y restringidas

### Acciones críticas

Deben estar limitadas a Founder/Admin:

- eliminar registros;
- publicar trabajos en la web pública;
- cambiar `isPublic` de un trabajo;
- marcar un proveedor como oficial;
- modificar costos sensibles;
- cambiar responsables de pago;
- administrar usuarios;
- cambiar roles;
- ver logs de auditoría;
- configurar integraciones.

### Acciones operativas

Pueden permitirse a empleados internos:

- crear cliente;
- editar cliente asignado;
- crear proyecto;
- cambiar estado de proyecto;
- cargar trabajo como borrador;
- agregar tecnologías a trabajos;
- subir documentación;
- agregar notas internas;
- registrar renovación pagada si está asignada.

### Acciones limitadas para colaboradores

Pueden permitirse solo si el proyecto lo requiere:

- ver documentación compartida;
- cargar archivos o links técnicos;
- actualizar notas de avance;
- responder tareas asignadas.

---

## 5. Reglas de seguridad mínimas

- Todo usuario debe iniciar sesión.
- Las contraseñas deben guardarse hasheadas.
- Los tokens deben tener expiración.
- Las acciones críticas deben quedar preparadas para logs.
- Los colaboradores externos deben tener acceso por proyecto, no global.
- Los costos y responsables de pago deben ser información restringida.
- La visibilidad pública de trabajos debe requerir permiso alto.

---

## 6. Implementación recomendada

V1 puede comenzar con roles simples:

- ADMIN.
- MEMBER.
- COLLABORATOR.
- READONLY.

Después se pueden agregar permisos granulares si el equipo crece.

No conviene empezar con un sistema excesivamente complejo de permisos si NexoDigital todavía opera con un equipo chico.
