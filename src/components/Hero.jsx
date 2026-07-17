import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import "../styles/Hero.css";

const TRUST_POINTS = [
  "Estrategia antes de diseñar",
  "Soluciones pensadas a medida",
  "Tecnología con propósito",
];

function Hero() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section id="inicio" className="hero">
      <div className="hero-background" aria-hidden="true">
        <span className="hero-background-orb hero-background-orb--blue" />
        <span className="hero-background-orb hero-background-orb--cyan" />
        <span className="hero-background-grid" />
      </div>

      <div className="hero-inner">
        <Motion.div
          className="hero-content"
          {...reveal}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-kicker">
            <span className="hero-kicker-dot" aria-hidden="true" />
            Agencia de transformación digital
          </p>

          <h1 className="hero-title">
            Creamos experiencias digitales que{" "}
            <span className="nd-gradient-text">hacen crecer tu negocio.</span>
          </h1>

          <p className="hero-subtitle">
            Diseñamos webs, aplicaciones, software, CRM y plataformas SaaS.
            Integramos automatizaciones, inteligencia artificial, marketing y
            redes sociales para construir una presencia digital conectada.
          </p>

          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary hero-primary-action">
              Contanos tu proyecto
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#servicios" className="btn hero-secondary-action">
              Explorar soluciones
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <ul className="hero-trust" aria-label="Principios de trabajo">
            {TRUST_POINTS.map((point) => (
              <li key={point}>
                <span className="hero-trust-icon" aria-hidden="true">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </Motion.div>

        <Motion.div
          className="hero-visual"
          initial={reduceMotion ? false : { opacity: 0, x: 42, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.86,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="hero-stage">
            <div className="hero-stage-halo" aria-hidden="true" />

            <Motion.div
              className="hero-floating-card hero-floating-card--automation"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -9, 0], rotate: [-1, 1, -1] }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="hero-floating-icon" aria-hidden="true">
                ⚡
              </span>
              <span>
                <strong>Automatización</strong>
                <small>Procesos conectados</small>
              </span>
              <span className="hero-floating-status">Activa</span>
            </Motion.div>

            <Motion.div
              className="hero-floating-card hero-floating-card--ai"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, 8, 0], rotate: [1, -1, 1] }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="hero-ai-symbol" aria-hidden="true">
                AI
              </span>
              <span>
                <strong>IA integrada</strong>
                <small>Respuestas y análisis</small>
              </span>
            </Motion.div>

            <div className="hero-dashboard">
              <div className="hero-browser-bar">
                <span className="hero-browser-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="hero-browser-address">
                  nexo.digital / command-center
                </span>
                <span className="hero-browser-live">
                  <i aria-hidden="true" />
                  conectado
                </span>
              </div>

              <div className="hero-dashboard-shell">
                <aside className="hero-dashboard-sidebar" aria-hidden="true">
                  <img
                    src="/brand/nexodigital-isotipo.svg"
                    alt=""
                    className="hero-dashboard-logo"
                  />
                  <span className="hero-sidebar-item hero-sidebar-item--active" />
                  <span className="hero-sidebar-item" />
                  <span className="hero-sidebar-item" />
                  <span className="hero-sidebar-item" />
                </aside>

                <div className="hero-dashboard-main">
                  <div className="hero-dashboard-heading">
                    <div>
                      <span>Centro de crecimiento</span>
                      <strong>Tu negocio, conectado.</strong>
                    </div>
                    <span className="hero-dashboard-chip">En tiempo real</span>
                  </div>

                  <div className="hero-dashboard-metrics">
                    <article>
                      <span>Presencia digital</span>
                      <strong>Activa</strong>
                      <small>Web, contenido y campañas</small>
                    </article>
                    <article>
                      <span>Operación</span>
                      <strong>Ordenada</strong>
                      <small>CRM y procesos internos</small>
                    </article>
                    <article>
                      <span>Automatización</span>
                      <strong>Conectada</strong>
                      <small>Menos tareas repetitivas</small>
                    </article>
                  </div>

                  <div className="hero-dashboard-lower">
                    <div className="hero-chart-card">
                      <div className="hero-card-heading">
                        <span>Impulso digital</span>
                        <small>ecosistema NexoDigital</small>
                      </div>
                      <div className="hero-chart" aria-hidden="true">
                        <span style={{ "--bar-height": "38%" }} />
                        <span style={{ "--bar-height": "52%" }} />
                        <span style={{ "--bar-height": "46%" }} />
                        <span style={{ "--bar-height": "68%" }} />
                        <span style={{ "--bar-height": "78%" }} />
                        <span style={{ "--bar-height": "90%" }} />
                      </div>
                    </div>

                    <div className="hero-activity-card">
                      <div className="hero-card-heading">
                        <span>Flujo conectado</span>
                        <small>últimas acciones</small>
                      </div>
                      <ul>
                        <li>
                          <i className="hero-activity-dot hero-activity-dot--blue" />
                          Nueva consulta captada
                        </li>
                        <li>
                          <i className="hero-activity-dot hero-activity-dot--cyan" />
                          CRM actualizado
                        </li>
                        <li>
                          <i className="hero-activity-dot hero-activity-dot--green" />
                          Seguimiento programado
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Motion.div
              className="hero-phone"
              animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="hero-phone-notch" aria-hidden="true" />
              <div className="hero-phone-screen">
                <div className="hero-phone-header">
                  <img src="/brand/nexodigital-isotipo.svg" alt="" />
                  <span>Experiencia móvil</span>
                </div>
                <div className="hero-phone-hero">
                  <span>Todo tu negocio</span>
                  <strong>en movimiento.</strong>
                </div>
                <div className="hero-phone-card">
                  <span>Próxima acción</span>
                  <strong>Seguimiento de oportunidad</strong>
                  <small>Automatizado y listo</small>
                </div>
                <div className="hero-phone-nav" aria-hidden="true">
                  <i />
                  <i className="hero-phone-nav-active" />
                  <i />
                </div>
              </div>
            </Motion.div>

            <div className="hero-stage-label" aria-hidden="true">
              <span>Web</span>
              <i />
              <span>Apps</span>
              <i />
              <span>CRM</span>
              <i />
              <span>IA</span>
            </div>
          </div>
        </Motion.div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span />
        Descubrí NexoDigital
      </div>
    </section>
  );
}

export default Hero;
