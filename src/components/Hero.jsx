import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import "../styles/Hero.css";

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="inicio" className="hero">
      <div className="hero-inner">
        <Motion.div
          className="hero-text"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="hero-kicker">Web, software, CRM e IA para negocios</p>

          <h1 className="hero-title">
            Creamos tecnología para que tu negocio venda mejor, se ordene y
            pueda escalar.
          </h1>

          <p className="hero-subtitle">
            NexoDigital diseña y desarrolla webs profesionales, sistemas a
            medida, CRMs y automatizaciones con IA para negocios que necesitan
            operar con más claridad y convertir mejor.
          </p>

          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">
              Agendar diagnóstico
            </a>
            <a href="#portfolio" className="btn btn-outline">
              Ver trabajos
            </a>
          </div>

          <ul className="hero-trust">
            <li>
              <span className="hero-trust-dot" aria-hidden="true" />
              Análisis antes de desarrollar
            </li>
            <li>
              <span className="hero-trust-dot" aria-hidden="true" />
              Soluciones preparadas para crecer
            </li>
            <li>
              <span className="hero-trust-dot" aria-hidden="true" />
              Comunicación clara desde el inicio
            </li>
          </ul>

          <p className="hero-note">
            No trabajamos como una agencia genérica: pensamos cada proyecto
            como una pieza del sistema digital que sostiene tu negocio.
          </p>
        </Motion.div>

        <Motion.div
          className="hero-card-wrapper"
          initial={reduceMotion ? false : { opacity: 0, x: 40 }}
          whileInView={reduceMotion ? false : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-brand">
                <img
                  src="/brand/nexodigital-isotipo.svg"
                  alt=""
                  aria-hidden="true"
                />
                Centro digital NexoDigital
              </span>
              <span className="hero-card-pill">
                <span className="hero-card-dot" aria-hidden="true" />
                En evolución
              </span>
            </div>

            <div className="hero-card-body">
              <div className="hero-card-block hero-card-block-main">
                <p className="hero-card-title">Web + CRM + automatización</p>
                <p className="hero-card-text">
                  Una base digital conectada para captar consultas, ordenar
                  clientes y automatizar tareas repetitivas.
                </p>
              </div>

              <div className="hero-metrics">
                <div>
                  <span className="hero-metric-value">01</span>
                  <span className="hero-metric-label">Presencia</span>
                </div>
                <div>
                  <span className="hero-metric-value">02</span>
                  <span className="hero-metric-label">Gestión</span>
                </div>
                <div>
                  <span className="hero-metric-value">03</span>
                  <span className="hero-metric-label">Escala</span>
                </div>
              </div>

              <div className="hero-card-grid">
                <div className="hero-card-block">
                  <p className="hero-card-label">Webs que convierten</p>
                  <p className="hero-card-small">
                    Experiencias claras, rápidas y orientadas a consulta real.
                  </p>
                </div>

                <div className="hero-card-block">
                  <p className="hero-card-label">IA aplicada</p>
                  <p className="hero-card-small">
                    Flujos simples para ahorrar tiempo sin perder control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

export default Hero;
