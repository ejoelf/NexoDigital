# Pendientes técnicos web pública - NexoDigital

Versión: 1.0  
Estado: pendientes antes de avanzar al diseño técnico del CRM

---

## 1. Formulario de contacto

La web pública actualmente envía el formulario contra `/contact.php`.

Ese enfoque es válido si el despliegue final se realiza en un hosting compatible
con PHP y con envío de correo configurado correctamente.

Antes de cerrar la estrategia de deploy, queda pendiente decidir entre:

1. **Mantener `contact.php`**
   - Requiere hosting con PHP.
   - Requiere configurar envío de correo del servidor.
   - Conviene validar SPF, DKIM y DMARC para mejorar entregabilidad.
   - Conviene sumar protección básica contra spam.

2. **Migrar a una API / email service**
   - Recomendado si la web se publica en Vercel u otro entorno sin PHP.
   - Puede resolverse con una API propia o una función serverless.
   - Proveedores sugeridos por la documentación del proyecto: Resend para email transaccional y Brevo para email marketing.
   - Permite mejor control de logs, validaciones, rate limiting y futuras integraciones con el CRM.

## 2. Recomendación actual

No modificar el formulario hasta confirmar el hosting final.

Si NexoDigital se despliega en Hostinger con PHP disponible, `contact.php` puede
mantenerse temporalmente. Si se despliega en Vercel, conviene migrar el envío a
una API o función serverless antes de considerar el formulario listo para
producción.
