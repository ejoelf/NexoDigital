import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/Portfolio.css";

function Portfolio() {
  const reduceMotion = useReducedMotion();

  const projects = [
    {
      name: "Tapicería Líder",
      description:
        "Sitio web desarrollado para un taller especializado en tapicería de volantes de autos, enfocado en mostrar trabajos realizados, servicios ofrecidos y facilitar el contacto con clientes.",
      status: "Proyecto en desarrollo",
      image: "/projects/tapiceria-lider.jpg",
    },
    {
      name: "CF Metalúrgica",
      description:
        "Página institucional para una empresa de servicios metalúrgicos, pintura en general, instalaciones eléctricas y trabajos en durlock, pensada para presentar servicios y captar consultas.",
      status: "Proyecto en desarrollo",
      image: "/projects/cf-metalurgica.jpg",
    },
    {
      name: "E-commerce indumentaria femenina",
      description:
        "Plataforma de comercio electrónico en desarrollo para venta de indumentaria femenina, con enfoque en catálogo de productos, gestión de stock y experiencia de compra simple.",
      status: "Proyecto en desarrollo",
      image: "/projects/ecommerce-indumentaria.jpg",
    },
  ];

  return (
    <section id="portfolio" className="section section-portfolio">
      <div className="section-inner">
        <div className="section-header center">
          <h2 className="section-title">Algunos de nuestros proyectos</h2>
          <p className="section-subtitle">
            Una selección de proyectos y desarrollos recientes que reflejan nuestra forma
  de trabajar y el enfoque que aplicamos en cada solución.
          </p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project) => (
            <motion.article
              key={project.name}
              className="card portfolio-card"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={project.image}
                alt={`Proyecto ${project.name}`}
                className="portfolio-thumb"
                loading="lazy"
              />

              <h3 className="portfolio-title">{project.name}</h3>
              <p className="portfolio-text">{project.description}</p>

              <p className="portfolio-status">{project.status}</p>

              {/* Si todavía no hay link/demo real, mejor no mostrar botón clickeable */}
              <button
                className="btn btn-small btn-outline"
                type="button"
                disabled
                aria-disabled="true"
                title="Demo disponible pronto"
              >
                Demo / video (pronto)
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;
