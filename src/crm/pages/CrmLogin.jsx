import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function CrmLogin() {
  const { authError, isAuthenticating, login } = useAuth();
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
      <section className="crm-login-panel">
        <div className="crm-login-brand">
          <img src="/brand/nexodigital-logo-horizontal.svg" alt="NexoDigital" />
          <p>Panel privado para operar clientes, proyectos y servicios.</p>
        </div>

        <form className="crm-login-form" onSubmit={handleSubmit}>
          <div className="crm-login-copy">
            <p className="crm-eyebrow">Acceso interno</p>
            <h1>CRM NexoDigital</h1>
            <span>
              Ingresa con tu usuario interno para acceder al panel privado.
            </span>
          </div>

          {authError ? (
            <p className="crm-login-error" role="alert">
              {authError}
            </p>
          ) : null}

          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleChange}
              placeholder="admin@nexodigital.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              required
              type="password"
              value={form.password}
            />
          </label>

          <button
            className="crm-button crm-button--primary"
            disabled={isAuthenticating}
            type="submit"
          >
            {isAuthenticating ? "Ingresando..." : "Entrar al panel"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CrmLogin;
