import { CONTACT, ROUTES, TEXT, getCases, whatsappLink } from "./content";
import {
  FloatingWhatsApp,
  SiteFooter,
  SiteHeader,
} from "./Layout";
import { useDocumentMeta } from "./useDocumentMeta";
import {
  IconArrow,
  IconAutomation,
  IconDiagnosis,
  IconExternal,
  IconMail,
  IconPresence,
  IconSoftware,
  IconWeb,
  IconWhatsApp,
} from "./Icons";

const SERVICE_ICONS = {
  web: IconWeb,
  software: IconSoftware,
  automation: IconAutomation,
  diagnosis: IconDiagnosis,
  presence: IconPresence,
};

function Hero({ t }) {
  return (
    <section className="site-hero" id="inicio">
      <div className="site-container">
        <p className="site-eyebrow">{t.hero.eyebrow}</p>
        <h1 className="site-hero__title">{t.hero.title}</h1>
        <p className="site-hero__subtitle">{t.hero.subtitle}</p>
        <div className="site-actions">
          <a
            href={whatsappLink(t.whatsappMessage)}
            className="site-btn site-btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hero.primary}
            <IconArrow />
          </a>
          <a href="#casos" className="site-btn site-btn--secondary">
            {t.hero.secondary}
          </a>
        </div>
        <a href="#servicios" className="site-hero__badge">
          <IconDiagnosis width={18} height={18} />
          {t.hero.badge}
        </a>
      </div>
    </section>
  );
}

function Services({ t }) {
  return (
    <section className="site-section" id="servicios" aria-labelledby="servicios-title">
      <div className="site-container">
        <p className="site-eyebrow">{t.services.eyebrow}</p>
        <h2 className="site-section__title" id="servicios-title">
          {t.services.title}
        </h2>
        <ul className="site-services">
          {t.services.items.map((item) => {
            const Icon = SERVICE_ICONS[item.id];
            return (
              <li
                key={item.id}
                className={`site-service ${item.free ? "site-service--featured" : ""}`}
              >
                <div className="site-service__top">
                  <span className="site-service__icon">
                    <Icon />
                  </span>
                  {item.free && <span className="site-tag site-tag--free">{t.services.free}</span>}
                </div>
                <h3 className="site-service__title">{item.title}</h3>
                <p className="site-service__text">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Cases({ t, lang }) {
  const cases = getCases(lang);
  return (
    <section className="site-section" id="casos" aria-labelledby="casos-title">
      <div className="site-container">
        <p className="site-eyebrow">{t.cases.eyebrow}</p>
        <h2 className="site-section__title" id="casos-title">
          {t.cases.title}
        </h2>
        <ul className="site-cases">
          {cases.map((item) => {
            const soon = item.status === "soon";
            return (
              <li key={item.id} className={`site-case ${soon ? "site-case--soon" : ""}`}>
                <div className="site-case__media">
                  <img
                    src={item.image}
                    alt={`${item.name}`}
                    loading="lazy"
                    width="640"
                    height="360"
                  />
                </div>
                <div className="site-case__body">
                  <div className="site-case__head">
                    <h3 className="site-case__title">{item.name}</h3>
                    {soon && <span className="site-tag site-tag--soon">{t.cases.soon}</span>}
                  </div>
                  <p className="site-case__industry">{item.industry}</p>
                  <p className="site-case__text">{item.description}</p>
                  {!soon && item.url && (
                    <a
                      href={item.url}
                      className="site-case__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.cases.visit}
                      <IconExternal />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Process({ t }) {
  return (
    <section className="site-section" id="proceso" aria-labelledby="proceso-title">
      <div className="site-container">
        <p className="site-eyebrow">{t.process.eyebrow}</p>
        <h2 className="site-section__title" id="proceso-title">
          {t.process.title}
        </h2>
        <ol className="site-steps">
          {t.process.steps.map((step, index) => (
            <li key={step.title} className="site-step">
              <span className="site-step__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="site-step__title">{step.title}</h3>
              <p className="site-step__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section className="site-section" id="sobre-mi" aria-labelledby="sobre-mi-title">
      <div className="site-container site-about">
        <picture className="site-about__photo">
          <source srcSet="/team/joel.webp" type="image/webp" />
          <img
            src="/team/joel.jpg"
            alt={t.about.photoAlt}
            width="451"
            height="451"
            loading="lazy"
          />
        </picture>
        <div>
          <p className="site-eyebrow">{t.about.eyebrow}</p>
          <h2 className="site-section__title" id="sobre-mi-title">
            {t.about.name}
            <span className="site-about__role">{t.about.role}</span>
          </h2>
          {t.about.paragraphs.map((text) => (
            <p key={text} className="site-about__text">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ t }) {
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(t.contact.emailSubject)}`;
  return (
    <section className="site-section site-contact" id="contacto" aria-labelledby="contacto-title">
      <div className="site-container site-contact__box">
        <h2 className="site-section__title" id="contacto-title">
          {t.contact.title}
        </h2>
        <p className="site-contact__subtitle">{t.contact.subtitle}</p>
        <div className="site-actions site-actions--center">
          <a
            href={whatsappLink(t.whatsappMessage)}
            className="site-btn site-btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsApp />
            {t.contact.whatsapp}
          </a>
          <a href={mailto} className="site-btn site-btn--secondary">
            <IconMail />
            {t.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ lang }) {
  const t = TEXT[lang];

  useDocumentMeta({
    lang,
    title: t.meta.title,
    description: t.meta.description,
    path: ROUTES[lang].home,
    altEs: ROUTES.es.home,
    altIt: ROUTES.it.home,
  });

  return (
    <div className="site">
      <a href="#contenido" className="site-skip">
        {lang === "it" ? "Vai al contenuto" : "Ir al contenido"}
      </a>
      <SiteHeader lang={lang} page="home" />
      <main id="contenido">
        <Hero t={t} />
        <Services t={t} />
        <Cases t={t} lang={lang} />
        <Process t={t} />
        <About t={t} />
        <Contact t={t} />
      </main>
      <SiteFooter lang={lang} />
      <FloatingWhatsApp lang={lang} />
    </div>
  );
}
