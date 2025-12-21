import React from "react";
import "../styles/Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#inicio" className="footer-logo">
              <img
                src="/logoND.jpg"
                alt="NexoDigital - soluciones digitales e inteligencia artificial"
                loading="lazy"
                className="footer-logo-image"
              />
              <span className="footer-logo-text">NexoDigital</span>
            </a>

            <p className="footer-description">
              Soluciones digitales: sitios web, sistemas a medida y automatización
              con IA para mejorar procesos y vender más.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <p className="footer-col-title">Secciones</p>
              <a className="footer-link" href="#sobre">Sobre nosotros</a>
              <a className="footer-link" href="#servicios">Servicios</a>
              <a className="footer-link" href="#portfolio">Portfolio</a>
              <a className="footer-link" href="#contacto">Contacto</a>
            </div>

            <div className="footer-col">
              <p className="footer-col-title">Contacto</p>
              <a className="footer-link" href="mailto:contacto.nexod@gmail.com">
                contacto.nexod@gmail.com
              </a>
              <a
                className="footer-link"
                href="https://wa.me/5493585729499?text=Hola%2C%20estuve%20viendo%20la%20p%C3%A1gina%20de%20NexoDigital%20y%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20una%20soluci%C3%B3n%20para%20mi%20negocio." 
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <a className= "footer-link" href="https://www.instagram.com/nexodigital_ar/" target="_blank" rel="noreferrer">Instagram</a>
              <p className="footer-muted">
                Lunes a viernes, 9 a 18 hs.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} NexoDigital. Todos los derechos reservados.
          </p>
          <p className="footer-made">
            Hecho con foco en resultados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
