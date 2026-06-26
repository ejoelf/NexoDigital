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

function Portfolio() {
  const reduceMotion = useReducedMotion();
  const publicWorks = works.filter((work) => work.isPublic);
  const categoriesCount = new Set(publicWorks.map((work) => work.category)).size;
  const featuredCount = publicWorks.filter((work) => work.featured).length;

  return (
    <section id="portfolio" className="section section-portfolio">
      <div className="section-inner">
        <div className="portfolio-header">
          <div>
            <p className="portfolio-eyebrow">Trabajos realizados</p>
            <h2 className="section-title">
              Casos, productos y proyectos que construyen el ecosistema
              NexoDigital
            </h2>
            <p className="section-subtitle">
              Una selección de webs, sistemas, CRMs, SaaS y desarrollos en
              evolución. Esta estructura ya queda preparada para que el futuro
              CRM interno alimente la web pública.
            </p>
          </div>

          <div className="portfolio-summary" aria-label="Resumen de trabajos">
            <div>
              <strong>{publicWorks.length}</strong>
              <span>trabajos visibles</span>
            </div>
            <div>
              <strong>{categoriesCount}</strong>
              <span>categorías</span>
            </div>
            <div>
              <strong>{featuredCount}</strong>
              <span>destacados</span>
            </div>
          </div>
        </div>

        <div className="portfolio-grid">
          {publicWorks.map((work) => (
            <Motion.article
              key={work.id}
              className={`portfolio-card ${work.featured ? "is-featured" : ""}`}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="portfolio-media">
                {work.image ? (
                  <img
                    src={work.image}
                    alt={`Trabajo realizado: ${work.title}`}
                    className="portfolio-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="portfolio-thumb portfolio-thumb--empty">
                    <span>{getInitials(work.title)}</span>
                  </div>
                )}

                <span className="portfolio-status">{work.status}</span>
              </div>

              <div className="portfolio-body">
                <div className="portfolio-meta">
                  <span>{work.category}</span>
                  <span>{work.industry}</span>
                </div>

                <h3 className="portfolio-title">{work.title}</h3>
                <p className="portfolio-client">Cliente: {work.client}</p>
                <p className="portfolio-text">{work.description}</p>

                <div className="portfolio-tech-list" aria-label="Tecnologías">
                  {work.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>

              {work.url && (
                <a
                  className="btn btn-small btn-outline portfolio-link"
                  href={work.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver proyecto
                </a>
              )}
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
