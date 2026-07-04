# CRM NexoDigital - Diseño técnico

Versión: 1.0  
Estado: propuesta documental previa a implementación  
Alcance: CRM interno NexoDigital

---

## 1. Objetivo del CRM

El CRM interno de NexoDigital será el centro operativo para administrar clientes, proyectos, trabajos realizados, proveedores, suscripciones, dominios, renovaciones, costos, documentación, responsables de pago y futuras alertas.

Su función principal no es reemplazar la web pública, sino ordenar la operación interna para que NexoDigital pueda crecer sin perder control sobre:

- qué clientes existen;
- qué proyectos están activos;
- qué trabajos pueden mostrarse públicamente;
- qué proveedores se usan;
- qué servicios se pagan;
- cuándo vencen dominios, hosting, APIs o herramientas;
- cuánto cuesta mantener cada proyecto;
- qué documentación técnica o comercial pertenece a cada cliente/proyecto.

---

## 2. Alcance V1

La primera versión debe ser simple, usable y modular. Debe priorizar lo que NexoDigital necesita para operar hoy.

Módulos V1:

- autenticación interna;
- usuarios internos básicos;
- dashboard operativo;
- clientes;
- proyectos;
- trabajos realizados;
- proveedores;
- suscripciones;
- dominios;
- renovaciones;
- documentación asociada.

La V1 no debe intentar resolver IA avanzada, auditorías de seguridad completas, contabilidad formal ni automatizaciones complejas.

---

## 3. Alcance futuro

El CRM debe quedar preparado para crecer hacia:

- alertas automáticas de vencimientos;
- cálculo de costos mensuales;
- rentabilidad por cliente/proyecto;
- asistente interno con IA;
- generación de descripciones para trabajos realizados;
- recomendaciones de mejora por proyecto;
- checklists de seguridad;
- logs de auditoría;
- roles avanzados;
- conexión con la web pública para publicar trabajos visibles.

---

## 4. Stack recomendado

### Backend futuro

- Node.js.
- Express.
- PostgreSQL.
- Prisma.
- JWT con refresh tokens.
- API REST organizada por módulos.

### Base de datos

- Neon como PostgreSQL principal.
- Supabase como alternativa controlada cuando convenga usar Auth, Storage o Realtime.

### Frontend panel interno

Puede mantenerse separado de la web pública. Opciones futuras:

- React + Vite para panel interno independiente.
- Next.js si más adelante conviene tener rutas protegidas, server-side patterns o despliegue unificado.

La decisión debe tomarse antes de programar el panel.

### Proveedores oficiales a contemplar

- Frontend V1: Hostinger.
- Backend V1: Railway.
- DB V1: Neon.
- Render / Vercel: alternativas futuras, no deploy principal de esta V1.
- Alternativa DB/Auth/Storage: Supabase.
- IA: OpenAI.
- Email transaccional: Resend.
- Email marketing: Brevo.
- Dominios: Hostinger / Namecheap.
- Repositorios: GitHub.
- Pagos Argentina: Mercado Pago.
- Pagos internacional: Stripe.

---

## 5. Separación entre web pública y CRM interno

La web pública y el CRM interno deben mantenerse separados en responsabilidades.

### Web pública

Responsabilidades:

- presentar NexoDigital;
- comunicar servicios;
- mostrar ecosistema;
- mostrar trabajos públicos;
- captar consultas;
- posicionamiento comercial y SEO.

### CRM interno

Responsabilidades:

- administrar información privada;
- gestionar clientes y proyectos;
- cargar trabajos realizados;
- decidir qué trabajos son públicos;
- controlar proveedores, costos, renovaciones y documentación;
- preparar alertas y futuras funciones internas.

La web pública no debe exponer datos privados del CRM. Solo debe consumir, en una etapa futura, trabajos marcados como públicos.

---

## 6. Regla para trabajos realizados

El módulo "Trabajos realizados" será el puente controlado entre CRM y web pública.

Reglas:

- todo trabajo puede existir como registro interno;
- solo los trabajos con `isPublic = true` deben aparecer en la web pública;
- un trabajo puede estar destacado o no;
- un trabajo puede tener URL pública o no;
- si no tiene URL real, la web pública no debe mostrar botón falso;
- el CRM debe guardar notas internas no visibles para visitantes.

---

## 7. Reglas para no mezclar fases

1. No crear backend sin aprobar el modelo de datos.
2. No crear panel frontend sin definir módulos y roles.
3. No conectar la web pública al CRM hasta tener API estable.
4. No mover la web pública a otro stack solo por construir el CRM.
5. No implementar IA antes de tener datos ordenados.
6. No implementar alertas antes de tener renovaciones y fechas confiables.
7. No exponer datos privados en endpoints públicos.
8. Cada fase debe dejar documentación actualizada.

---

## 8. Decisiones pendientes antes de programar

- Confirmar si el backend será Express puro o NestJS/otro framework.
- Confirmar si el panel interno será React + Vite o Next.js.
- Confirmar si la autenticación será propia con JWT o usando Supabase Auth.
- Confirmar dónde se alojarán imágenes y documentos: servidor propio, Supabase Storage, Cloudinary u otro.
- Confirmar si la web pública consumirá trabajos desde API pública o si se generará data estática al principio.
- Confirmar estrategia de email para alertas: Resend, Brevo o ambos con roles distintos.
