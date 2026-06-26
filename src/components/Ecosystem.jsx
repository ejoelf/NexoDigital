import React from "react";
import { ecosystemLines } from "../data/ecosystem";
import "../styles/Ecosystem.css";

function Ecosystem() {
  return (
    <section
      id="ecosistema"
      className="section section-ecosystem"
      aria-labelledby="ecosystem-title"
    >
      <div className="section-inner">
        <div className="ecosystem-header">
          <div>
            <p className="ecosystem-eyebrow">Ecosistema NexoDigital</p>
            <h2 id="ecosystem-title" className="section-title">
              Una empresa madre en construcción, no una agencia genérica.
            </h2>
          </div>

          <p className="ecosystem-intro">
            NexoDigital se organiza como un ecosistema tecnológico: servicios
            actuales, productos propios, operación interna, buenas prácticas de
            seguridad y experimentación con IA. Algunas líneas ya están activas;
            otras marcan la visión de crecimiento.
          </p>
        </div>

        <div className="ecosystem-grid">
          {ecosystemLines.map((line, index) => (
            <article key={line.id} className="ecosystem-card">
              <div className="ecosystem-card-top">
                <span className="ecosystem-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="ecosystem-stage">{line.stage}</span>
              </div>

              <h3 className="ecosystem-title">{line.name}</h3>
              <p className="ecosystem-focus">{line.focus}</p>
              <p className="ecosystem-description">{line.description}</p>

              <div className="ecosystem-tags" aria-label={`Áreas de ${line.name}`}>
                {line.capabilities.map((capability) => (
                  <span key={capability}>{capability}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Ecosystem;
