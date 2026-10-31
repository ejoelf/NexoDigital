# NexoDigital — instrucciones para trabajar en este repo

## Qué hay acá

- **Web pública** (`src/site/`): React + Vite. Español en `/`, italiano en `/it`, política de privacidad en `/privacidad` y `/it/privacy`.
- **CRM interno** (`src/crm/`, ruta `/crm`): panel privado. Se carga aparte (lazy) y tiene sus propios estilos. No tocarlo al cambiar la web pública.
- **Backend del CRM** (`backend/`): Node + Express + Prisma, desplegado aparte.

## Deploy (estado actual)

- Web: Render, sitio estático `nexodigital` → https://nexodigital-ix6r.onrender.com
  - Rama `main`, deploy automático en cada commit.
  - Build: `npm install && npm run build`. Carpeta publicada: `dist`.
  - Regla de reescritura en Render: `/*` → `/index.html` (necesaria para `/it`, `/privacidad` y `/crm`).
- Backend del CRM: Render, `https://nexodigital-wtjy.onrender.com` (configurado en `.env.production`; el CI lo valida).
- No hay dominio propio por ahora. Cuando lo haya, cambiar la URL en `index.html` (canonical, hreflang, og) y en `SITE_URL` de `src/site/content.js`.
- Los documentos viejos de `docs/` que hablan de Hostinger o Railway están desactualizados en ese punto.

Como cada push a `main` se publica solo, subir cambios terminados y probados.

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm run check    # lint + build (lo mismo que corre el CI)
npm run preview  # ver el build
```

## Dónde cambiar cada cosa

- Textos (ES e IT), servicios, casos y datos de contacto: `src/site/content.js`. Siempre actualizar los dos idiomas.
- Estructura de la portada: `src/site/HomePage.jsx`.
- Encabezado, pie y botón de WhatsApp: `src/site/Layout.jsx`.
- Estilos: `src/site/site.css` (todo con prefijo `site-` o bajo `.site`, para no afectar al CRM).
- Rutas: `src/App.jsx`.
- Imágenes de casos: `public/projects/`. Logo: `public/brand/`. Foto: `public/team/`.

## Reglas

- Seguir `docs/brand.md` (colores, tono, logo, componentes).
- Voseo en español, tuteo en italiano.
- No inventar resultados, cifras ni testimonios de clientes.
- No agregar formularios, cookies, analítica ni servicios externos sin actualizar la política de privacidad.
- No cargar fuentes desde Google; Sora se sirve con `@fontsource-variable/sora`.
- Antes de subir: `npm run check` sin errores y revisar en celular (390 px) y escritorio.
