import React from "react";
import "../styles/Services.css";

const SERVICES = [
  {
    title: "Sitios web profesionales",
    description:
      "Diseñamos y desarrollamos webs modernas, rápidas y preparadas para convertir visitas en consultas reales.",
    detail:
      "Ideal para negocios que necesitan presencia clara, confianza y una base lista para crecer.",
  },
  {
    title: "Sistemas a medida",
    description:
      "Creamos herramientas internas para ordenar operaciones, inventarios, pedidos, turnos, clientes o procesos propios.",
    detail:
      "Pensados para reducir trabajo manual y evitar depender de planillas desordenadas.",
  },
  {
    title: "CRM para negocios",
    description:
      "Construimos paneles para gestionar clientes, proyectos, tareas, estados, servicios contratados y seguimiento comercial.",
    detail:
      "Una base operativa para negocios que necesitan trazabilidad y mejor control diario.",
  },
  {
    title: "Automatización e IA aplicada",
    description:
      "Implementamos flujos con IA para responder consultas, generar contenido, ordenar información o acelerar tareas repetitivas.",
    detail:
      "Aplicamos IA donde aporta valor real, sin reemplazar criterio humano ni control del negocio.",
  },
  {
    title: "Integraciones",
    description:
      "Conectamos formularios, WhatsApp, email, pagos, calendarios, APIs y herramientas externas para que la operación fluya.",
    detail:
      "Menos tareas duplicadas, menos datos perdidos y mejor experiencia para el cliente.",
  },
  {
    title: "Mantenimiento e infraestructura",
    description:
      "Acompañamos la publicación, ajustes, mejoras, hosting, dominios y soporte técnico de proyectos digitales.",
    detail:
      "Para que la tecnología no quede abandonada después del lanzamiento.",
  },
  {
    title: "Seguridad digital básica",
    description:
      "Preparamos buenas prácticas iniciales: accesos ordenados, backups, SSL, variables protegidas y revisión técnica.",
    detail:
      "Una línea futura de NexoDigital orientada a cuidar mejor cada proyecto sin prometer auditorías avanzadas aún.",
  },
];

function Services() {
  return (
    <section id="servicios" className="section section-services">
      <div className="section-inner">
        <div className="section-header center">
          <p className="services-eyebrow">Servicios principales</p>
          <h2 className="section-title">
            Tecnología práctica para negocios reales
          </h2>
          <p className="section-subtitle">
            Combinamos diseño, desarrollo, automatización e IA para crear
            soluciones útiles, mantenibles y alineadas a la etapa de cada
            negocio.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <div key={service.title} className="service-card">
              <span className="service-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <p className="service-detail">{service.detail}</p>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <p>
            Si no sabés qué solución necesitás todavía, empezamos por entender
            el problema y definir el camino más simple.
          </p>
          <a href="#contacto" className="btn btn-primary">
            Consultar proyecto
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
