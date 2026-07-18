import React, { useState } from "react";
import {
  motion as Motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import "../styles/PublicExperience.css";

function ScrollExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.22,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest > 760;
    setShowBackToTop((current) =>
      current === shouldShow ? current : shouldShow
    );
  });

  function handleBackToTop() {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <Motion.span
          className="scroll-progress-bar"
          style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
        />
      </div>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "back-to-top--visible" : ""}`}
        aria-label="Volver al inicio"
        onClick={handleBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <span aria-hidden="true">↑</span>
        <small>Inicio</small>
      </button>
    </>
  );
}

export default ScrollExperience;
