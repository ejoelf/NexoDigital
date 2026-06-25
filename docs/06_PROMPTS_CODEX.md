# Prompts para Codex — NexoDigital

Versión: 1.0

---

## 1. Regla principal

No pedir a Codex que haga todo el proyecto de una sola vez. Usar prompts por bloque, revisar resultado, probar build y recién después pasar al siguiente bloque.

---

## 2. Prompt inicial de lectura

```txt
Leé todos los documentos dentro de la carpeta /docs del repositorio NexoDigital.
No modifiques código todavía.
Después de leerlos, respondé con:
1. resumen del objetivo del proyecto;
2. estructura actual detectada;
3. fases de trabajo sugeridas;
4. dudas o riesgos técnicos antes de tocar código.
```

---

## 3. Prompt Fase 0 — Diagnóstico

```txt
Analizá el repositorio actual de NexoDigital.
Revisá estructura, componentes, estilos, assets, package.json y formulario.
No hagas cambios todavía.
Entregá un diagnóstico con puntos buenos, problemas, mejoras prioritarias y riesgos.
```

---

## 4. Prompt Fase 1 — Web premium

```txt
Trabajá solo sobre la web pública actual.
Objetivo: darle un tono más premium, profesional y tecnológico a NexoDigital.
Mejorá Hero, About y Services sin cambiar el stack.
Mantené React + Vite + CSS por componente.
No agregues backend.
Al terminar, asegurate de que npm run build funcione.
```

---

## 5. Prompt Fase 2 — Trabajos realizados

```txt
Creá o refactorizá la sección de trabajos realizados.
Mové la data de proyectos a src/data/works.js.
Cada trabajo debe permitir: título, cliente, rubro, categoría, descripción, imagen, URL, tecnologías, estado, destacado y visibilidad.
Mostrá botón solo cuando exista una URL real.
No conectes backend todavía.
```

---

## 6. Prompt Fase 3 — Ecosistema NexoDigital

```txt
Agregá una sección Ecosistema NexoDigital.
Debe mostrar NexoDigital Studio, NexoDigital SaaS, NexoDigital Admin, NexoDigital Security y NexoDigital Labs.
La sección debe explicar que NexoDigital es una empresa madre de productos, servicios y plataformas.
Mantené coherencia visual con el resto de la web.
```

---

## 7. Prompt Fase 4 — Proceso y tecnologías

```txt
Agregá secciones de proceso de trabajo y tecnologías utilizadas.
El proceso debe explicar cómo NexoDigital analiza, diseña, desarrolla, prueba, publica y mejora proyectos.
La sección de tecnologías debe mostrar el stack actual y proveedores preferidos sin sobrecargar la interfaz.
```

---

## 8. Prompt Fase 5 — Diseño técnico CRM

```txt
No programes todavía el backend.
Diseñá la arquitectura técnica del CRM interno NexoDigital.
Definí módulos, rutas frontend, entidades principales, roles y endpoints futuros.
Entregá una propuesta en markdown dentro de /docs antes de crear código.
```

---

## 9. Prompt Fase 6 — Backend CRM V1

```txt
Ahora sí crear backend inicial del CRM en una carpeta separada.
Stack: Node.js, Express, Prisma, PostgreSQL y JWT.
Módulos iniciales: auth, usuarios internos, clientes, proyectos, trabajos realizados, proveedores y suscripciones.
No mezcles lógica de frontend en backend.
Documentá variables de entorno necesarias en un .env.example.
```

---

## 10. Prompt Fase 7 — Panel CRM frontend

```txt
Crear panel interno NexoDigital conectado al backend.
Pantallas iniciales: login, dashboard, clientes, proyectos, trabajos realizados, proveedores, suscripciones y configuración.
Debe tener estética SaaS premium, responsive y preparada para modo claro/oscuro.
```

---

## 11. Prompt de revisión final por fase

```txt
Revisá los cambios realizados en esta fase.
Confirmá:
1. archivos modificados;
2. qué se agregó;
3. qué quedó pendiente;
4. si npm run build funciona;
5. riesgos o mejoras futuras.
No avances a otra fase sin aprobación.
```
