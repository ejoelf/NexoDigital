import React from "react";
import { processSteps } from "../data/process";
import "../styles/Process.css";

function Process() {
  return (
    <section
      id="proceso"
      className="section section-process"
      aria-labelledby="process-title"
    >
      <div className="section-inner">
        <div className="process-header">
          <p className="process-eyebrow">Proceso de trabajo</p>
          <h2 id="process-title" className="section-title">
            Primero entendemos el negocio. Después elegimos la tecnología.
          </h2>
          <p className="section-subtitle">
            El proceso evita construir por impulso. Cada etapa ayuda a definir
            qué conviene hacer ahora, qué puede esperar y cómo dejar una base
            preparada para crecer.
          </p>
        </div>

        <div className="process-timeline">
          {processSteps.map((step, index) => (
            <article key={step.id} className="process-step">
              <div className="process-step-marker">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="process-step-content">
                <h3>{step.title}</h3>
                <p className="process-summary">{step.summary}</p>
                <p className="process-outcome">{step.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
