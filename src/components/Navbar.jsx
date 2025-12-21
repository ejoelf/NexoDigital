import React, { useEffect, useMemo, useState } from "react";
import "../styles/Navbar.css";

const LINKS = [
  { href: "#inicio", label: "Inicio", id: "inicio" },
  { href: "#sobre", label: "Sobre nosotros", id: "sobre" },
  { href: "#servicios", label: "Servicios", id: "servicios" },
  { href: "#portfolio", label: "Portfolio", id: "portfolio" },
  { href: "#contacto", label: "Contacto", id: "contacto" },
];

const NAV_OFFSET = 90;

function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  const sectionIds = useMemo(() => LINKS.map((l) => l.id), []);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

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

  const handleNavClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <header className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <nav className="navbar-inner">
        <a href="#inicio" className="navbar-logo" onClick={handleNavClick}>
          <img
            src="/logoND.jpg"
            alt="NexoDigital - soluciones digitales e inteligencia artificial"
            className="navbar-logo-image"
          />
          <span className="navbar-logo-text">NexoDigital</span>
        </a>

        {/* Desktop */}
        <div className="navbar-links navbar-links--desktop">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`navbar-link ${
                activeSection === link.id ? "navbar-link--active" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          <a href="#contacto" className="navbar-cta">
            Agendá una reunión
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Abrir menú de navegación"
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`navbar-links navbar-links--mobile ${
          isMobileOpen ? "navbar-links--mobile-open" : ""
        }`}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`navbar-link navbar-link--mobile ${
              activeSection === link.id ? "navbar-link--active" : ""
            }`}
            onClick={handleNavClick}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contacto"
          className="navbar-cta navbar-cta--mobile"
          onClick={handleNavClick}
        >
          Agendá una reunión
        </a>
      </div>
    </header>
  );
}

export default Navbar;
