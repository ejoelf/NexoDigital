import React, { Suspense, lazy } from "react";
import HomePage from "./site/HomePage";
import PrivacyPage from "./site/PrivacyPage";
import "./site/site.css";

// El CRM se carga aparte para que la web pública sea más liviana.
const CrmApp = lazy(() => import("./crm/CrmApp"));

// Rutas públicas:
//   /              inicio en español
//   /privacidad    política de privacidad en español
//   /it            inicio en italiano
//   /it/privacy    política de privacidad en italiano
//   /crm/...       panel privado (CRM), sin cambios
function resolveRoute(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/it" || path.startsWith("/it/")) {
    return { lang: "it", page: path === "/it/privacy" ? "privacy" : "home" };
  }

  return { lang: "es", page: path === "/privacidad" ? "privacy" : "home" };
}

export default function App() {
  const { pathname } = window.location;

  if (pathname.startsWith("/crm")) {
    return (
      <Suspense fallback={null}>
        <CrmApp />
      </Suspense>
    );
  }

  const { lang, page } = resolveRoute(pathname);

  if (page === "privacy") {
    return <PrivacyPage lang={lang} />;
  }

  return <HomePage lang={lang} />;
}
