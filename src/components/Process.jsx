import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { processSteps } from "../data/process";
import "../styles/Process.css";

function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="proceso"
      className="section section-process"
      aria-labelledby="process-title"
    >
      <div className="process-background" aria-hidden="true">
        <span className="process-grid" />
        <span className="process-glow process-glow--blue" />
        <span className="process-glow process-glow--cyan" />
      </div>

      <div className="section-inner process-inner">
        <Motion.div
          className="process-header"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="process-heading">
            <p className="process-eyebrow">Cómo trabajamos</p>
            <h2 id="process-title" className="section-title">
              Una idea clara, un proceso ordenado y una solución que{" "}
              <span>puede crecer.</span>
            </h2>
          </div>

          <div className="process-intro">
            <p>
              No empezamos eligiendo una tecnología. Empezamos entendiendo qué
              necesita el negocio y construimos el camino más simple para
              resolverlo bien.
            </p>
            <div className="process-principle">
              <span aria-hidden="true">◎</span>
              <div>
                <strong>Decisiones compartidas</strong>
                <small>
                  Cada etapa deja claro qué estamos haciendo, por qué y qué sigue.
                </small>
              </div>
            </div>
          </div>
        </Motion.div>

        <div className="process-flow">
          <div className="process-flow-line" aria-hidden="true" />

          {processSteps.map((step, index) => (
            <Motion.article
              key={step.id}
              className="process-step"
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.24 }}
              transition={{
                duration: 0.62,
                delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="process-step-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
              </div>

              <div className="process-step-content">
                <p className="process-step-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p className="process-summary">{step.summary}</p>

                <div className="process-outcome">
                  <span aria-hidden="true">✓</span>
                  <p>{step.outcome}</p>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>

        <Motion.div
          className="process-close"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="process-close-kicker">Sin fórmulas rígidas</p>
            <h3>Cada proyecto tiene su propio punto de partida.</h3>
            <p>
              Adaptamos el alcance y las etapas al momento real del negocio, sin
              agregar complejidad que todavía no necesita.
            </p>
          </div>
          <a href="#contacto" className="btn btn-primary">
            Contanos tu desafío <span aria-hidden="true">↗</span>
          </a>
        </Motion.div>
      </div>
    </section>
  );
}

export default Process;
