import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "../styles/Hero.css";

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="inicio" className="hero">
      <div className="hero-inner">
        <motion.div
          className="hero-text"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="hero-kicker">Soluciones digitales inteligentes</p>

          <h1 className="hero-title">
            Potenciamos tu negocio con tecnología, diseño e inteligencia
            artificial.
          </h1>

          <p className="hero-subtitle">
            Desarrollo web, sistemas a medida e IA aplicada para que tu negocio
            crezca, automatice tareas y brinde una mejor experiencia a sus
            clientes.
          </p>

          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">
              Agendar reunión gratuita
            </a>
            <a href="#portfolio" className="btn btn-outline">
              Ver proyectos
            </a>
          </div>

          <ul className="hero-trust">
            <li>✔ Respuesta en el día</li>
            <li>✔ Soluciones a medida</li>
            <li>✔ Sin compromiso inicial</li>
          </ul>

          <p className="hero-note">
            Trabajamos con personas y equipos que quieren mejorar procesos,
            vender más y aprovechar la tecnología de forma inteligente.
          </p>
        </motion.div>

        <motion.div
          className="hero-card-wrapper"
          initial={reduceMotion ? false : { opacity: 0, x: 40 }}
          whileInView={reduceMotion ? false : { opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="hero-card">
           <div className="hero-card-header">
            <span>Dashboard NexoDigital</span>
            <span className="hero-card-pill">
            <span className="hero-card-dot" aria-hidden="true" />
              Demo
            </span>
          </div>    
            <div className="hero-card-body">
              <div className="hero-card-block hero-card-block-main">
                <p className="hero-card-title">Chatbot para WhatsApp</p>
                <p className="hero-card-text">
                  Responde consultas y toma reservas automáticamente, las 24 hs.
                </p>
              </div>

              <div className="hero-card-grid">
                <div className="hero-card-block">
                  <p className="hero-card-label">Sitios web</p>
                  <p className="hero-card-small">
                    Rápidos, modernos y listos para convertir visitas en
                    clientes.
                  </p>
                </div>

                <div className="hero-card-block">
                  <p className="hero-card-label">Sistemas a medida</p>
                  <p className="hero-card-small">
                    Inventarios, paneles internos y más, adaptados a tu negocio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
