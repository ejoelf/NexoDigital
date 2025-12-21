import React from "react";
import "../styles/About.css";

function About() {
  return (
    <section id="sobre" className="section section-about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-text">
            <h2 className="section-title">
              Construimos soluciones digitales con criterio y enfoque real
            </h2>
            <p className="about-paragraph">
              En NexoDigital ayudamos a negocios y profesionales a mejorar sus
              procesos, su presencia digital y su relación con los clientes
              mediante tecnología bien aplicada.
            </p>
            <p className="about-paragraph">
              No ofrecemos soluciones genéricas ni promesas vacías: analizamos
              cada caso, entendemos el contexto y desarrollamos herramientas que
              realmente aportan valor.
            </p>
            <p className="about-paragraph">
              Trabajamos de forma cercana, clara y ordenada, priorizando
              resultados concretos y soluciones que puedan escalar con el
              crecimiento de cada proyecto.
            </p>
          </div>

          <div className="about-card">
            <ul className="about-list">
              <li>✔ Análisis real antes de desarrollar</li>
              <li>✔ Soluciones pensadas para tu negocio</li>
              <li>✔ Comunicación clara y sin vueltas</li>
              <li>✔ Tecnología moderna y escalable</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
