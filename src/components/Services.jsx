import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import "../styles/Services.css";

const SERVICE_GROUPS = [
  {
    id: "presence",
    number: "01",
    label: "Presencia digital",
    title: "Diseño que transmite valor y convierte atención en oportunidades.",
    description:
      "Creamos experiencias claras, rápidas y adaptadas a cada pantalla para que tu marca se vea profesional y sea fácil de elegir.",
    services: ["Diseño web", "Desarrollo web", "Apps móviles"],
    result: "Una presencia digital preparada para atraer, explicar y convertir.",
    icon: "window",
  },
  {
    id: "software",
    number: "02",
    label: "Software para operar",
    title: "Herramientas creadas alrededor de la forma real de trabajar de tu negocio.",
    description:
      "Transformamos procesos, clientes, servicios y datos en sistemas simples de usar, con control centralizado y espacio para crecer.",
    services: ["Paneles CRM", "Software a medida", "Plataformas SaaS"],
    result: "Más orden operativo, trazabilidad y autonomía para el equipo.",
    icon: "layers",
  },
  {
    id: "intelligence",
    number: "03",
    label: "Inteligencia y automatización",
    title: "Menos tareas repetitivas. Más tiempo para decidir y hacer crecer el negocio.",
    description:
      "Conectamos herramientas, automatizamos flujos e integramos inteligencia artificial donde puede acelerar respuestas, análisis y operaciones.",
    services: ["Automatizaciones", "Integración de IA"],
    result: "Procesos conectados que trabajan con vos, sin perder control humano.",
    icon: "nodes",
  },
  {
    id: "growth",
    number: "04",
    label: "Crecimiento digital",
    title: "Una comunicación coherente para ganar visibilidad y construir confianza.",
    description:
      "Diseñamos la estrategia, el contenido y las acciones digitales necesarias para que tu marca se mantenga activa y llegue a mejores oportunidades.",
    services: ["Manejo de redes sociales", "Marketing digital"],
    result: "Una marca consistente, visible y orientada a objetivos comerciales.",
    icon: "growth",
  },
];

function ServiceIcon({ type }) {
  const commonProps = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "window") {
    return (
      <svg {...commonProps}>
        <rect x="4" y="6" width="24" height="20" rx="4" />
        <path d="M4 12h24" />
        <path d="M9 9h.01M13 9h.01M17 9h.01" />
        <path d="M9 18h6M9 22h10M21 17v6" />
      </svg>
    );
  }

  if (type === "layers") {
    return (
      <svg {...commonProps}>
        <path d="m16 4 12 6-12 6L4 10l12-6Z" />
        <path d="m6 15 10 5 10-5" />
        <path d="m6 20 10 5 10-5" />
      </svg>
    );
  }

  if (type === "nodes") {
    return (
      <svg {...commonProps}>
        <circle cx="16" cy="16" r="4" />
        <circle cx="7" cy="8" r="2.5" />
        <circle cx="25" cy="8" r="2.5" />
        <circle cx="7" cy="24" r="2.5" />
        <circle cx="25" cy="24" r="2.5" />
        <path d="m10 10 3 3M22 10l-3 3M10 22l3-3M22 22l-3-3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M5 25V14" />
      <path d="M12 25V9" />
      <path d="M19 25V16" />
      <path d="M26 25V5" />
      <path d="m5 10 7-4 7 5 7-7" />
      <path d="M22 4h4v4" />
    </svg>
  );
}

function Services() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="servicios" className="services-v2">
      <div className="services-v2-background" aria-hidden="true">
        <span className="services-v2-glow services-v2-glow--blue" />
        <span className="services-v2-glow services-v2-glow--cyan" />
      </div>

      <div className="services-v2-inner">
        <div className="services-v2-heading">
          <div>
            <p className="services-v2-eyebrow">Todo lo que tu negocio necesita para avanzar</p>
            <h2>
              No vendemos piezas sueltas. Creamos un sistema digital que
              <span className="nd-gradient-text"> trabaja conectado.</span>
            </h2>
          </div>

          <div className="services-v2-intro">
            <p>
              Desde la primera impresión de tu marca hasta las herramientas que
              sostienen la operación, NexoDigital combina estrategia, diseño,
              desarrollo y crecimiento en una misma visión.
            </p>
            <div className="services-v2-count">
              <strong>10</strong>
              <span>capacidades integradas</span>
            </div>
          </div>
        </div>

        <div className="services-v2-grid">
          {SERVICE_GROUPS.map((group, index) => (
            <Motion.article
              key={group.id}
              className={`services-v2-card services-v2-card--${group.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.62,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="services-v2-card-top">
                <span className="services-v2-icon">
                  <ServiceIcon type={group.icon} />
                </span>
                <span className="services-v2-number">{group.number}</span>
              </div>

              <p className="services-v2-label">{group.label}</p>
              <h3>{group.title}</h3>
              <p className="services-v2-description">{group.description}</p>

              <ul className="services-v2-list">
                {group.services.map((service) => (
                  <li key={service}>
                    <span aria-hidden="true">↗</span>
                    {service}
                  </li>
                ))}
              </ul>

              <div className="services-v2-result">
                <span className="services-v2-result-icon" aria-hidden="true">
                  ✓
                </span>
                <p>{group.result}</p>
              </div>
            </Motion.article>
          ))}
        </div>

        <Motion.div
          className="services-v2-journey"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="services-v2-journey-copy">
            <p className="services-v2-journey-kicker">Una estrategia, no diez proveedores</p>
            <h3>Conectamos cada punto del recorrido digital de tu negocio.</h3>
          </div>

          <div className="services-v2-flow" aria-label="Recorrido de valor">
            {[
              "Atraer",
              "Convertir",
              "Operar",
              "Automatizar",
              "Escalar",
            ].map((step, index, steps) => (
              <React.Fragment key={step}>
                <span>{step}</span>
                {index < steps.length - 1 && <i aria-hidden="true">→</i>}
              </React.Fragment>
            ))}
          </div>

          <a href="#contacto" className="btn btn-primary services-v2-action">
            Diseñar mi solución
            <span aria-hidden="true">↗</span>
          </a>
        </Motion.div>
      </div>
    </section>
  );
}

export default Services;
