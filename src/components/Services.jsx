import React from "react";
import "../styles/Services.css";

const SERVICES = [
  {
    title: "Sitios web profesionales",
    description:
      "Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados para convertir visitas en clientes.",
    detail:
      "Ideales para negocios que necesitan presencia online clara y efectiva.",
  },
  {
    title: "Sistemas a medida",
    description:
      "Creamos sistemas internos adaptados a tu negocio: inventarios, paneles de gestión y herramientas personalizadas.",
    detail:
      "Pensados para optimizar procesos y ahorrar tiempo en el día a día.",
  },
  {
    title: "Automatización e IA aplicada",
    description:
      "Implementamos soluciones con inteligencia artificial para automatizar tareas, responder consultas y mejorar la atención.",
    detail:
      "Desde chatbots hasta flujos inteligentes conectados a tu negocio.",
  },
];

function Services() {
  return (
    <section id="servicios" className="section section-services">
      <div className="section-inner">
        <div className="section-header center">
          <h2 className="section-title">
            Soluciones pensadas para negocios reales
          </h2>
          <p className="section-subtitle">
            Cada servicio está diseñado para resolver problemas concretos y
            acompañar el crecimiento de tu proyecto.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <div key={service.title} className="service-card">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <p className="service-detail">{service.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
