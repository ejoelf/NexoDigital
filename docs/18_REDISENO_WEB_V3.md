# Rediseño de la web pública — v3 (31 de octubre de 2026)

## Por qué

La versión anterior tenía unas diez secciones, siete llamados a la acción distintos, mensajes repetidos ("menos tareas repetitivas" aparecía cuatro veces) y demasiadas categorías de servicio. Era larga de recorrer, sobre todo en el celular. Además, el formulario de contacto enviaba a `contact.php`, que no funciona en Render (sitio estático sin PHP), así que las consultas no llegaban.

## Qué cambió

- Portada en cinco bloques más pie: portada, servicios, casos, proceso, sobre mí y contacto.
- Cinco servicios con el mismo peso; el diagnóstico de IA aparece como gratis.
- Casos reales con logo, rubro y una descripción breve, sin cifras. Tapicería Líder figura como "Próximamente".
- Sección "Sobre mí" con foto y texto de Joel.
- Contacto solo por WhatsApp y mail, con mensaje precargado según el idioma. Botón flotante de WhatsApp.
- Versión en italiano en `/it`, con selector de idioma.
- Página de política de privacidad en ambos idiomas.
- Logo ND (el oficial) en lugar del isotipo "N" anterior.
- Canonical y vista previa apuntando a la URL de Render (el dominio nexo-digital.tech no está activo).
- Tipografía Sora servida desde el sitio; se quitó `framer-motion`.
- El CRM se carga aparte: la web pública pasó de ~313 KB a ~220 KB de JavaScript.

## Eliminado

- Componentes y estilos de la web anterior (`src/components/`, `src/styles/` salvo `base.css`, `src/data/`).
- `contact.php` y `public/.htaccess` (eran para Hostinger).
- Imágenes sin uso en `public/projects/`.

La versión anterior quedó guardada en la rama `backup/web-antes-rediseno-2026-10-31`.

## Pendientes

- Logo en vector (SVG) para fondo claro e impresión.
- Perfil de Google del negocio; cuando exista, sumar el enlace y pedir reseñas.
- Capturas reales de las webs de clientes para reemplazar los logos en las tarjetas (opcional).
- Dominio propio.
- Actualizar el isotipo del CRM al logo ND.
- Revisar la política de privacidad con un profesional si el negocio crece o se agregan formularios o analítica.
