import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import "../styles/About.css";

const WORK_AREAS = [
  "Web comercial",
  "Software a medida",
  "CRM",
  "IA aplicada",
];

const PRINCIPLES = [
  "Análisis real antes de desarrollar.",
  "Soluciones pensadas para el flujo del negocio.",
  "Comunicación clara, entregas ordenadas y foco comercial.",
  "Base técnica preparada para mantenimiento y crecimiento.",
];

function About() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="sobre" className="section section-about">
      <div className="about-background" aria-hidden="true">
        <span className="about-grid-lines" />
        <span className="about-glow about-glow--blue" />
        <span className="about-glow about-glow--cyan" />
      </div>

      <div className="section-inner about-inner">
        <Motion.div
          className="about-text"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="about-eyebrow">Qué es NexoDigital</p>
          <h2 className="section-title">
            Una empresa tecnológica boutique para negocios que quieren{" "}
            <span>ordenar, vender y crecer.</span>
          </h2>

          <p className="about-lead">
            NexoDigital no nace para hacer páginas sueltas. Creamos presencia
            digital, software, CRMs, automatizaciones e integraciones que ayudan
            a que un negocio trabaje con más foco y menos fricción.
          </p>

          <div className="about-copy-grid">
            <p className="about-paragraph">
              Antes de diseñar o programar, entendemos cómo funciona el negocio:
              qué vende, cómo capta clientes, qué procesos se repiten y dónde se
              pierde tiempo.
            </p>
            <p className="about-paragraph">
              El objetivo es construir bases digitales mantenibles: webs que
              convierten, sistemas que ordenan e IA aplicada con criterio.
            </p>
          </div>

          <div className="about-tags" aria-label="Áreas de trabajo">
            {WORK_AREAS.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </Motion.div>

        <Motion.aside
          className="about-card"
          initial={reduceMotion ? false : { opacity: 0, x: 34, scale: 0.98 }}
          whileInView={
            reduceMotion ? undefined : { opacity: 1, x: 0, scale: 1 }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.76,
            delay: reduceMotion ? 0 : 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="about-card-top">
            <div>
              <p className="about-card-kicker">Forma de trabajo</p>
              <h3 className="about-card-title">
                Tecnología con criterio operativo
              </h3>
            </div>
            <span className="about-card-index">ND / 01</span>
          </div>

          <ul className="about-list">
            {PRINCIPLES.map((principle, index) => (
              <li key={principle}>
                <span className="about-list-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{principle}</span>
              </li>
            ))}
          </ul>

          <div className="about-card-footer">
            <span aria-hidden="true" />
            <p>Primero el negocio. Después, la solución adecuada.</p>
          </div>
        </Motion.aside>
      </div>
    </section>
  );
}

export default About;
