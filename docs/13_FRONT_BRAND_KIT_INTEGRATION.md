# FRONT 0 - Integracion del Brand Kit Oficial

## Objetivo

Unificar las reglas visuales de NexoDigital para que la web publica actual y el futuro panel privado del CRM usen una misma identidad: tecnologica, clara, confiable y premium, sin perder cercania para pymes.

Esta fase no rediseña la web ni crea el panel privado. Deja documentada la base visual y prepara tokens CSS minimos.

## Resumen del Brand Kit

El Brand Kit oficial se encuentra en `assets/branding/` y define:

- concepto visual basado en nexo, conexion, puente y ecosistema;
- isotipo construido como una N geometrica modular;
- paleta azul/cian/grafito;
- tipografia recomendada Sora;
- usos correctos e incorrectos del logo;
- assets para sitio web, CRM, redes, favicon, app icon y presentaciones.

## Assets principales detectados

### Logos SVG

- `assets/branding/logos/svg/nexodigital-logo-horizontal.svg`
  - Logo principal.
  - Uso recomendado: navbar desktop, footer, propuestas, encabezados institucionales.

- `assets/branding/logos/svg/nexodigital-isotipo.svg`
  - Simbolo sin texto.
  - Uso recomendado: espacios reducidos, loaders, sidebar colapsada, favicon alternativo, GitHub.

- `assets/branding/logos/svg/nexodigital-logo-vertical.svg`
  - Version centrada/institucional.
  - Uso recomendado: login del CRM, portadas, pantallas vacias o presentaciones.

- `assets/branding/logos/svg/nexodigital-monochrome-black.svg`
  - Version monocromatica negra.
  - Uso recomendado: documentos, fondos claros o piezas donde el gradiente no sea conveniente.

- `assets/branding/logos/svg/nexodigital-monochrome-white.svg`
  - Version monocromatica blanca.
  - Uso recomendado: fondos grafito, hero oscuro, sidebar oscura, footer oscuro.

### Iconos y redes

- `assets/branding/logos/favicon/favicon.svg`
  - Favicon oficial.
  - Se preparo una copia publica en `public/favicon.svg` para el build Vite.

- `assets/branding/icons/app-icon.svg`
  - Icono de aplicacion.
  - Uso recomendado: PWA futura, launcher de app, icono del CRM.

- `assets/branding/social/avatar.svg`
  - Avatar social circular.
  - Uso recomendado: redes sociales, perfiles, GitHub/org avatar.

## Uso recomendado en la web publica

- Navbar:
  - Usar preferentemente el logo horizontal.
  - Mantener altura moderada y buena area de seguridad.
  - En mobile puede usarse isotipo + texto si el ancho no permite el logo completo.

- Footer:
  - Usar logo horizontal o monocromatico blanco si el footer es oscuro.
  - Evitar repetir demasiadas variantes del logo en la misma pantalla.

- Favicon:
  - Usar `public/favicon.svg`.
  - Mantener `theme-color` en `#2563EB`.

- Hero y CTAs:
  - Azul Nexo para accion principal.
  - Cian Digital solo como acento o gradiente controlado.
  - Grafito para bloques premium o contraste fuerte.

## Uso recomendado en el panel privado

- Login:
  - Usar logo vertical o logo horizontal centrado.
  - Fondo claro con acento azul/cian, o fondo grafito con logo blanco.

- Sidebar:
  - Expandida: logo horizontal o wordmark.
  - Colapsada: isotipo.
  - En sidebar oscura usar version blanca o isotipo con contraste suficiente.

- Header interno:
  - Usar isotipo pequeño o nombre NexoDigital Admin.
  - Priorizar legibilidad y densidad operativa sobre decoracion.

- Dashboard:
  - Fondos claros y superficies blancas para datos.
  - Grafito para textos principales.
  - Azul para acciones, cian para estados activos/acento.

## Reglas de color

Paleta oficial:

```css
--brand-blue: #2563eb;
--brand-cyan: #06b6d4;
--brand-graphite: #0b1320;
--brand-slate: #1e293b;
--brand-light: #f3f5f7;
--brand-white: #ffffff;
--brand-gradient: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
```

Reglas:

- Azul Nexo: botones principales, links activos, foco, estados de accion.
- Cian Digital: acentos, detalles tecnologicos, estados activos secundarios.
- Grafito Profundo: texto principal, fondos premium, sidebar futura.
- Gris UI / slate: textos secundarios, bordes oscuros, paneles.
- Gris claro: fondos neutrales.
- Blanco: superficies, tarjetas, contraste.

Evitar:

- Cian como texto pequeño sobre blanco.
- Paletas dominadas por un solo azul sin neutros.
- Gradientes excesivos en todos los componentes.
- Fondos oscuros sin contraste suficiente.

## Reglas tipograficas

Tipografia principal recomendada:

```css
--font-brand: "Sora", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Uso:

- Titulos: Sora Bold o fallback equivalente.
- Subtitulos: Sora SemiBold.
- Interfaz y dashboard: Sora/Inter Regular o Medium.
- Botones y chips: Medium/SemiBold.

Nota de implementacion:

- La documentacion original del Brand Kit sugiere letter-spacing negativo para titulares.
- En la implementacion web/app se recomienda mantener `letter-spacing: 0` en UI general para evitar problemas responsive y conservar legibilidad. El wordmark SVG ya controla su propia composicion.

## Tokens CSS preparados

Se actualizaron tokens base en `src/styles/base.css`:

```css
--brand-blue: #2563eb;
--brand-cyan: #06b6d4;
--brand-graphite: #0b1320;
--brand-slate: #1e293b;
--brand-light: #f3f5f7;
--brand-white: #ffffff;
--brand-gradient: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
--color-bg: var(--brand-light);
--color-surface: var(--brand-white);
--color-surface-dark: var(--brand-graphite);
--color-primary: var(--brand-blue);
--color-primary-dark: #1d4ed8;
--color-accent: var(--brand-cyan);
--color-text: var(--brand-graphite);
--color-text-muted: #475569;
--color-border: #dbe3ea;
--color-focus: rgba(37, 99, 235, 0.32);
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 24px;
--shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
--shadow-card: 0 10px 30px rgba(15, 23, 42, 0.06);
--shadow-brand: 0 18px 42px rgba(37, 99, 235, 0.22);
--font-brand: "Sora", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Los tokens anteriores compatibles (`--color-primary`, `--color-text`, etc.) se mantienen para no romper estilos existentes.

## Uso recomendado del logo por zona

- Navbar web publica: `nexodigital-logo-horizontal.svg`.
- Footer web publica: horizontal sobre claro o monocromatico blanco sobre oscuro.
- Login CRM: `nexodigital-logo-vertical.svg` o horizontal centrado.
- Sidebar CRM: horizontal expandido, isotipo colapsado.
- Favicon: `public/favicon.svg`, derivado del favicon oficial.
- App icon: `assets/branding/icons/app-icon.svg`.
- Avatar social: `assets/branding/social/avatar.svg`.

## Que NO debe hacerse

- No estirar, rotar ni deformar el logo.
- No cambiar colores oficiales sin una razon de contraste o contexto.
- No usar sombras exageradas sobre el logo.
- No encerrar el isotipo en formas nuevas no previstas.
- No usar el isotipo como patron decorativo sin control visual.
- No mezclar multiples estilos de logo en una misma vista.
- No hacer el panel CRM como landing visual decorativa; debe ser operativo, claro y denso.
- No usar cian para textos largos o pequeños sobre blanco.
- No cargar assets desde `assets/branding/` directamente en produccion si Vite no los copia al build; usar `public/` o imports gestionados por Vite.

## Proximos pasos

1. FRONT 1: alinear navbar/footer de la web publica con logo SVG oficial.
2. Revisar si conviene incorporar Sora via fuente local o proveedor externo.
3. Crear layout base del panel privado usando tokens de `base.css`.
4. Definir componentes base del CRM: sidebar, topbar, cards, tables, chips, buttons y estados.
5. Definir estrategia de assets publicos: copiar a `public/brand/` o importar desde `src` segun uso.
6. Preparar favicon/app icons finales para produccion.
