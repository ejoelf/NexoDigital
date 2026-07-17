# NexoDigital Visual System V2

Estado: base visual compartida para web pública, login y CRM privado.

## 1. Posicionamiento visual

NexoDigital debe percibirse como una agencia tecnológica premium orientada a transformación digital, no como un portfolio de desarrollador ni como una plantilla genérica de agencia web.

La experiencia debe comunicar:

- tecnología aplicada a negocios reales;
- confianza y profesionalismo;
- capacidad para diseñar webs, aplicaciones, CRM, software y SaaS;
- automatización e inteligencia artificial;
- cercanía comercial sin perder sofisticación.

## 2. Dirección estética

La identidad V2 se construye sobre:

- fondos grafito y azul muy oscuro;
- azul Nexo y cian Digital como acentos;
- superficies profundas con bordes finos;
- luces y glows controlados;
- tipografía grande, clara y geométrica;
- mockups de interfaces, software, móvil y automatizaciones;
- movimiento suave y narrativa progresiva durante el scroll.

El resultado debe sentirse premium, limpio y tecnológico. No debe convertirse en una interfaz saturada de neón.

## 3. Paleta

### Colores oficiales

- Azul Nexo: `#2563EB`.
- Cian Digital: `#06B6D4`.
- Grafito Profundo: `#0B1320`.
- Gris UI: `#1E293B`.
- Gris Claro: `#F3F5F7`.
- Blanco: `#FFFFFF`.

### Fondos V2

- Fondo profundo: `--nd-bg-deep`.
- Fondo principal oscuro: `--nd-bg`.
- Fondo grafito: `--nd-bg-soft`.
- Superficie: `--nd-surface`.
- Superficie elevada: `--nd-surface-raised`.
- Superficie translúcida: `--nd-surface-glass`.

### Regla de uso

El azul representa acción y confianza. El cian funciona como acento tecnológico y no debe dominar toda la interfaz. El violeta no forma parte de la dirección principal y solo podría aparecer en contenido visual puntual, nunca como sustituto de la paleta oficial.

## 4. Tipografía

Familia principal:

```css
font-family: "Sora", "Inter", system-ui, sans-serif;
```

Jerarquía recomendada:

- H1: fuerte, compacto y comercial.
- H2: títulos narrativos de sección.
- H3: títulos funcionales de cards y módulos.
- Texto: legible, con line-height amplio.
- Eyebrow: breve, mayúscula y con tracking controlado.

Los títulos pueden usar `letter-spacing` negativo para reforzar el carácter tecnológico. Los párrafos no deben ser excesivamente anchos.

## 5. Superficies y profundidad

La profundidad debe lograrse con:

- diferencia real entre fondo, superficie y superficie elevada;
- bordes translúcidos;
- una línea interior de luz sutil;
- sombras amplias y oscuras;
- glow azul o cian reservado para puntos protagonistas.

No usar sombras negras duras ni un glow intenso en todas las cards.

Clases base disponibles:

- `.nd-card`;
- `.nd-card--dark`;
- `.nd-panel`;
- `.nd-glass`;
- `.nd-tech-grid`;
- `.nd-glow`;
- `.nd-glow--cyan`.

## 6. Botones y formularios

### Botón primario

Gradiente oficial azul-cian, texto blanco y elevación moderada.

### Botón secundario

Superficie neutra o transparente con borde visible. En fondos oscuros se usa `.nd-button--ghost-dark`.

### Campos

Los campos privados y oscuros deben usar `.nd-field`, con foco azul visible y contraste suficiente.

Todos los controles interactivos deben mantener un área táctil mínima cercana a 44 px.

## 7. Movimiento

Tokens disponibles:

- `--nd-duration-fast`;
- `--nd-duration-normal`;
- `--nd-duration-slow`;
- `--nd-ease`;
- `--nd-ease-soft`;
- `--nd-reveal-distance`.

El movimiento debe ayudar a contar la historia:

- reveal suave de títulos y párrafos;
- stagger de cards;
- desplazamiento vertical corto;
- escalado muy leve en mockups;
- profundidad sutil en secciones sticky;
- microinteracciones en botones y superficies.

No usar rebotes, giros decorativos ni animaciones constantes sin función. `prefers-reduced-motion` debe desactivar el movimiento no esencial.

## 8. Aplicación en la web pública

La web pública será la experiencia más expresiva:

- Hero oscuro y de alto impacto.
- Interfaces y dispositivos como recursos visuales.
- Servicios explicados desde el valor para el negocio.
- Sección dedicada a IA y automatización.
- Trabajos realizados presentados como soluciones, no como listados de tecnologías.
- Scroll narrativo y progresivo.

Servicios que deben quedar representados:

- diseño web;
- desarrollo web;
- aplicaciones móviles;
- paneles CRM;
- software a medida;
- plataformas SaaS;
- automatizaciones;
- inteligencia artificial;
- redes sociales;
- marketing digital.

## 9. Aplicación en el login

El login debe sentirse como la puerta de acceso al mismo ecosistema:

- fondo oscuro;
- logo oficial;
- luces azul/cian discretas;
- formulario de alta legibilidad;
- estados de error y carga coherentes;
- mensaje claro de acceso privado.

No debe parecer una plantilla ajena a la web pública.

## 10. Aplicación en el CRM

El CRM compartirá identidad, pero priorizará operación y legibilidad:

- sidebar grafito;
- topbar limpia;
- superficies con contraste moderado;
- tablas y formularios funcionales;
- azul para acciones;
- cian para información y estados activos;
- colores semánticos únicamente cuando aporten significado.

Las animaciones del CRM serán mínimas. La interfaz debe ser rápida y predecible.

## 11. Elementos que deben evitarse

- apariencia de template genérico;
- exceso de violeta o fucsia;
- glow aplicado a todos los elementos;
- fondos completamente negros sin profundidad;
- cards repetidas sin jerarquía;
- grandes bloques de texto técnico;
- tecnologías como argumento principal para clientes;
- métricas, testimonios o resultados inventados;
- efectos pesados que degraden el rendimiento;
- movimiento que dificulte la lectura.

## 12. Compatibilidad durante la migración

`src/styles/base.css` conserva los aliases de la V1 (`--color-primary`, `--color-text`, `--radius-lg`, entre otros). Esto permite rediseñar por bloques sin romper la web pública o el CRM existente.

Los nuevos componentes deben priorizar tokens `--nd-*`. Los aliases heredados se retirarán únicamente después de completar y validar todo el rediseño.

## 13. Orden de implementación

1. Sistema visual V2.
2. Navbar, Hero y Footer con acceso al CRM.
3. Servicios y propuesta de valor.
4. IA y automatización.
5. Software, CRM y SaaS.
6. Trabajos, proceso y conversión.
7. Narrativa de scroll y responsive.
8. Login CRM.
9. Panel CRM.
10. Limpieza y validación integral.
