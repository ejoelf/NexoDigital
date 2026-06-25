# Plan de Trabajo para Codex — NexoDigital

Versión: 1.0  
Proyecto: NexoDigital Web + CRM Interno

---

## 1. Objetivo del plan

Este documento define cómo debe trabajar Codex sobre el proyecto NexoDigital sin mezclar fases ni generar cambios desordenados.

NexoDigital ya tiene una web pública creada. El trabajo no empieza desde cero: se debe mejorar, ordenar, profesionalizar y preparar para una evolución futura hacia CRM interno.

---

## 2. Reglas generales para Codex

1. Leer primero todos los documentos dentro de `/docs`.
2. No modificar archivos sin entender el objetivo de la fase.
3. No mezclar cambios de diseño con backend si la fase no lo pide.
4. No borrar componentes existentes sin reemplazo claro.
5. Mantener React + Vite en la web actual.
6. Mantener CSS organizado por componente.
7. Priorizar código claro y mantenible.
8. Cada cambio debe dejar el proyecto compilando.
9. Ejecutar `npm run build` antes de considerar finalizada una fase.
10. Documentar pendientes si una fase queda incompleta.

---

## 3. Fase 0 — Diagnóstico inicial

### Objetivo

Analizar el estado real del repo antes de modificar.

### Tareas

- Revisar estructura actual.
- Revisar componentes en `src/components`.
- Revisar estilos en `src/styles`.
- Revisar assets disponibles.
- Revisar `contact.php`.
- Revisar `package.json`.
- Confirmar si existen warnings o errores de build.

### Entregable

- Lista de puntos buenos.
- Lista de problemas.
- Lista de mejoras prioritarias.
- Confirmación de build.

---

## 4. Fase 1 — Reordenamiento visual y copywriting web

### Objetivo

Darle a la web el tono premium NexoDigital.

### Tareas

- Mejorar Hero.
- Reforzar propuesta de valor.
- Ajustar textos para que no parezca agencia genérica.
- Agregar lenguaje de empresa tecnológica.
- Mejorar CTAs.
- Reforzar IA, automatización, software y CRM.
- Preparar sección de seguridad digital sin prometer servicios avanzados todavía.

### Archivos posibles

- `src/components/Hero.jsx`
- `src/components/About.jsx`
- `src/components/Services.jsx`
- `src/components/Navbar.jsx`
- estilos relacionados

### Criterio de aceptación

La web debe comunicar que NexoDigital crea tecnología real para negocios, no solo páginas web.

---

## 5. Fase 2 — Sección Trabajos Realizados

### Objetivo

Convertir el portfolio actual en una sección profesional de trabajos realizados.

### Tareas

- Reestructurar `Portfolio.jsx`.
- Renombrar conceptualmente a Trabajos Realizados o Casos / Proyectos.
- Agregar campos preparados para URL pública, tipo, rubro, estado, tecnologías y destacado.
- Preparar data local escalable.
- Mostrar páginas, software, CRM y SaaS.
- Permitir trabajos visibles y futuros.

### Campos mínimos por trabajo

- `title`
- `client`
- `category`
- `industry`
- `description`
- `status`
- `image`
- `url`
- `technologies`
- `featured`

### Criterio de aceptación

La sección debe poder mostrar trabajos reales como NexoDigital, Nico Galicia Stylist Mens, Tapicería Líder, CF MetalPintura, Electricidad Zacarías y futuros proyectos.

---

## 6. Fase 3 — Sección Ecosistema NexoDigital

### Objetivo

Mostrar que NexoDigital tiene productos propios y visión de ecosistema.

### Tareas

- Crear componente `Ecosystem.jsx`.
- Mostrar líneas como SaaS, Web + CRM, IA, Seguridad, Labs.
- Mencionar productos propios en formato estratégico, no listado largo sin contexto.
- Agregar diseño con cards premium.

### Criterio de aceptación

La web debe explicar que NexoDigital es una empresa madre con productos y plataformas, no solo un sitio de servicios.

---

## 7. Fase 4 — Servicios ampliados

### Objetivo

Mejorar la sección de servicios.

### Servicios mínimos

- Webs profesionales.
- Sistemas a medida.
- CRM para negocios.
- Automatización e IA aplicada.
- Integraciones.
- Mantenimiento e infraestructura.
- Seguridad digital básica futura.

### Criterio de aceptación

Cada servicio debe tener título, descripción, beneficios y posible CTA.

---

## 8. Fase 5 — Preparación CRM interno

### Objetivo

No construir el CRM completo todavía, pero dejar documentado y preparado el diseño técnico.

### Tareas

- Crear carpeta futura `server` o `backend` solo cuando se apruebe construir backend.
- Diseñar módulos principales.
- Definir estructura de base de datos.
- Definir roles.
- Definir endpoints.
- Definir pantallas.

### Criterio de aceptación

Debe quedar claro cómo se construirá el CRM cuando Joel dé aprobación.

---

## 9. Fase 6 — Backend CRM V1

### Objetivo

Crear backend inicial del CRM.

### Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- JWT

### Módulos iniciales

- Auth.
- Usuarios internos.
- Clientes.
- Proyectos.
- Trabajos realizados.
- Proveedores.
- Suscripciones.

### Criterio de aceptación

API funcional, modular, segura y lista para conectarse al frontend.

---

## 10. Fase 7 — Panel CRM frontend

### Objetivo

Crear panel interno NexoDigital.

### Pantallas iniciales

- Login.
- Dashboard.
- Clientes.
- Proyectos.
- Trabajos realizados.
- Proveedores.
- Suscripciones.
- Renovaciones.
- Configuración.

### Criterio de aceptación

Panel usable, responsive y alineado visualmente a la identidad NexoDigital.

---

## 11. Fase 8 — IA, automatizaciones y seguridad

### Objetivo

Agregar capacidades avanzadas una vez que la base sea estable.

### Funciones futuras

- Asistente interno.
- Generación de descripciones de trabajos.
- Recordatorios inteligentes.
- Alertas de vencimientos.
- Revisión de seguridad por proyecto.
- Sugerencias de mejora para clientes.

---

## 12. Orden recomendado de ejecución

1. Documentación.
2. Diagnóstico.
3. Web pública premium.
4. Trabajos realizados.
5. Ecosistema y servicios.
6. Diseño CRM.
7. Backend CRM.
8. Frontend CRM.
9. IA y automatizaciones.
10. Seguridad y escalabilidad.

---

## 13. Prompt base para Codex

Usar el archivo `docs/07_PROMPTS_CODEX.md` para ejecutar cada bloque. No pedir a Codex que haga todo el proyecto completo de una sola vez.
