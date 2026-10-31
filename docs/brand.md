# Guía de marca — NexoDigital (v3, octubre 2026)

Esta guía es la referencia para la web pública y cualquier pieza nueva (redes, propuestas, presentaciones). Reemplaza a `assets/branding/` y a `docs/17_NEXODIGITAL_VISUAL_SYSTEM_V2.md` en lo que se contradigan.

## Qué es NexoDigital

Agencia digital fundada por Joel. Crea webs, software a medida, automatizaciones con IA y presencia digital para negocios. Trabaja de forma remota desde Italia, para clientes de Argentina y de cualquier país.

**Frase corta:** Soluciones digitales para negocios reales.

## Servicios (siempre con el mismo peso)

1. Web comercial
2. Software a medida (turnos, CRM, paneles de gestión)
3. Automatización con IA
4. Diagnóstico de IA (gratis al inicio: revisión del negocio, informe y reunión)
5. Presencia digital (redes, contenido, marketing)

Los turnos son un ejemplo dentro de "Software a medida", no el eje de la marca.

## Tono

- Cercano y claro, como explicarle algo a un amigo que tiene un negocio.
- En español se usa el voseo rioplatense: "contanos", "pedí", "trabajás".
- En italiano, tuteo: "raccontaci", "richiedi", "lavori".
- Frases cortas. Un mensaje por sección.
- Sin palabras de relleno: evitar "potenciar", "sinergia", "disruptivo", "soluciones 360".
- Sin promesas que no se puedan comprobar: nada de cifras ni resultados inventados.

## Logo

El logo oficial es el monograma **ND** en tonos de azul a cian, con la palabra NEXODIGITAL en blanco debajo.

| Archivo | Uso |
|---|---|
| `public/brand/nd-monogram.webp` / `.png` | Encabezado de la web, avatar, espacios chicos |
| `public/brand/nd-logo-vertical.webp` / `.png` | Pie de página, piezas centradas |
| `public/og-image.jpg` | Imagen original completa (fondo azul oscuro). Vista previa al compartir |
| `public/favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Íconos del navegador y del celular |

Reglas:

- Usar sobre fondos oscuros. Las versiones con transparencia salieron de una imagen JPG, así que sobre blanco pueden verse bordes sucios.
- No deformar, rotar ni cambiar los colores.
- Dejar aire alrededor: como mínimo, la mitad del alto de la letra N.
- Tamaño mínimo del monograma en pantalla: 32 px de ancho.

**Pendiente:** conseguir el logo en vector (SVG). Con eso se pueden hacer versiones para fondo claro y para impresión.

Nota: el CRM interno (`/crm`) todavía usa un isotipo anterior en forma de "N" (`public/brand/nexodigital-*.svg`). Conviene reemplazarlo por el ND cuando se toque el CRM.

## Colores

| Nombre | Valor | Uso |
|---|---|---|
| Fondo | `#070D19` | Fondo general de la web |
| Fondo alternativo | `#0B1320` | Pie de página, tarjetas de pasos |
| Superficie | `#101A2B` | Tarjetas |
| Superficie elevada | `#152238` | Estados activos (selector de idioma) |
| Azul Nexo | `#2563EB` | Color principal, botones |
| Cian Digital | `#06B6D4` | Acentos, etiqueta "Gratis" |
| Azul claro | `#7AA7FF` | Enlaces sobre fondo oscuro |
| Cian claro | `#67E8F9` | Textos chicos destacados (eyebrows) |
| Texto | `#F8FBFF` | Títulos y texto principal |
| Texto suave | `#CBD5E1` | Párrafos |
| Texto apagado | `#94A3B8` | Descripciones, pie de página |
| Ámbar | `#FCD34D` | Solo para la etiqueta "Próximamente" |
| Verde WhatsApp | `#25D366` | Solo para el botón flotante de WhatsApp |

**Degradado oficial:** `linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)`. Se usa en el botón principal y en los números del proceso. No usarlo como fondo de secciones enteras.

Los valores están en `src/site/site.css`, en el bloque `.site { --site-... }`.

## Tipografía

- **Sora** (variable), servida desde el propio sitio con `@fontsource-variable/sora`. No usar Google Fonts: evita conexiones a terceros y simplifica la privacidad.
- Títulos: peso 650–700, interletrado negativo (−0,03 a −0,045 em).
- Texto: peso 400, interlineado 1,6.
- Botones y etiquetas: peso 600.

## Componentes

- **Botón principal:** degradado oficial, texto blanco, esquinas de 12 px. Uno solo por sección.
- **Botón secundario:** borde fino, fondo transparente.
- **Tarjeta:** fondo superficie, borde fino `rgba(148,163,184,0.16)`, esquinas de 14–20 px, sin sombras.
- **Etiqueta "Gratis":** cian sobre cian transparente.
- **Etiqueta "Próximamente":** ámbar sobre ámbar transparente; la tarjeta lleva borde punteado.
- **Íconos:** de línea, trazo 1,7, en `src/site/Icons.jsx`. No agregar librerías de íconos.

## Reglas de diseño

- Pensar primero en el celular.
- Cada sección dice una sola cosa.
- No repetir el mismo mensaje en varias secciones.
- Sin animaciones decorativas; solo transiciones cortas al pasar el mouse.
- Contacto solo por WhatsApp y mail. No hay formulario.

## Datos de contacto

- WhatsApp Business: +54 9 358 572-9499
- Mail: contacto.nexod@gmail.com
- Instagram: https://www.instagram.com/nexodigital_ar/
- Facebook: https://www.facebook.com/people/Nexodigital/61585696221610/

Todos están centralizados en `src/site/content.js` (`CONTACT`).
