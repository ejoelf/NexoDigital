# CRM NexoDigital - Modelo de datos

Versión: 1.0  
Estado: propuesta documental previa a implementación

---

## 1. Criterio general

El modelo de datos debe cubrir la operación real de NexoDigital sin sobrediseñar. La prioridad es ordenar clientes, proyectos, trabajos realizados, proveedores, suscripciones, dominios, renovaciones, costos y documentación.

La base recomendada es PostgreSQL, usando Prisma como ORM cuando se implemente el backend.

---

## 2. Entidades principales

Entidades V1:

- User.
- Client.
- Project.
- Work.
- Provider.
- Subscription.
- Domain.
- Renewal.
- Cost.
- Document.
- PaymentResponsible.

Entidades futuras:

- Alert.
- AuditLog.
- SecurityChecklist.
- AiSuggestion.
- InternalTask.

---

## 3. User

Representa usuarios internos del CRM.

Campos sugeridos:

- id.
- name.
- email.
- passwordHash.
- role.
- status.
- lastLoginAt.
- createdAt.
- updatedAt.

Relaciones:

- puede crear clientes;
- puede actualizar proyectos;
- puede registrar documentación;
- puede quedar asociado como responsable interno de proyectos o renovaciones.

---

## 4. Client

Representa clientes de NexoDigital.

Campos sugeridos:

- id.
- businessName.
- displayName.
- contactName.
- email.
- phone.
- whatsapp.
- industry.
- country.
- city.
- address.
- status: lead, active, paused, inactive.
- notes.
- createdAt.
- updatedAt.

Relaciones:

- un cliente puede tener muchos proyectos;
- un cliente puede tener muchos trabajos realizados;
- un cliente puede tener muchas suscripciones, dominios, costos y documentos.

---

## 5. Project

Representa una web, CRM, SaaS, ecommerce, landing, sistema interno o software a medida.

Campos sugeridos:

- id.
- clientId.
- name.
- slug.
- type: website, landing, ecommerce, crm, saas, internal_system, custom_software, automation.
- status: idea, analysis, design, development, testing, deployed, maintenance, paused, closed.
- description.
- frontendRepositoryUrl.
- backendRepositoryUrl.
- publicUrl.
- frontendProviderId.
- backendProviderId.
- databaseProviderId.
- startDate.
- launchDate.
- maintenanceStartDate.
- notes.
- createdAt.
- updatedAt.

Relaciones:

- pertenece a un cliente;
- puede tener un trabajo realizado asociado;
- puede tener proveedores;
- puede tener suscripciones;
- puede tener dominios;
- puede tener renovaciones;
- puede tener costos;
- puede tener documentación.

---

## 6. Work

Representa trabajos realizados que pueden ser internos o públicos.

Debe ser compatible con la data actual de la web pública (`src/data/works.js`) para permitir una futura conexión.

Campos sugeridos:

- id.
- projectId.
- clientId.
- title.
- slug.
- clientName.
- category.
- industry.
- shortDescription.
- longDescription.
- mainImageUrl.
- galleryUrls.
- publicUrl.
- frontendRepositoryUrl.
- backendRepositoryUrl.
- technologies.
- includedServices.
- status: idea, analysis, design, development, review, published, maintenance, paused, closed.
- publishedAt.
- isPublic.
- featured.
- displayOrder.
- internalLearnings.
- internalNotes.
- createdAt.
- updatedAt.

Relaciones:

- puede pertenecer a un proyecto;
- puede pertenecer a un cliente;
- puede ser visible en web pública si `isPublic = true`.

Regla:

- la web pública solo debe consumir trabajos públicos;
- notas internas, aprendizajes y repositorios privados no deben exponerse públicamente.

---

## 7. Provider

Representa proveedores usados por NexoDigital o por proyectos de clientes.

Campos sugeridos:

- id.
- name.
- category: frontend, backend, database, auth, storage, ai, email, domain, hosting, payments, analytics, security, monitoring.
- websiteUrl.
- accountOwner.
- billingType.
- notes.
- isOfficial.
- status: active, candidate, deprecated.
- createdAt.
- updatedAt.

Proveedores oficiales iniciales:

- Hostinger.
- Railway.
- Neon.
- Supabase.
- OpenAI.
- Resend.
- Brevo.
- Hostinger.
- Namecheap.
- GitHub.
- Mercado Pago.
- Stripe.

Regla:

- ningún proveedor nuevo debería usarse sin registrarse en el CRM.

---

## 8. Subscription

Representa servicios recurrentes: hosting, backend, DB, email, IA, dominios, herramientas externas o licencias.

Campos sugeridos:

- id.
- providerId.
- clientId.
- projectId.
- name.
- serviceType.
- planName.
- currency.
- amount.
- billingFrequency: monthly, yearly, one_time, usage_based.
- startDate.
- renewalDate.
- paymentResponsibleId.
- status: active, trial, cancelled, expired, paused.
- invoiceUrl.
- notes.
- createdAt.
- updatedAt.

Relaciones:

- pertenece a un proveedor;
- puede pertenecer a cliente;
- puede pertenecer a proyecto;
- puede tener renovaciones;
- puede tener costos asociados.

---

## 9. Domain

Representa dominios propios o de clientes.

Campos sugeridos:

- id.
- domainName.
- clientId.
- projectId.
- providerId.
- registrar.
- dnsProvider.
- purchaseDate.
- expirationDate.
- autoRenew.
- paymentResponsibleId.
- status: active, expiring, expired, transferred, parked.
- notes.
- createdAt.
- updatedAt.

Relaciones:

- puede pertenecer a cliente;
- puede pertenecer a proyecto;
- puede generar renovaciones;
- puede estar vinculado a proveedor.

---

## 10. Renewal

Representa vencimientos y renovaciones de dominios, suscripciones, hosting, APIs o licencias.

Campos sugeridos:

- id.
- entityType: subscription, domain, provider_service, license, other.
- entityId.
- clientId.
- projectId.
- dueDate.
- amount.
- currency.
- paymentResponsibleId.
- status: pending, paid, overdue, cancelled.
- paidAt.
- receiptUrl.
- notes.
- createdAt.
- updatedAt.

Relaciones:

- puede apuntar a una suscripción o dominio;
- puede vincularse a cliente/proyecto;
- puede generar alertas futuras.

Alertas futuras recomendadas:

- 30 días antes;
- 15 días antes;
- 7 días antes;
- 1 día antes;
- vencido.

---

## 11. Cost

Representa costos asociados a clientes, proyectos o servicios internos.

Campos sugeridos:

- id.
- clientId.
- projectId.
- providerId.
- subscriptionId.
- concept.
- category: infrastructure, domain, email, ai, development, maintenance, license, payment_fee, other.
- amount.
- currency.
- frequency: one_time, monthly, yearly, usage_based.
- date.
- notes.
- createdAt.
- updatedAt.

Uso:

- calcular costo mensual por proyecto;
- estimar rentabilidad;
- entender qué herramientas sostienen cada cliente.

---

## 12. Document

Representa archivos, links o notas documentales.

Campos sugeridos:

- id.
- clientId.
- projectId.
- workId.
- title.
- type: brief, proposal, contract, invoice, manual, technical_note, decision, prompt, asset, other.
- url.
- storageProvider.
- visibility: internal, client_shared, public.
- notes.
- createdByUserId.
- createdAt.
- updatedAt.

Relaciones:

- puede pertenecer a cliente;
- puede pertenecer a proyecto;
- puede pertenecer a trabajo realizado.

---

## 13. PaymentResponsible

Representa quién paga una suscripción, dominio o renovación.

Campos sugeridos:

- id.
- name.
- type: nexodigital, client, third_party.
- clientId.
- email.
- phone.
- notes.
- createdAt.
- updatedAt.

Uso:

- saber si paga NexoDigital o el cliente;
- evitar vencimientos sin responsable claro;
- preparar alertas.

---

## 14. Relaciones resumidas

- Client tiene muchos Project.
- Client tiene muchos Work.
- Project puede tener un Work público asociado.
- Project tiene muchos Subscription, Domain, Cost y Document.
- Provider tiene muchos Subscription, Domain y Cost.
- Subscription tiene muchas Renewal.
- Domain tiene muchas Renewal.
- Renewal puede generar Alert en el futuro.
- User puede crear o modificar registros.
- Document puede asociarse a Client, Project o Work.

---

## 15. Regla para evolución

Primero implementar las entidades necesarias para operar:

1. User.
2. Client.
3. Project.
4. Work.
5. Provider.
6. Subscription.
7. Domain.
8. Renewal.
9. Document.

Luego agregar costos, alertas, IA, seguridad y auditoría según necesidad real.
