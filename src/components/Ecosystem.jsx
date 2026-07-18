import React, { useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import "../styles/Ecosystem.css";

const SOLUTIONS = [
  {
    id: "crm",
    label: "Paneles CRM",
    eyebrow: "Clientes y operación",
    title: "Toda la relación con tus clientes en un solo lugar.",
    description:
      "Diseñamos paneles para ordenar consultas, oportunidades, clientes, tareas, proyectos y seguimiento comercial según la forma real de trabajar de tu negocio.",
    capabilities: [
      "Seguimiento comercial",
      "Clientes y contactos",
      "Proyectos y tareas",
      "Alertas y renovaciones",
    ],
    outcomes: [
      "Más claridad sobre cada oportunidad",
      "Información compartida y ordenada",
      "Menos seguimiento manual",
    ],
  },
  {
    id: "software",
    label: "Software a medida",
    eyebrow: "Procesos propios",
    title: "Una herramienta construida alrededor de tu operación.",
    description:
      "Cuando una planilla o una plataforma genérica ya no alcanza, creamos software que refleja tus procesos, reglas, usuarios y necesidades sin obligarte a adaptar el negocio a una plantilla.",
    capabilities: [
      "Gestión interna",
      "Inventarios y pedidos",
      "Turnos y servicios",
      "Reportes operativos",
    ],
    outcomes: [
      "Procesos centralizados",
      "Menos tareas duplicadas",
      "Base preparada para evolucionar",
    ],
  },
  {
    id: "apps",
    label: "Apps móviles",
    eyebrow: "Experiencia en movimiento",
    title: "Tu servicio disponible donde están tus usuarios.",
    description:
      "Creamos aplicaciones móviles para clientes, equipos o comunidades, conectadas con la operación del negocio y diseñadas para que las acciones importantes sean simples y rápidas.",
    capabilities: [
      "Reservas y turnos",
      "Área de clientes",
      "Notificaciones",
      "Servicios y beneficios",
    ],
    outcomes: [
      "Acceso directo desde el móvil",
      "Experiencia más cómoda",
      "Mayor continuidad entre canales",
    ],
  },
  {
    id: "saas",
    label: "Plataformas SaaS",
    eyebrow: "Productos digitales",
    title: "Convertimos una idea de negocio en una plataforma escalable.",
    description:
      "Diseñamos productos digitales por suscripción con cuentas, planes, permisos, paneles e infraestructura preparada para atender a distintos clientes desde una misma plataforma.",
    capabilities: [
      "Cuentas y permisos",
      "Planes y suscripciones",
      "Panel administrativo",
      "Operación multiempresa",
    ],
    outcomes: [
      "Producto digital comercializable",
      "Operación centralizada",
      "Crecimiento por etapas",
    ],
  },
];

const PRINCIPLES = [
  {
    title: "Diseñado para el negocio",
    text: "La interfaz nace del proceso que necesita resolver, no de una plantilla cerrada.",
  },
  {
    title: "Conectado desde el inicio",
    text: "Web, CRM, app, automatizaciones y datos pueden formar una misma operación.",
  },
  {
    title: "Preparado para evolucionar",
    text: "Construimos una base que permita agregar funciones sin rehacer todo el proyecto.",
  },
  {
    title: "Simple para quien lo usa",
    text: "La complejidad técnica queda detrás de una experiencia clara y cotidiana.",
  },
];

function SolutionIcon({ type }) {
  if (type === "crm") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M8 9h8M8 13h5M7 17h2" />
      </svg>
    );
  }

  if (type === "software") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 8h3v3H8zM13 8h3M13 11h3M8 14h8M8 17h5" />
      </svg>
    );
  }

  if (type === "apps") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="3" />
        <path d="M10 5h4M11 18h2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
      <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </svg>
  );
}

function CrmPreview() {
  return (
    <div className="solution-ui solution-ui--crm">
      <div className="solution-ui-sidebar">
        <span className="solution-ui-brand">
          <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
        </span>
        <span className="solution-ui-nav solution-ui-nav--active" />
        <span className="solution-ui-nav" />
        <span className="solution-ui-nav" />
        <span className="solution-ui-nav" />
      </div>

      <div className="solution-ui-main">
        <div className="solution-ui-heading">
          <div>
            <span>Centro de clientes</span>
            <strong>Seguimiento comercial</strong>
          </div>
          <button type="button" tabIndex="-1">
            Nueva oportunidad
          </button>
        </div>

        <div className="crm-summary-row">
          <div>
            <span>Consultas</span>
            <i className="crm-summary-line crm-summary-line--blue" />
          </div>
          <div>
            <span>Propuestas</span>
            <i className="crm-summary-line crm-summary-line--cyan" />
          </div>
          <div>
            <span>Seguimiento</span>
            <i className="crm-summary-line crm-summary-line--soft" />
          </div>
        </div>

        <div className="crm-board">
          {["Nueva consulta", "Propuesta", "En seguimiento"].map(
            (column, columnIndex) => (
              <div className="crm-column" key={column}>
                <span className="crm-column-title">{column}</span>
                {[0, 1].map((card) => (
                  <div className="crm-mini-card" key={`${column}-${card}`}>
                    <i />
                    <span />
                    <small
                      className={`crm-mini-status crm-mini-status--${
                        (columnIndex + card) % 3
                      }`}
                    />
                  </div>
                ))}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function SoftwarePreview() {
  const modules = [
    ["01", "Ingreso", "Pedidos y solicitudes"],
    ["02", "Operación", "Tareas y responsables"],
    ["03", "Control", "Estados y validaciones"],
    ["04", "Información", "Reportes y decisiones"],
  ];

  return (
    <div className="solution-ui solution-ui--software">
      <div className="software-toolbar">
        <span>
          <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
          Sistema operativo
        </span>
        <div>
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="software-process">
        {modules.map(([number, title, text], index) => (
          <React.Fragment key={number}>
            <div className="software-module">
              <span>{number}</span>
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
            {index < modules.length - 1 && (
              <div className="software-connector" aria-hidden="true">
                <i />
                <i />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="software-bottom-grid">
        <div className="software-activity">
          <span>Actividad del proceso</span>
          {[72, 48, 84, 61, 92, 68, 78].map((height, index) => (
            <i key={`${height}-${index}`} style={{ "--bar-height": `${height}%` }} />
          ))}
        </div>
        <div className="software-checks">
          <span>Reglas operativas</span>
          <p><i /> Validación automática</p>
          <p><i /> Permisos por usuario</p>
          <p><i /> Historial de cambios</p>
        </div>
      </div>
    </div>
  );
}

function AppsPreview() {
  return (
    <div className="solution-ui solution-ui--apps">
      <div className="app-phone app-phone--primary">
        <div className="app-phone-speaker" />
        <div className="app-phone-header">
          <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
          <span>Mi cuenta</span>
          <i />
        </div>
        <div className="app-phone-welcome">
          <small>Hola</small>
          <strong>¿Qué necesitás hoy?</strong>
        </div>
        <div className="app-phone-actions">
          <span><i>01</i> Reservar</span>
          <span><i>02</i> Mis turnos</span>
        </div>
        <div className="app-phone-card">
          <small>Próxima actividad</small>
          <strong>Servicio confirmado</strong>
          <span>Ver detalles →</span>
        </div>
        <div className="app-phone-nav"><i /><i /><i /></div>
      </div>

      <div className="app-phone app-phone--secondary">
        <div className="app-phone-speaker" />
        <div className="app-secondary-hero">
          <span>Beneficios</span>
          <strong>Todo tu servicio en una sola app.</strong>
        </div>
        <div className="app-secondary-list">
          <p><i /> Notificaciones importantes</p>
          <p><i /> Historial y preferencias</p>
          <p><i /> Contacto directo</p>
        </div>
      </div>

      <div className="app-floating-message">
        <i aria-hidden="true">✓</i>
        <span><strong>Acción completada</strong><small>La operación quedó sincronizada</small></span>
      </div>
    </div>
  );
}

function SaasPreview() {
  return (
    <div className="solution-ui solution-ui--saas">
      <div className="saas-topbar">
        <span>
          <img src="/brand/nexodigital-isotipo.svg" alt="" aria-hidden="true" />
          Plataforma central
        </span>
        <div className="saas-account"><i /> Cuenta principal</div>
      </div>

      <div className="saas-layout">
        <div className="saas-navigation">
          <span className="saas-nav-active">Resumen</span>
          <span>Clientes</span>
          <span>Planes</span>
          <span>Operación</span>
          <span>Configuración</span>
        </div>

        <div className="saas-content">
          <div className="saas-heading">
            <div><small>Producto digital</small><strong>Operación multiempresa</strong></div>
            <button type="button" tabIndex="-1">Crear cuenta</button>
          </div>

          <div className="saas-cards">
            <div><span>Cuentas</span><i className="saas-visual saas-visual--blue" /></div>
            <div><span>Planes</span><i className="saas-visual saas-visual--cyan" /></div>
            <div><span>Actividad</span><i className="saas-visual saas-visual--mixed" /></div>
          </div>

          <div className="saas-table">
            <div className="saas-table-head"><span>Organización</span><span>Plan</span><span>Estado</span></div>
            {["Cuenta norte", "Cuenta centro", "Cuenta sur"].map((name, index) => (
              <div className="saas-table-row" key={name}>
                <span><i />{name}</span>
                <span>{index === 1 ? "Profesional" : "Esencial"}</span>
                <span><b /> Activa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionPreview({ activeId }) {
  if (activeId === "software") return <SoftwarePreview />;
  if (activeId === "apps") return <AppsPreview />;
  if (activeId === "saas") return <SaasPreview />;
  return <CrmPreview />;
}

function Ecosystem() {
  const [activeId, setActiveId] = useState(SOLUTIONS[0].id);
  const reduceMotion = useReducedMotion();
  const activeSolution = SOLUTIONS.find((solution) => solution.id === activeId);

  return (
    <section
      id="ecosistema"
      className="section section-ecosystem"
      aria-labelledby="ecosystem-title"
    >
      <div className="ecosystem-background" aria-hidden="true">
        <span className="ecosystem-background-grid" />
        <span className="ecosystem-background-glow" />
      </div>

      <div className="section-inner ecosystem-inner">
        <Motion.div
          className="ecosystem-header"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="ecosystem-eyebrow">Software y productos digitales</p>
            <h2 id="ecosystem-title" className="section-title">
              Tecnología que se adapta a tu negocio,{" "}
              <span>no al revés.</span>
            </h2>
          </div>

          <div className="ecosystem-intro-wrap">
            <p className="ecosystem-intro">
              Creamos herramientas digitales conectadas para organizar la
              operación, mejorar la experiencia de tus clientes o transformar
              una idea en un producto que pueda crecer.
            </p>
            <a href="#contacto" className="ecosystem-header-link">
              Pensar una solución juntos <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Motion.div>

        <Motion.div
          className="ecosystem-lab"
          initial={reduceMotion ? false : { opacity: 0, y: 38 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ecosystem-selector">
            <div className="ecosystem-selector-heading">
              <span>Soluciones que construimos</span>
              <small>Elegí una categoría para explorarla.</small>
            </div>

            <div className="ecosystem-tabs" role="tablist" aria-label="Tipos de soluciones digitales">
              {SOLUTIONS.map((solution, index) => {
                const isActive = activeId === solution.id;

                return (
                  <button
                    key={solution.id}
                    id={`solution-tab-${solution.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`solution-panel-${solution.id}`}
                    className={`ecosystem-tab ${isActive ? "ecosystem-tab--active" : ""}`}
                    onClick={() => setActiveId(solution.id)}
                  >
                    <span className="ecosystem-tab-index">0{index + 1}</span>
                    <span className="ecosystem-tab-icon">
                      <SolutionIcon type={solution.id} />
                    </span>
                    <span className="ecosystem-tab-copy">
                      <strong>{solution.label}</strong>
                      <small>{solution.eyebrow}</small>
                    </span>
                    <span className="ecosystem-tab-arrow" aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>

            <div className="ecosystem-selector-note">
              <span aria-hidden="true">+</span>
              <p>
                Una solución puede combinar varias categorías y conectarse con
                tu web, automatizaciones, marketing o herramientas actuales.
              </p>
            </div>
          </div>

          <div className="ecosystem-stage">
            <div className="ecosystem-stage-topbar">
              <span className="ecosystem-stage-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="ecosystem-stage-label">NexoDigital · Solution Lab</span>
              <span className="ecosystem-stage-status"><i /> Diseño conectado</span>
            </div>

            <AnimatePresence mode="wait">
              <Motion.div
                key={activeSolution.id}
                id={`solution-panel-${activeSolution.id}`}
                role="tabpanel"
                aria-labelledby={`solution-tab-${activeSolution.id}`}
                className="ecosystem-active"
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="ecosystem-active-copy">
                  <p>{activeSolution.eyebrow}</p>
                  <h3>{activeSolution.title}</h3>
                  <span>{activeSolution.description}</span>
                </div>

                <div className="ecosystem-preview">
                  <SolutionPreview activeId={activeSolution.id} />
                </div>

                <div className="ecosystem-active-details">
                  <div className="ecosystem-capabilities">
                    <small>Puede incluir</small>
                    <div>
                      {activeSolution.capabilities.map((capability) => (
                        <span key={capability}>{capability}</span>
                      ))}
                    </div>
                  </div>

                  <div className="ecosystem-outcomes">
                    <small>Valor para el negocio</small>
                    <ul>
                      {activeSolution.outcomes.map((outcome) => (
                        <li key={outcome}><i aria-hidden="true">✓</i>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>
        </Motion.div>

        <div className="ecosystem-principles">
          {PRINCIPLES.map((principle, index) => (
            <Motion.article
              key={principle.title}
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <span>0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ecosystem;
