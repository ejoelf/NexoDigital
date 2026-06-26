import React from "react";
import { technologyGroups } from "../data/technologies";
import "../styles/TechStack.css";

function TechStack() {
  return (
    <section
      id="tecnologias"
      className="section section-tech"
      aria-labelledby="tech-title"
    >
      <div className="section-inner">
        <div className="tech-layout">
          <div className="tech-copy">
            <p className="tech-eyebrow">Tecnologías y proveedores</p>
            <h2 id="tech-title" className="section-title">
              Stack moderno, elegido según el proyecto.
            </h2>
            <p className="tech-intro">
              NexoDigital no fuerza una herramienta por moda. El stack se elige
              según el objetivo, presupuesto, complejidad, mantenimiento y
              crecimiento esperado de cada solución.
            </p>
            <p className="tech-note">
              Algunas tecnologías ya forman parte de la web actual; otras se
              reservan para CRMs, SaaS, automatizaciones o proyectos con backend.
            </p>
          </div>

          <div className="tech-grid">
            {technologyGroups.map((group) => (
              <article key={group.id} className="tech-card">
                <h3>{group.title}</h3>
                <p>{group.description}</p>

                <div className="tech-tags" aria-label={`Stack de ${group.title}`}>
                  {group.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
