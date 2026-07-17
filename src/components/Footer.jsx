import React from "react";
import "../styles/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-background" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <p className="footer-eyebrow">Tu próximo paso digital</p>
            <h2>¿Tenés una idea? Hagamos que crezca.</h2>
            <p>
              Contanos qué necesita tu negocio y pensemos una solución clara,
              escalable y construida alrededor de tus objetivos.
            </p>
          </div>

          <div className="footer-cta-actions">
            <a href="#contacto" className="btn btn-primary">
              Empezar un proyecto
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://wa.me/5493585729499?text=Hola%2C%20estuve%20viendo%20la%20p%C3%A1gina%20de%20NexoDigital%20y%20me%20gustar%C3%ADa%20contarles%20sobre%20mi%20proyecto."
              target="_blank"
              rel="noreferrer"
              className="btn footer-whatsapp-button"
            >
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-top">
          <div className="footer-brand">
            <a href="#inicio" className="footer-logo">
              <img
                src="/brand/nexodigital-monochrome-white.svg"
                alt="NexoDigital"
                loading="lazy"
                className="footer-logo-image"
              />
            </a>

            <p className="footer-description">
              Diseñamos experiencias digitales, aplicaciones, software, CRM,
              SaaS, automatizaciones e inteligencia artificial para negocios
              que quieren modernizarse y crecer.
            </p>

            <div className="footer-socials">
              <a
                href="https://www.instagram.com/nexodigital_ar/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a href="mailto:contacto.nexod@gmail.com">Email</a>
              <a
                href="https://wa.me/5493585729499"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <p className="footer-col-title">Soluciones</p>
              <a className="footer-link" href="#servicios">
                Diseño y desarrollo web
              </a>
              <a className="footer-link" href="#servicios">
                Aplicaciones móviles
              </a>
              <a className="footer-link" href="#ecosistema">
                CRM, software y SaaS
              </a>
              <a className="footer-link" href="#ecosistema">
                IA y automatización
              </a>
              <a className="footer-link" href="#servicios">
                Marketing y redes
              </a>
            </div>

            <div className="footer-col">
              <p className="footer-col-title">NexoDigital</p>
              <a className="footer-link" href="#servicios">
                Servicios
              </a>
              <a className="footer-link" href="#ecosistema">
                Soluciones
              </a>
              <a className="footer-link" href="#proceso">
                Cómo trabajamos
              </a>
              <a className="footer-link" href="#portfolio">
                Proyectos
              </a>
              <a className="footer-link" href="#contacto">
                Contacto
              </a>
            </div>
          </div>

          <div className="footer-private">
            <div className="footer-private-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                <rect x="5" y="10" width="14" height="10" rx="3" />
                <path d="M12 14v2" />
              </svg>
            </div>
            <p className="footer-private-label">Área privada</p>
            <h3>Panel de gestión NexoDigital</h3>
            <p>
              Acceso exclusivo para el equipo y usuarios autorizados del CRM.
            </p>
            <a href="/crm/login" className="footer-private-link">
              Ingresar al CRM
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} NexoDigital. Todos los derechos reservados.
          </p>
          <p className="footer-made">
            Tecnología con propósito para negocios reales.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
