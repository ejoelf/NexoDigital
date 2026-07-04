# Documento Maestro — NexoDigital

Versión: 1.0  
Estado: Base estratégica para evolución de web pública + CRM interno  
Repositorio: `ejoelf/NexoDigital`  
Dominio actual: `https://nexo-digital.tech/`

---

## 1. Propósito del proyecto

NexoDigital es la empresa madre del ecosistema tecnológico creado por Joel. No debe tratarse como una web institucional simple, sino como la base comercial, operativa y técnica desde donde se administrarán clientes, proyectos, SaaS, proveedores, suscripciones, documentación, servicios, seguridad, IA y futuros equipos internos.

El proyecto NexoDigital se divide en dos grandes capas:

1. **Web pública comercial**: presencia institucional, servicios, confianza, portfolio, casos reales, contacto y posicionamiento profesional.
2. **CRM / Panel interno NexoDigital**: centro de control para clientes, proyectos, trabajos realizados, proveedores, suscripciones, vencimientos, costos, seguridad, documentación y operación interna.

---

## 2. Situación actual detectada

El repositorio actual corresponde a una web creada con React + Vite. La estructura inicial contiene `public`, `src`, componentes React, estilos, `contact.php`, `package.json`, `README.md` y configuración Vite.

El archivo `src/App.jsx` ya organiza la landing en componentes principales:

- `Navbar`
- `Hero`
- `About`
- `Services`
- `Portfolio`
- `Contact`
- `Footer`

La web ya comunica desarrollo web, sistemas a medida, automatización e IA aplicada, pero todavía necesita el toque premium, estratégico y escalable de NexoDigital.

---

## 3. Visión de producto

NexoDigital debe transmitir tres ideas centrales:

1. **Empresa tecnológica moderna**: no solo diseño web, sino soluciones digitales completas.
2. **Ecosistema escalable**: productos propios, SaaS, CRMs y plataformas conectadas.
3. **IA + automatización + seguridad**: tecnología aplicada a negocios reales de forma simple y rentable.

La web debe convertir visitantes en consultas reales y el CRM debe ordenar la operación interna para que NexoDigital pueda crecer sin perder control.

---

## 4. Identidad estratégica

NexoDigital debe posicionarse como:

- creadora de webs profesionales;
- desarrolladora de software a medida;
- creadora de CRMs por rubro;
- integradora de IA y automatizaciones;
- futura proveedora de servicios de ciberseguridad;
- administradora de productos SaaS propios;
- socio tecnológico para negocios reales.

No se debe comunicar como agencia genérica. Debe sentirse como una empresa tecnológica boutique, profesional, cercana y con visión de producto.

---

## 5. Objetivos principales

### 5.1 Web pública

- Mejorar diseño visual premium.
- Reforzar propuesta de valor.
- Mostrar servicios con claridad.
- Agregar trabajos realizados reales.
- Mostrar proyectos activos y futuros del ecosistema.
- Generar confianza.
- Mejorar CTAs de contacto.
- Preparar la web para SEO local, nacional e internacional.

### 5.2 CRM interno

- Gestionar clientes.
- Gestionar proyectos y trabajos realizados.
- Registrar webs, sistemas, SaaS y software creado.
- Registrar proveedores oficiales.
- Gestionar suscripciones, costos y renovaciones.
- Controlar dominios, hosting, backend, DB, IA, email y APIs.
- Gestionar vencimientos y alertas.
- Controlar rentabilidad por cliente/proyecto.
- Preparar módulos de seguridad.
- Preparar usuarios internos y roles futuros.

---

## 6. Stack oficial base

### Frontend actual

- React
- Vite
- JavaScript
- CSS modular / CSS separado por componente
- Framer Motion

### Evolución recomendada V1

Mantener React + Vite para la web actual, ordenando componentes, estilos y contenido. No migrar innecesariamente al inicio.

### Backend futuro CRM

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT / refresh tokens
- API REST organizada por módulos

### Base de datos oficial

- Neon como proveedor PostgreSQL principal.
- Supabase como alternativa controlada cuando convenga usar Auth, Storage o Realtime.

### Proveedores oficiales NexoDigital V1

- Frontend V1 NexoDigital: Hostinger.
- Backend V1 CRM: Railway.
- DB V1: Neon.
- Alternativas futuras: Render / Vercel según proyecto, no como deploy principal de esta V1.
- IA: OpenAI API.
- Email transaccional: Resend.
- Email marketing: Brevo.
- Dominios: Hostinger / Namecheap.
- Repositorios: GitHub.
- Pagos Argentina: Mercado Pago.
- Pagos internacional: Stripe.

---

## 7. Módulos principales del CRM

### 7.1 Dashboard principal

Resumen de operación:

- clientes activos;
- proyectos activos;
- trabajos publicados;
- suscripciones próximas a vencer;
- costos mensuales;
- ingresos estimados;
- alertas críticas;
- tareas pendientes;
- estado de servicios clave.

### 7.2 Clientes

Ficha completa de cada cliente:

- datos comerciales;
- contacto principal;
- rubro;
- país / ciudad;
- proyectos asociados;
- servicios contratados;
- estado de cuenta;
- documentación;
- historial de comunicaciones;
- vencimientos asociados;
- notas internas.

### 7.3 Proyectos

Cada proyecto debe tener:

- nombre;
- cliente asociado;
- tipo: web, CRM, SaaS, software, landing, ecommerce, sistema interno;
- estado: idea, análisis, diseño, desarrollo, testing, deployado, mantenimiento, pausado;
- repositorio frontend;
- repositorio backend;
- dominio;
- proveedor frontend;
- proveedor backend;
- proveedor DB;
- servicios externos;
- costos;
- fechas clave;
- documentación relacionada.

### 7.4 Trabajos realizados

Módulo central solicitado por Joel. Debe permitir cargar cada web, software o sistema creado para luego mostrarlo en la web pública o mantenerlo como registro interno.

Campos recomendados:

- nombre del trabajo;
- cliente;
- rubro;
- tipo de trabajo;
- descripción corta;
- descripción larga;
- imagen principal;
- galería;
- URL pública;
- repositorio;
- tecnologías utilizadas;
- módulos incluidos;
- estado;
- fecha de publicación;
- visibilidad pública: sí/no;
- destacado: sí/no;
- orden de aparición;
- aprendizajes internos;
- notas para mejora futura.

### 7.5 Proveedores oficiales

Registro de proveedores predeterminados por categoría técnica:

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

Regla: ningún proveedor nuevo debe usarse sin registrarse en el CRM.

### 7.6 Suscripciones y renovaciones

Debe gestionar:

- dominios;
- hosting;
- backend;
- DB;
- APIs;
- herramientas IA;
- emails;
- licencias;
- software externo;
- costos;
- monedas;
- responsable de pago;
- fecha de renovación;
- alertas a 30, 15, 7 y 1 día;
- estado de pago;
- comprobantes.

### 7.7 Seguridad

Preparado para futura unidad NexoDigital Security:

- checklist de seguridad por proyecto;
- control de accesos;
- backups;
- SSL;
- variables de entorno;
- logs;
- auditoría de acciones;
- permisos internos;
- revisión de dependencias;
- estado de protección por cliente.

### 7.8 Equipo interno

Preparado para el crecimiento:

- Joel / founder;
- futuros colaboradores;
- amigo desarrollador / videojuegos si se suma;
- roles técnicos;
- permisos por módulo;
- tareas asignadas;
- participación por proyecto.

---

## 8. Web pública — secciones recomendadas

La web debe evolucionar hacia estas secciones:

1. Hero premium.
2. Qué es NexoDigital.
3. Servicios principales.
4. Ecosistema de productos.
5. Trabajos realizados.
6. Proceso de trabajo.
7. IA y automatización.
8. Seguridad digital.
9. Tecnologías utilizadas.
10. Preguntas frecuentes.
11. Contacto / reunión gratuita.

---

## 9. Servicios comerciales de NexoDigital

### Servicios V1

- Webs profesionales.
- Landing pages.
- Sistemas a medida.
- CRMs internos.
- Automatizaciones con IA.
- Integraciones con WhatsApp, email y herramientas externas.
- Mantenimiento mensual.

### Servicios futuros

- NexoDigital Security.
- Auditorías básicas de seguridad.
- Gestión de infraestructura.
- Monitoreo y backups.
- Gamificación / experiencias interactivas.
- Desarrollo de SaaS para terceros.

---

## 10. Reglas de diseño

- Estética moderna, minimalista y premium.
- Dashboard visual, cards, métricas y glassmorphism controlado.
- Mucho espacio en blanco.
- Tipografía limpia.
- Modo claro y oscuro preparado.
- Animaciones suaves, no invasivas.
- Responsive completo.
- No sobrecargar con textos largos en la home.
- Usar microinteracciones para transmitir calidad.

---

## 11. Roadmap resumido

### V1 — Optimización web actual

- Reordenar componentes.
- Mejorar copy.
- Mejorar diseño.
- Agregar sección trabajos realizados.
- Mejorar portfolio.
- Mejorar servicios.
- Mejorar contacto.
- Preparar estructura para futuro CRM.

### V2 — CRM interno base

- Auth.
- Dashboard.
- Clientes.
- Proyectos.
- Trabajos realizados.
- Proveedores.
- Suscripciones.

### V3 — Operación y finanzas

- Costos por proyecto.
- Rentabilidad.
- Renovaciones.
- Recordatorios.
- Comprobantes.

### V4 — IA interna

- Asistente interno NexoDigital.
- Generación de descripciones.
- Recordatorios inteligentes.
- Recomendaciones de mejora.
- Análisis de clientes/proyectos.

### V5 — Seguridad y escalabilidad

- Checklists de seguridad.
- Backups.
- Logs de auditoría.
- Roles avanzados.
- Módulo NexoDigital Security.

---

## 12. Regla de trabajo con Codex

Codex no debe modificar todo de una sola vez. Debe trabajar por bloques controlados:

1. Leer todos los documentos en `/docs`.
2. Confirmar entendimiento del alcance.
3. Trabajar una fase por vez.
4. No mezclar frontend, backend, DB y CRM si no corresponde.
5. Mantener estilo NexoDigital.
6. No eliminar funcionalidades existentes sin justificación.
7. Documentar cambios importantes.
8. Mantener el proyecto listo para deploy.

---

## 13. Prioridad inmediata

La prioridad no es construir todo el CRM de golpe. Primero se debe profesionalizar la web actual y dejar preparada la estructura documental/técnica para evolucionar.

Orden inmediato:

1. Mejorar web pública.
2. Crear sección real de trabajos realizados.
3. Dejar la estructura de datos pensada para que luego el CRM cargue esos trabajos.
4. Preparar diseño de CRM interno.
5. Luego construir backend y base de datos.
