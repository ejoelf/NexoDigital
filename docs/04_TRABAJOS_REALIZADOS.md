# Módulo Trabajos Realizados — NexoDigital

Versión: 1.0

---

## Objetivo

Este módulo permitirá que NexoDigital cargue, ordene y muestre todas las páginas, sistemas, CRMs, SaaS y software que vaya creando.

Debe existir en dos lugares:

1. En el CRM interno, para administración privada.
2. En la web pública, para mostrar trabajos seleccionados.

---

## Uso interno

En el CRM, Joel podrá registrar cada trabajo terminado o en proceso. El módulo debe guardar información técnica, comercial y visual del proyecto.

---

## Uso público

En la web pública solo deben aparecer los trabajos marcados como visibles. Algunos proyectos podrán estar ocultos por ser internos, privados o incompletos.

---

## Campos recomendados

Cada trabajo debe tener:

- ID interno.
- Título.
- Cliente.
- Slug.
- Categoría.
- Rubro.
- Descripción corta.
- Descripción larga.
- Imagen principal.
- Galería.
- URL pública.
- Repositorio frontend.
- Repositorio backend.
- Tecnologías.
- Servicios incluidos.
- Estado.
- Fecha de publicación.
- Visible en web pública.
- Destacado.
- Orden de aparición.
- Notas internas.

---

## Categorías posibles

- Web institucional.
- Landing page.
- Web comercial.
- CRM interno.
- SaaS.
- Ecommerce.
- Sistema a medida.
- App.
- Automatización.
- Proyecto experimental.

---

## Estados posibles

- Idea.
- En análisis.
- En diseño.
- En desarrollo.
- En revisión.
- Publicado.
- En mantenimiento.
- Pausado.
- Cerrado.

---

## Trabajos iniciales sugeridos

Cargar inicialmente:

- NexoDigital.
- Nico Galicia Stylist Mens.
- Tapicería Líder.
- CF MetalPintura.
- Electricidad Zacarías.
- TurnosGo cuando corresponda.

Cada uno debe cargarse con su estado real.

---

## Relación con la web actual

Actualmente existe un componente `Portfolio.jsx` con proyectos cargados manualmente. Ese componente debe evolucionar hacia una sección más profesional.

Recomendación V1:

- Crear `src/data/works.js`.
- Mover los proyectos a ese archivo.
- Actualizar el componente para leer desde `works.js`.
- Agregar URL, tecnologías, categoría y estado.
- Mostrar botón solo si existe link real.

---

## Criterio visual

Cada trabajo debe mostrarse en una card premium con:

- imagen;
- título;
- rubro;
- tipo de proyecto;
- descripción breve;
- tecnologías;
- estado;
- botón ver proyecto si hay URL;
- botón caso de estudio futuro si existe página detalle.

---

## Futuro

Más adelante, el CRM debe permitir crear y editar trabajos realizados desde un panel privado. La web pública debe consumir esos datos desde una API y mostrar únicamente los trabajos marcados como públicos.
