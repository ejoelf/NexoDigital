import { useEffect } from "react";
import { SITE_URL } from "./content";

// Actualiza idioma, título, descripción y enlaces canónicos de la página.
export function useDocumentMeta({ lang, title, description, path, altEs, altIt }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = title;

    const setMeta = (selector, attr, value) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", `${SITE_URL}${path}`);
    setMeta(
      'meta[property="og:locale"]',
      "content",
      lang === "it" ? "it_IT" : "es_AR"
    );
    setMeta('link[rel="canonical"]', "href", `${SITE_URL}${path}`);
    setMeta('link[hreflang="es"]', "href", `${SITE_URL}${altEs}`);
    setMeta('link[hreflang="it"]', "href", `${SITE_URL}${altIt}`);
  }, [lang, title, description, path, altEs, altIt]);
}
