# Arquitectura Web Pública — NexoDigital

Versión: 1.0

---

## 1. Objetivo

La web pública de NexoDigital debe evolucionar desde una landing ya creada hacia una página institucional premium, clara, moderna y preparada para convertir visitantes en clientes.

No se parte de cero. La base actual ya usa React, Vite, JavaScript, CSS por componente, Framer Motion y un formulario con PHP.

---

## 2. Estructura actual

La app actual renderiza estos bloques principales:

- Navbar.
- Hero.
- About.
- Services.
- Portfolio.
- Contact.
- Footer.

Esta estructura es válida como punto de partida, pero debe ampliarse con secciones más estratégicas.

---

## 3. Estructura recomendada

```txt
src/
  assets/
  components/
    Navbar.jsx
    Hero.jsx
    About.jsx
    Services.jsx
    Ecosystem.jsx
    WorkShowcase.jsx
    Process.jsx
    TechStack.jsx
    Contact.jsx
    Footer.jsx
  data/
    works.js
    services.js
    ecosystem.js
    technologies.js
  styles/
    variables.css
    global.css
    Hero.css
    Services.css
    WorkShowcase.css
    Ecosystem.css
    Process.css
    TechStack.css
```

---

## 4. Secciones finales sugeridas

### 4.1 Inicio / Hero

Debe explicar en pocos segundos qué hace NexoDigital:

> Creamos webs, sistemas, CRMs e inteligencia artificial para negocios que quieren crecer, ordenarse y vender mejor.

Debe incluir CTA principal y CTA secundario.

### 4.2 Qué es NexoDigital

Debe explicar que NexoDigital no es solo una agencia web. Es una empresa tecnológica que combina diseño, desarrollo, software, automatización, IA y operación digital.

### 4.3 Servicios

Servicios principales:

- Webs profesionales.
- Sistemas a medida.
- CRM para negocios.
- Automatización e IA aplicada.
- Integraciones.
- Mantenimiento e infraestructura.
- Seguridad digital básica futura.

### 4.4 Ecosistema

Debe mostrar las líneas internas:

- NexoDigital Studio.
- NexoDigital SaaS.
- NexoDigital Admin.
- NexoDigital Security.
- NexoDigital Labs.

### 4.5 Trabajos realizados

Debe reemplazar o evolucionar la sección Portfolio. Debe mostrar webs, sistemas, CRMs, SaaS y proyectos reales creados por NexoDigital.

### 4.6 Proceso de trabajo

Pasos recomendados:

1. Entendemos el negocio.
2. Definimos la solución.
3. Diseñamos la experiencia.
4. Desarrollamos.
5. Probamos.
6. Publicamos.
7. Mantenemos y mejoramos.

### 4.7 Tecnologías

Mostrar stack y proveedores usados por NexoDigital:

- React.
- Vite.
- Node.js.
- Express.
- PostgreSQL.
- Prisma.
- OpenAI API.
- GitHub.
- Hostinger.
- Railway.
- Neon.
- Supabase.
- Render / Vercel como alternativas futuras, no como deploy principal V1.

### 4.8 Contacto

Debe permitir consultas claras con campos para tipo de proyecto, rubro, ciudad, mensaje y forma de contacto.

---

## 5. Data local

Para preparar la futura conexión con CRM, los datos no deberían quedar mezclados dentro de los componentes.

Crear archivos de datos:

```txt
src/data/works.js
src/data/services.js
src/data/ecosystem.js
src/data/technologies.js
```

Luego estos datos podrán venir desde API.

---

## 6. Reglas visuales

- Diseño moderno y premium.
- Cards redondeadas.
- Mucho espacio visual.
- Buen contraste.
- Animaciones suaves.
- Responsive mobile-first.
- Modo claro y oscuro preparado.
- No sobrecargar con efectos.
- No usar textos enormes en pantalla inicial.

---

## 7. Criterio final

La web debe sentirse como la página oficial de una empresa tecnológica seria, no como una plantilla genérica. Debe transmitir confianza, visión, software, IA, orden y capacidad real de ejecución.
