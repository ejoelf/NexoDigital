import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LOGIN_CAPABILITIES = [
  "Clientes y oportunidades",
  "Proyectos y entregas",
  "Operación y alertas",
];

function CrmLogin() {
  const { authError, isAuthenticating, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isAuthenticating) return;
    login(form);
  };

  return (
    <main className="crm-login-page">
      <div className="crm-login-background" aria-hidden="true">
        <span className="crm-login-grid" />
        <span className="crm-login-orb crm-login-orb--blue" />
        <span className="crm-login-orb crm-login-orb--cyan" />
        <span className="crm-login-ring crm-login-ring--one" />
        <span className="crm-login-ring crm-login-ring--two" />
      </div>

      <header className="crm-login-topbar">
        <a href="/" className="crm-login-public-link">
          <span aria-hidden="true">←</span>
          Volver a NexoDigital
        </a>

        <div className="crm-login-private-badge">
          <i aria-hidden="true" />
          Entorno privado
        </div>
      </header>

      <section className="crm-login-panel" aria-labelledby="crm-login-title">
        <aside className="crm-login-brand">
          <div className="crm-login-brand-copy">
            <img
              src="/brand/nexodigital-monochrome-white.svg"
              alt="NexoDigital"
              className="crm-login-logo"
            />

            <p className="crm-login-brand-eyebrow">Command Center</p>
            <h1>
              Todo lo que construimos, conectado en un{" ""}
              <span>solo lugar.</span>
            </h1>
            <p className="crm-login-brand-text">
              El espacio operativo de NexoDigital para organizar clientes,
              proyectos, servicios y decisiones internas con una visión clara.
            </p>

            <div className="crm-login-capabilities" aria-label="Áreas del CRM">
              {LOGIN_CAPABILITIES.map((capability) => (
                <span key={capability}>
                  <i aria-hidden="true" />
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="crm-login-preview" aria-hidden="true">
            <div className="crm-login-preview-window">
              <div className="crm-login-preview-topbar">
                <span className="crm-login-preview-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>nexo / command-center</span>
                <strong>
                  <i /> conectado
                </strong>
              </div>

              <div className="crm-login-preview-shell">
                <div className="crm-login-preview-sidebar">
                  <img src="/brand/nexodigital-isotipo.svg" alt="" />
                  <span className="is-active" />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="crm-login-preview-content">
                  <div className="crm-login-preview-heading">
                    <div>
                      <small>Vista general</small>
                      <strong>Operación NexoDigital</strong>
                    </div>
                    <span>Hoy</span>
                  </div>

                  <div className="crm-login-preview-stats">
                    <div>
                      <small>Clientes</small>
                      <strong>Organizados</strong>
                      <i className="is-blue" />
                    </div>
                    <div>
                      <small>Proyectos</small>
                      <strong>En seguimiento</strong>
                      <i className="is-cyan" />
                    </div>
                    <div>
                      <small>Alertas</small>
                      <strong>Centralizadas</strong>
                      <i className="is-mixed" />
                    </div>
                  </div>

                  <div className="crm-login-preview-lower">
                    <div className="crm-login-preview-flow">
                      <div className="crm-login-preview-card-title">
                        <span>Flujo de trabajo</span>
                        <small>actividad interna</small>
                      </div>
                      <div className="crm-login-preview-bars">
                        <span style={{ "--preview-height": "34%" }} />
                        <span style={{ "--preview-height": "48%" }} />
                        <span style={{ "--preview-height": "42%" }} />
                        <span style={{ "--preview-height": "66%" }} />
                        <span style={{ "--preview-height": "76%" }} />
                        <span style={{ "--preview-height": "92%" }} />
                      </div>
                    </div>

                    <div className="crm-login-preview-activity">
                      <div className="crm-login-preview-card-title">
                        <span>Actividad</span>
                        <small>últimos movimientos</small>
                      </div>
                      <ul>
                        <li><i /> Consulta registrada</li>
                        <li><i /> Proyecto actualizado</li>
                        <li><i /> Seguimiento preparado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="crm-login-brand-footer">
            <span className="crm-login-security-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2.75 19 5.6v5.75c0 4.45-2.75 8.47-7 9.9-4.25-1.43-7-5.45-7-9.9V5.6L12 2.75Zm0 2.16L7 6.95v4.4c0 3.32 1.94 6.44 5 7.7 3.06-1.26 5-4.38 5-7.7v-4.4l-5-2.04Zm-.9 4.14h1.8v2.25h2.25v1.8H12.9v2.25h-1.8V13.1H8.85v-1.8h2.25V9.05Z" />
              </svg>
            </span>
            <p>
              <strong>Acceso reservado</strong>
              <small>Solo para integrantes autorizados de NexoDigital.</small>
            </p>
          </div>
        </aside>

        <div className="crm-login-access">
          <form
            className="crm-login-form"
            onSubmit={handleSubmit}
            aria-busy={isAuthenticating}
          >
            <div className="crm-login-copy">
              <p className="crm-eyebrow">Acceso interno</p>
              <h2 id="crm-login-title">Bienvenido al CRM.</h2>
              <span>
                Ingresá con tus credenciales para continuar al panel operativo.
              </span>
            </div>

            {authError ? (
              <div className="crm-login-error" role="alert">
                <span aria-hidden="true">!</span>
                <p>{authError}</p>
              </div>
            ) : null}

            <div className="crm-login-fields">
              <label className="crm-login-field" htmlFor="crm-login-email">
                <span>Email</span>
                <div className="crm-login-input-wrap">
                  <span className="crm-login-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M4.5 5.5h15A2.5 2.5 0 0 1 22 8v8a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16V8a2.5 2.5 0 0 1 2.5-2.5Zm0 2a.5.5 0 0 0-.5.5v.28l8 4.8 8-4.8V8a.5.5 0 0 0-.5-.5h-15ZM20 10.62l-7.49 4.5a1 1 0 0 1-1.02 0L4 10.62V16a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-5.38Z" />
                    </svg>
                  </span>
                  <input
                    id="crm-login-email"
                    autoComplete="email"
                    disabled={isAuthenticating}
                    name="email"
                    onChange={handleChange}
                    placeholder="tu-email@nexodigital.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </div>
              </label>

              <label className="crm-login-field" htmlFor="crm-login-password">
                <span>Contraseña</span>
                <div className="crm-login-input-wrap">
                  <span className="crm-login-input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M7 10V8a5 5 0 0 1 10 0v2h.5A2.5 2.5 0 0 1 20 12.5v6a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-6A2.5 2.5 0 0 1 6.5 10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Zm-2.5 2a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-11Zm5.5 2a1.5 1.5 0 0 1 .75 2.8V18h-1.5v-1.2A1.5 1.5 0 0 1 12 14Z" />
                    </svg>
                  </span>
                  <input
                    id="crm-login-password"
                    autoComplete="current-password"
                    disabled={isAuthenticating}
                    name="password"
                    onChange={handleChange}
                    placeholder="Ingresá tu contraseña"
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                  />
                  <button
                    type="button"
                    className="crm-login-password-toggle"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={isAuthenticating}
                  >
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                      {showPassword ? (
                        <path d="m3.27 2 18.73 18.73-1.27 1.27-3.16-3.16A11.74 11.74 0 0 1 12 20C6.55 20 2.24 16.52.4 12c.75-1.85 1.93-3.5 3.43-4.82L2 3.27 3.27 2Zm1.85 6.46A9.87 9.87 0 0 0 2.58 12C4.2 15.54 7.7 18 12 18c1.47 0 2.84-.3 4.05-.82l-1.58-1.58A4.98 4.98 0 0 1 7.4 8.53L5.12 8.46ZM12 4c5.45 0 9.76 3.48 11.6 8a12.9 12.9 0 0 1-2.62 4.02l-1.42-1.42A10.55 10.55 0 0 0 21.42 12C19.8 8.46 16.3 6 12 6c-.74 0-1.45.07-2.13.2L8.2 4.53A12.7 12.7 0 0 1 12 4Zm-.82 4.07 4.75 4.75A4 4 0 0 0 11.18 8.07Z" />
                      ) : (
                        <path d="M12 4c5.45 0 9.76 3.48 11.6 8-1.84 4.52-6.15 8-11.6 8S2.24 16.52.4 12C2.24 7.48 6.55 4 12 4Zm0 2C7.7 6 4.2 8.46 2.58 12 4.2 15.54 7.7 18 12 18s7.8-2.46 9.42-6C19.8 8.46 16.3 6 12 6Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                      )}
                    </svg>
                  </button>
                </div>
              </label>
            </div>

            <button
              className="crm-button crm-button--primary crm-login-submit"
              disabled={isAuthenticating}
              type="submit"
            >
              {isAuthenticating ? (
                <>
                  <span className="crm-login-spinner" aria-hidden="true" />
                  Validando acceso...
                </>
              ) : (
                <>
                  Entrar al panel
                  <span aria-hidden="true">↗</span>
                </>
              )}
            </button>

            <div className="crm-login-form-note">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 2a7 7 0 0 1 7 7v2h.5a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 19.5v-6A2.5 2.5 0 0 1 4.5 11H5V9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5v2h10V9a5 5 0 0 0-5-5Zm-7.5 9a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-15Z" />
                </svg>
              </span>
              <p>
                Tus credenciales se utilizan únicamente para validar el acceso al
                entorno interno.
              </p>
            </div>
          </form>

          <footer className="crm-login-access-footer">
            <span>CRM NexoDigital</span>
            <i aria-hidden="true" />
            <span>Acceso de equipo</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default CrmLogin;
