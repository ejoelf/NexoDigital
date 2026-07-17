import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { works } from "../data/works";
import "../styles/Portfolio.css";

function getInitials(title) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function ProjectPlaceholder({ work }) {
  return (
    <div className="portfolio-placeholder" aria-hidden="true">
      <div className="portfolio-placeholder-window">
        <div className="portfolio-placeholder-bar">
          <span />
          <span />
          <span />
        </div>
        <div className="portfolio-placeholder-content">
          <div className="portfolio-placeholder-brand">
            <i>{getInitials(work.title)}</i>
            <span />
          </div>
          <div className="portfolio-placeholder-hero">
            <span />
            <span />
            <span />
          </div>
          <div className="portfolio-placeholder-cards">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

function Portfolio() {
  const reduceMotion = useReducedMotion();
  const publicWorks = works.filter((work) => work.isPublic);

  return (
    <section id="portfolio" className="section section-portfolio">
      <div className="portfolio-background" aria-hidden="true">
        <span className="portfolio-grid-lines" />
        <span className="portfolio-glow" />
      </div>

      <div className="section-inner portfolio-inner">
        <Motion.div
          className="portfolio-header"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="portfolio-eyebrow">Proyectos y productos</p>
            <h2 className="section-title">
              No mostramos código. Mostramos{" ""}
              <span>problemas convertidos en soluciones.</span>
            </h2>
            <p className="section-subtitle">
              Cada proyecto parte de una necesidad diferente. Diseñamos la
              respuesta adecuada para presentar, vender, organizar o hacer crecer
              ese negocio.
            </p>
          </div>

          <div className="portfolio-manifesto">
            <span className="portfolio-manifesto-icon" aria-hidden="true">↗</span>
            <p>
              <strong>El valor está en lo que la solución permite hacer.</strong>
              Por eso presentamos el desafío, la respuesta y el alcance, no una
              lista de herramientas técnicas.
            </p>
          </div>
        </Motion.div>

        <div className="portfolio-grid">
          {publicWorks.map((work, index) => (
            <Motion.article
              key={work.id}
              className={`portfolio-card ${work.featured ? "is-featured" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{
                duration: 0.62,
                delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.2),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="portfolio-media">
                {work.image ? (
                  <img
                    src={work.image}
                    alt={`Vista del proyecto ${work.title}`}
                    className="portfolio-thumb"
                    loading="lazy"
                  />
                ) : (
                  <ProjectPlaceholder work={work} />
                )}

                <div className="portfolio-media-overlay" />
                <span className="portfolio-status">{work.status}</span>
                <span className="portfolio-category">{work.category}</span>
              </div>

              <div className="portfolio-body">
                <div className="portfolio-heading">
                  <div>
                    <p className="portfolio-client">{work.client}</p>
                    <h3 className="portfolio-title">{work.title}</h3>
                  </div>
                  <span className="portfolio-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="portfolio-industry">{work.industry}</p>

                <div className="portfolio-story">
                  <div>
                    <span>La necesidad</span>
                    <p>{work.need}</p>
                  </div>
                  <div>
                    <span>La solución</span>
                    <p>{work.solution}</p>
                  </div>
                </div>

                <div className="portfolio-scope">
                  <p>Alcance del proyecto</p>
                  <div>
                    {work.scope.map((item) => (
                      <span key={item}>
                        <i aria-hidden="true" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {work.url ? (
                  <a
                    className="portfolio-link"
                    href={work.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visitar proyecto <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="portfolio-link portfolio-link--disabled">
                    Proyecto en evolución
                  </span>
                )}
              </div>
            </Motion.article>
          ))}
        </div>

        <Motion.div
          className="portfolio-close"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p>Tu negocio no tiene que parecerse a estos proyectos.</p>
            <h3>La próxima solución empieza por entender tu propio desafío.</h3>
          </div>
          <a href="#contacto" className="btn btn-primary">
            Empezar una conversación <span aria-hidden="true">↗</span>
          </a>
        </Motion.div>
      </div>
    </section>
  );
}

export default Portfolio;
