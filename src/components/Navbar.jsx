import React, { useEffect, useMemo, useState } from "react";
import "../styles/Navbar.css";

const LINKS = [
  { href: "#inicio", label: "Inicio", id: "inicio" },
  { href: "#servicios", label: "Servicios", id: "servicios" },
  { href: "#ecosistema", label: "Soluciones", id: "ecosistema" },
  { href: "#portfolio", label: "Proyectos", id: "portfolio" },
  { href: "#contacto", label: "Contacto", id: "contacto" },
];

const NAV_OFFSET = 96;
const DESKTOP_BREAKPOINT = 860;

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const sectionIds = useMemo(() => LINKS.map((link) => link.id), []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 18);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    let ticking = false;

    function updateActiveSection() {
      const scrollPos = window.scrollY + NAV_OFFSET;
      let currentId = sections[0].id;

      for (const section of sections) {
        if (section.offsetTop <= scrollPos) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActiveSection(currentId);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sectionIds]);

  useEffect(() => {
    if (!isMobileOpen) return undefined;

    document.body.classList.add("nd-menu-open");

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    }

    function handleResize() {
      if (window.innerWidth > DESKTOP_BREAKPOINT) {
        setIsMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.classList.remove("nd-menu-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileOpen]);

  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <header
      className={`navbar ${isScrolled ? "navbar--scrolled" : ""} ${
        isMobileOpen ? "navbar--menu-open" : ""
      }`}
    >
      <nav className="navbar-inner" aria-label="Navegación principal">
        <a href="#inicio" className="navbar-logo" onClick={handleNavClick}>
          <img
            src="/brand/nexodigital-monochrome-white.svg"
            alt="NexoDigital"
            className="navbar-logo-image"
          />
        </a>

        <div className="navbar-links navbar-links--desktop">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`navbar-link ${
                activeSection === link.id ? "navbar-link--active" : ""
              }`}
              aria-current={activeSection === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}

          <a href="#contacto" className="navbar-cta">
            Hablemos
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${
            isMobileOpen ? "navbar-toggle--open" : ""
          }`}
          aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMobileOpen}
          aria-controls="navbar-mobile-menu"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
        </button>
      </nav>

      <button
        type="button"
        className={`navbar-mobile-backdrop ${
          isMobileOpen ? "navbar-mobile-backdrop--visible" : ""
        }`}
        aria-label="Cerrar menú"
        tabIndex={isMobileOpen ? 0 : -1}
        onClick={() => setIsMobileOpen(false)}
      />

      <div
        id="navbar-mobile-menu"
        className={`navbar-links navbar-links--mobile ${
          isMobileOpen ? "navbar-links--mobile-open" : ""
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="navbar-mobile-heading">
          <span>Explorá NexoDigital</span>
          <small>Soluciones digitales para negocios reales.</small>
        </div>

        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`navbar-link navbar-link--mobile ${
              activeSection === link.id ? "navbar-link--active" : ""
            }`}
            aria-current={activeSection === link.id ? "page" : undefined}
            onClick={handleNavClick}
          >
            <span>{link.label}</span>
            <i aria-hidden="true">→</i>
          </a>
        ))}

        <a
          href="#contacto"
          className="navbar-cta navbar-cta--mobile"
          onClick={handleNavClick}
        >
          Contanos tu proyecto
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;
