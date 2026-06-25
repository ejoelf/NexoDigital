import React, { useState } from "react";
import "../styles/Contact.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  business: "",
  message: "",
};

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
          "¡Gracias por escribirnos! Ya recibimos tu mensaje y te vamos a responder a la brevedad."
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
          "El formulario está listo, pero /contact.php no existe en el servidor actual. En local (Vite) no se puede enviar por PHP. Probalo una vez subido a Hostinger."
        );
      } else {
        setErrorMessage(
          "Ocurrió un error al enviar el mensaje. Probá de nuevo en unos minutos."
        );
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error : new Error("Error desconocido")
      );

      setErrorMessage(
        "No pudimos conectar con el servidor. Revisá tu conexión o intentá más tarde."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contacto" className="section section-contact">
      <div className="section-inner contact-inner">
        <div className="section-header center">
          <h2 className="section-title">¿Hablamos sobre tu proyecto?</h2>
          <p className="section-subtitle">
            Contanos qué tipo de negocio tenés y qué te gustaría mejorar. Te
            respondemos en el día con una propuesta clara.
          </p>
        </div>

        <div className="contact-grid">
          <form className="card contact-form" onSubmit={handleSubmit} noValidate>
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

            <div className="form-group">
              <label className="form-label" htmlFor="business">
                Tipo de negocio
              </label>
              <input
                id="business"
                name="business"
                type="text"
                className="form-input"
                placeholder="Peluquería, hotel, restaurante, comercio..."
                value={form.business}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">
                ¿Qué te gustaría mejorar?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="form-input form-textarea"
                placeholder="Contanos brevemente tu idea o proyecto."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {errorMessage && (
              <p className="contact-status contact-status--error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="contact-status contact-status--success">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>

          <div className="contact-side">
            <div className="card contact-highlight">
              <p className="contact-kicker">Contacto directo</p>
              <h3 className="contact-side-title">WhatsApp</h3>
              <p className="contact-text">
                Si preferís, escribinos por WhatsApp y coordinamos una llamada
                breve para conocer tu idea.
              </p>

              <a
                href="https://wa.me/5493585729499?text=Hola%2C%20estuve%20viendo%20la%20p%C3%A1gina%20de%20NexoDigital%20y%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20una%20soluci%C3%B3n%20para%20mi%20negocio." 
                className="btn btn-light contact-wa-btn"
                target="_blank"
                rel="noreferrer"
              >
                Abrir WhatsApp
              </a>

              <p className="contact-side-note">Respuesta en el día hábil.</p>
            </div>

           <div className="card contact-info">
  <p className="contact-kicker contact-kicker--muted">También podés seguirnos</p>
  <h3 className="contact-side-title">Redes</h3>

  <div className="contact-socials">
    <a
      className="contact-social"
      href="https://www.instagram.com/nexodigital_ar/"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram de NexoDigital"
      title="Instagram"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm5.25-.75a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5Z"/>
      </svg>
      <span className="contact-social-text">Instagram</span>
    </a>

  </div>

  <p className="contact-note">
    Publicamos novedades, trabajos y tips para mejorar tu negocio.
  </p>
</div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
