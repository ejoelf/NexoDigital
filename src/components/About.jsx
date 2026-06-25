import React from "react";
import "../styles/About.css";

function About() {
  return (
    <section id="sobre" className="section section-about">
      <div className="section-inner">
        <div className="about-grid">
          <div className="about-text">
            <p className="about-eyebrow">Qué es NexoDigital</p>
            <h2 className="section-title">
              Una empresa tecnológica boutique para negocios que quieren
              ordenar, vender y crecer.
            </h2>
            <p className="about-paragraph">
              NexoDigital no nace para hacer páginas sueltas. Creamos presencia
              digital, software, CRMs, automatizaciones e integraciones que
              ayudan a que un negocio trabaje con más foco y menos fricción.
            </p>
            <p className="about-paragraph">
              Antes de diseñar o programar, entendemos cómo funciona el negocio:
              qué vende, cómo capta clientes, qué procesos se repiten, dónde se
              pierde tiempo y qué tecnología puede generar una mejora concreta.
            </p>
            <p className="about-paragraph">
              El objetivo es construir bases digitales mantenibles: webs que
              convierten, sistemas que ordenan, IA aplicada con criterio y una
              línea futura de buenas prácticas de seguridad para proteger lo que
              el negocio va creando.
            </p>

            <div className="about-tags" aria-label="Áreas de trabajo">
              <span>Web comercial</span>
              <span>Software a medida</span>
              <span>CRM</span>
              <span>IA aplicada</span>
            </div>
          </div>

          <div className="about-card">
            <p className="about-card-kicker">Forma de trabajo</p>
            <h3 className="about-card-title">Tecnología con criterio operativo</h3>
            <ul className="about-list">
              <li>
                <span className="about-list-marker" aria-hidden="true" />
                Análisis real antes de desarrollar.
              </li>
              <li>
                <span className="about-list-marker" aria-hidden="true" />
                Soluciones pensadas para el flujo del negocio.
              </li>
              <li>
                <span className="about-list-marker" aria-hidden="true" />
                Comunicación clara, entregas ordenadas y foco comercial.
              </li>
              <li>
                <span className="about-list-marker" aria-hidden="true" />
                Base técnica preparada para mantenimiento y crecimiento.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
