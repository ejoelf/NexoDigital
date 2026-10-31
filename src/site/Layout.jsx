import { CONTACT, ROUTES, TEXT, whatsappLink } from "./content";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconWhatsApp,
} from "./Icons";

export function SiteHeader({ lang, page }) {
  const t = TEXT[lang];
  const home = ROUTES[lang].home;
  const anchor = (id) => (page === "home" ? `#${id}` : `${home}#${id}`);
  const otherLang = lang === "es" ? "it" : "es";
  const otherPath =
    page === "privacy" ? ROUTES[otherLang].privacy : ROUTES[otherLang].home;

  return (
    <header className="site-header">
      <nav className="site-container site-header__inner" aria-label={t.nav.label}>
        <a href={home} className="site-brand" aria-label="NexoDigital">
          <img
            src="/brand/nd-monogram.webp"
            alt=""
            width="46"
            height="28"
            className="site-brand__mark"
          />
          <span className="site-brand__name">NexoDigital</span>
        </a>

        <div className="site-nav">
          <a href={anchor("servicios")}>{t.nav.services}</a>
          <a href={anchor("casos")}>{t.nav.cases}</a>
          <a href={anchor("proceso")}>{t.nav.process}</a>
          <a href={anchor("sobre-mi")}>{t.nav.about}</a>
        </div>

        <div className="site-header__actions">
          <div className="site-lang" role="group" aria-label={t.nav.language}>
            <a
              href={lang === "es" ? undefined : otherPath}
              aria-current={lang === "es" ? "true" : undefined}
              lang="es"
              hrefLang="es"
            >
              ES
            </a>
            <a
              href={lang === "it" ? undefined : otherPath}
              aria-current={lang === "it" ? "true" : undefined}
              lang="it"
              hrefLang="it"
            >
              IT
            </a>
          </div>
          <a href={anchor("contacto")} className="site-btn site-btn--primary site-btn--sm">
            {t.nav.contact}
          </a>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter({ lang }) {
  const t = TEXT[lang];
  const home = ROUTES[lang].home;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <img
              src="/brand/nd-logo-vertical.webp"
              alt="NexoDigital"
              width="150"
              height="90"
              loading="lazy"
              className="site-footer__logo"
            />
            <p>{t.footer.tagline}</p>
          </div>

          <div>
            <h2 className="site-footer__heading">{t.footer.services}</h2>
            <ul className="site-footer__list">
              {t.services.items.map((item) => (
                <li key={item.id}>
                  <a href={`${home}#servicios`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="site-footer__heading">{t.footer.contact}</h2>
            <ul className="site-footer__list">
              <li>
                <a href={whatsappLink(t.whatsappMessage)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp size={18} /> {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}>
                  <IconMail /> {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
                  <IconInstagram /> Instagram
                </a>
              </li>
              <li>
                <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer">
                  <IconFacebook /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {year} NexoDigital. {t.footer.rights}
          </span>
          <a href={ROUTES[lang].privacy}>{t.footer.privacy}</a>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWhatsApp({ lang }) {
  const t = TEXT[lang];
  return (
    <a
      href={whatsappLink(t.whatsappMessage)}
      className="site-float-wa"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.floating}
      title={t.floating}
    >
      <IconWhatsApp size={28} />
    </a>
  );
}
