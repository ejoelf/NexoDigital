import { CONTACT, ROUTES, TEXT } from "./content";
import { SiteFooter, SiteHeader } from "./Layout";
import { useDocumentMeta } from "./useDocumentMeta";

// Reemplaza {email} por un enlace al mail de contacto.
function withEmail(text) {
  const parts = text.split("{email}");
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      )}
    </span>
  ));
}

export default function PrivacyPage({ lang }) {
  const t = TEXT[lang];

  useDocumentMeta({
    lang,
    title: t.meta.privacyTitle,
    description: t.meta.description,
    path: ROUTES[lang].privacy,
    altEs: ROUTES.es.privacy,
    altIt: ROUTES.it.privacy,
  });

  return (
    <div className="site">
      <SiteHeader lang={lang} page="privacy" />
      <main className="site-section site-legal">
        <div className="site-container site-legal__inner">
          <a href={ROUTES[lang].home} className="site-legal__back">
            ← {t.privacy.back}
          </a>
          <h1 className="site-section__title">{t.privacy.title}</h1>
          <p className="site-legal__updated">{t.privacy.updated}</p>
          {t.privacy.sections.map((section) => (
            <section key={section.title} className="site-legal__section">
              <h2>{section.title}</h2>
              <p>{withEmail(section.text)}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
