import React, { useState } from "react";
import "../styles/Contact.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  business: "",
  message: "",
};

const PROJECT_TYPES = [
  "Web o landing",
  "App móvil",
  "CRM o software",
  "SaaS",
  "Automatización e IA",
  "Marketing y redes",
];

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!form.name || !form.email || !form.message) {
      setErrorMessage("Por favor completá al menos nombre, email y mensaje.");
      return;
    }

    const isValidEmail = /\S+@\S+\.\S+/.test(form.email);
    if (!isValidEmail) {
      setErrorMessage("El email no parece válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append("name", form.name);
      params.append("email", form.email);
      params.append("business", form.business);
      params.append("message", form.message);

      const response = await fetch("/contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: params.toString(),
      });

      const rawText = await response.text();
      let data = null;

      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (response.ok && data && data.ok) {
        setSuccessMessage(
          "¡Gracias por escribirnos! Recibimos tu mensaje y vamos a revisarlo personalmente."
        );
        setForm(INITIAL_FORM);
        return;
      }

      console.error("Contact form error:", {
        status: response.status,
        statusText: response.statusText,
        data: data ?? "(sin JSON)",
        rawTextPreview: rawText ? rawText.slice(0, 200) : "(vacío)",
      });

      if (response.status === 404) {
        setErrorMessage(
          "El envío directo no está disponible en este entorno. Podés escribirnos por WhatsApp o email."
        );
      } else {
        setErrorMessage(
          "Ocurrió un error al enviar el mensaje. Probá nuevamente o contactanos por WhatsApp."
        );
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error : new Error("Error desconocido")
      );

      setErrorMessage(
        "No pudimos conectar con el servidor. Revisá tu conexión o escribinos por WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contacto" className="section section-contact">
      <div className="contact-background" aria-hidden="true">
        <span className="contact-grid-lines" />
        <span className="contact-orb contact-orb--blue" />
        <span className="contact-orb contact-orb--cyan" />
      </div>

      <div className="section-inner contact-inner">
        <div className="contact-header">
          <div>
            <p className="contact-eyebrow">Empecemos por una conversación</p>
            <h2 className="section-title">
              Contanos dónde está hoy tu negocio y{" ""}
              <span>hasta dónde querés llevarlo.</span>
            </h2>
          </div>

          <p className="contact-intro">
            No hace falta que sepas qué tecnología necesitás. Explicanos el
            objetivo, el problema o la idea y te ayudamos a convertirlo en un
            camino concreto.
          </p>
        </div>

        <div className="contact-project-types" aria-label="Tipos de proyectos">
          {PROJECT_TYPES.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-heading">
              <div>
                <p>Tu proyecto</p>
                <h3>Contanos lo esencial</h3>
              </div>
              <span>01</span>
            </div>

            <div className="contact-form-fields">
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="Cómo te llamás"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="business">
                  Negocio, marca o proyecto
                </label>
                <input
                  id="business"
                  name="business"
                  type="text"
                  className="form-input"
                  placeholder="Peluquería, comercio, empresa, producto digital..."
                  value={form.business}
                  onChange={handleChange}
                  autoComplete="organization"
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label" htmlFor="message">
                  ¿Qué te gustaría crear o mejorar?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="form-input form-textarea"
                  placeholder="Contanos qué necesitás resolver, qué idea tenés o qué parte de tu negocio querés transformar."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="contact-form-footer">
              <div className="contact-form-note">
                <span aria-hidden="true">✓</span>
                <p>Leemos cada consulta y respondemos con contexto, no con mensajes automáticos.</p>
              </div>

              {errorMessage && (
                <p
                  className="contact-status contact-status--error"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p
                  className="contact-status contact-status--success"
                  role="status"
                >
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar consulta"}
                {!isSubmitting && <span aria-hidden="true">↗</span>}
              </button>
            </div>
          </form>

          <aside className="contact-side">
            <div className="contact-next-steps">
              <p className="contact-side-kicker">Qué pasa después</p>
              <h3>Un primer paso simple y sin vueltas.</h3>

              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <strong>Revisamos tu consulta</strong>
                    <p>Entendemos el contexto y detectamos qué información falta.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Coordinamos una conversación</strong>
                    <p>Profundizamos en el objetivo, alcance y prioridades.</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Definimos el camino</strong>
                    <p>Te proponemos una solución y los próximos pasos posibles.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="contact-channels">
              <p className="contact-side-kicker">Contacto directo</p>

              <a
                className="contact-channel contact-channel--primary"
                href="https://wa.me/5493585729499?text=Hola%2C%20estuve%20viendo%20la%20p%C3%A1gina%20de%20NexoDigital%20y%20me%20gustar%C3%ADa%20contarles%20sobre%20mi%20proyecto."
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-channel-icon" aria-hidden="true">W</span>
                <div>
                  <strong>WhatsApp</strong>
                  <small>Escribinos directamente</small>
                </div>
                <i aria-hidden="true">↗</i>
              </a>

              <a
                className="contact-channel"
                href="mailto:contacto.nexod@gmail.com"
              >
                <span className="contact-channel-icon" aria-hidden="true">@</span>
                <div>
                  <strong>Email</strong>
                  <small>contacto.nexod@gmail.com</small>
                </div>
                <i aria-hidden="true">↗</i>
              </a>

              <a
                className="contact-channel"
                href="https://www.instagram.com/nexodigital_ar/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-channel-icon" aria-hidden="true">◎</span>
                <div>
                  <strong>Instagram</strong>
                  <small>@nexodigital_ar</small>
                </div>
                <i aria-hidden="true">↗</i>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Contact;
