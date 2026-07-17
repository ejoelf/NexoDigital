import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import "../styles/IntelligenceAutomation.css";

const CAPABILITIES = [
  {
    title: "Atención más ágil",
    text: "Clasificá consultas, prepará respuestas y derivá cada contacto al lugar correcto.",
  },
  {
    title: "Operación conectada",
    text: "Uní formularios, email, calendarios, CRM y herramientas internas en un mismo flujo.",
  },
  {
    title: "Información que sirve",
    text: "Ordená datos, resumí actividad y convertí información dispersa en acciones concretas.",
  },
];

const WORKFLOW = [
  { step: "01", title: "Detectar", text: "Una consulta, evento o tarea activa el flujo." },
  { step: "02", title: "Interpretar", text: "La IA organiza el contexto y define el siguiente paso." },
  { step: "03", title: "Actuar", text: "El sistema responde, registra, deriva o notifica." },
  { step: "04", title: "Aprender", text: "El equipo conserva control y mejora el proceso." },
];

const USE_CASES = [
  {
    label: "Comercial",
    title: "Consultas que llegan ordenadas",
    text: "Captura, clasificación y seguimiento para que ninguna oportunidad quede perdida entre mensajes.",
  },
  {
    label: "Operaciones",
    title: "Menos tareas repetitivas",
    text: "Actualizaciones, avisos, documentos y movimientos de información ejecutados de forma consistente.",
  },
  {
    label: "Marketing",
    title: "Contenido y análisis con criterio",
    text: "Asistencia para planificar, adaptar y medir acciones sin reemplazar la decisión humana.",
  },
];

const ORBIT_NODES = [
  { x: "17%", y: "29%", delay: "0s", size: "6px" },
  { x: "76%", y: "20%", delay: "-1.1s", size: "5px" },
  { x: "86%", y: "57%", delay: "-2.4s", size: "7px" },
  { x: "63%", y: "83%", delay: "-3.2s", size: "5px" },
  { x: "24%", y: "75%", delay: "-4.1s", size: "6px" },
  { x: "42%", y: "12%", delay: "-1.8s", size: "4px" },
  { x: "9%", y: "53%", delay: "-2.8s", size: "4px" },
  { x: "52%", y: "91%", delay: "-3.7s", size: "4px" },
];

function IntelligenceAutomation() {
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
      };

  return (
    <section id="inteligencia" className="ai-section">
      <div className="ai-background" aria-hidden="true">
        <span className="ai-background-grid" />
        <span className="ai-background-glow ai-background-glow--blue" />
        <span className="ai-background-glow ai-background-glow--cyan" />
      </div>

      <div className="ai-container">
        <div className="ai-main-grid">
          <Motion.div
            className="ai-copy"
            {...reveal}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="ai-eyebrow">
              <span aria-hidden="true" />
              Inteligencia y automatización
            </p>

            <h2>
              Procesos más inteligentes.
              <span> Negocios más humanos.</span>
            </h2>

            <p className="ai-lead">
              Integramos inteligencia artificial y automatizaciones donde
              realmente reducen fricción: consultas, seguimiento, datos,
              contenido y tareas internas. La tecnología trabaja en segundo
              plano; tu equipo mantiene el criterio y el control.
            </p>

            <div className="ai-capabilities">
              {CAPABILITIES.map((capability, index) => (
                <Motion.article
                  key={capability.title}
                  className="ai-capability"
                  initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    duration: 0.48,
                    delay: reduceMotion ? 0 : index * 0.08,
                  }}
                >
                  <span className="ai-capability-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{capability.title}</strong>
                    <small>{capability.text}</small>
                  </span>
                </Motion.article>
              ))}
            </div>

            <div className="ai-actions">
              <a href="#contacto" className="btn btn-primary">
                Explorar una automatización
                <span aria-hidden="true">↗</span>
              </a>
              <p>Empezamos por una tarea concreta, no por una promesa abstracta.</p>
            </div>
          </Motion.div>

          <Motion.div
            className="ai-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92, x: 32 }}
            whileInView={
              reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }
            }
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ai-visual-status">
              <span className="ai-status-dot" aria-hidden="true" />
              Sistema inteligente conectado
            </div>

            <div
              className="ai-orbit-stage"
              aria-label="Representación visual de inteligencia artificial conectada con herramientas de negocio"
            >
              <span className="ai-connection ai-connection--one" aria-hidden="true" />
              <span className="ai-connection ai-connection--two" aria-hidden="true" />
              <span className="ai-connection ai-connection--three" aria-hidden="true" />
              <span className="ai-connection ai-connection--four" aria-hidden="true" />

              <div className="ai-tool ai-tool--messages">
                <span className="ai-tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path d="M5 5h14v10H9l-4 4V5Z" />
                    <path d="M9 9h6M9 12h4" />
                  </svg>
                </span>
                <span>
                  <strong>Consultas</strong>
                  <small>WhatsApp · Web</small>
                </span>
              </div>

              <div className="ai-tool ai-tool--crm">
                <span className="ai-tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <circle cx="8" cy="8" r="3" />
                    <path d="M3 19c.6-3 2.3-5 5-5s4.4 2 5 5" />
                    <path d="M16 7h5M16 11h5M16 15h5" />
                  </svg>
                </span>
                <span>
                  <strong>CRM</strong>
                  <small>Clientes · Seguimiento</small>
                </span>
              </div>

              <div className="ai-tool ai-tool--data">
                <span className="ai-tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <ellipse cx="12" cy="5" rx="7" ry="3" />
                    <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                    <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
                  </svg>
                </span>
                <span>
                  <strong>Datos</strong>
                  <small>Orden · Contexto</small>
                </span>
              </div>

              <div className="ai-tool ai-tool--actions">
                <span className="ai-tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="presentation">
                    <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />
                  </svg>
                </span>
                <span>
                  <strong>Acciones</strong>
                  <small>Email · Avisos · Tareas</small>
                </span>
              </div>

              <div className="ai-sphere-shell" aria-hidden="true">
                <span className="ai-orbit ai-orbit--outer" />
                <span className="ai-orbit ai-orbit--middle" />
                <span className="ai-orbit ai-orbit--tilted" />

                <div className="ai-sphere">
                  <span className="ai-sphere-surface" />
                  <span className="ai-sphere-grid ai-sphere-grid--one" />
                  <span className="ai-sphere-grid ai-sphere-grid--two" />
                  <span className="ai-sphere-grid ai-sphere-grid--three" />
                  <span className="ai-sphere-light" />

                  {ORBIT_NODES.map((node, index) => (
                    <span
                      key={`${node.x}-${node.y}`}
                      className="ai-particle"
                      style={{
                        "--particle-x": node.x,
                        "--particle-y": node.y,
                        "--particle-delay": node.delay,
                        "--particle-size": node.size,
                      }}
                    >
                      <i>{index + 1}</i>
                    </span>
                  ))}

                  <span className="ai-sphere-core">
                    <strong>IA</strong>
                    <small>aplicada</small>
                  </span>
                </div>
              </div>
            </div>

            <div className="ai-signal-panel">
              <div>
                <span className="ai-signal-icon" aria-hidden="true">↳</span>
                <span>
                  <small>Entrada detectada</small>
                  <strong>Nueva consulta comercial</strong>
                </span>
              </div>
              <span className="ai-signal-progress" aria-hidden="true">
                <i />
              </span>
              <div>
                <small>Siguiente acción</small>
                <strong>Clasificar y registrar</strong>
              </div>
            </div>
          </Motion.div>
        </div>

        <Motion.div
          className="ai-workflow"
          {...reveal}
          transition={{ duration: 0.68, delay: 0.08 }}
        >
          <div className="ai-workflow-header">
            <div>
              <p>Un flujo claro</p>
              <h3>De una señal dispersa a una acción útil.</h3>
            </div>
            <span>Automatización con supervisión humana</span>
          </div>

          <div className="ai-workflow-steps">
            {WORKFLOW.map((item, index) => (
              <article key={item.title} className="ai-workflow-step">
                <span className="ai-workflow-number">{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                {index < WORKFLOW.length - 1 ? (
                  <span className="ai-workflow-arrow" aria-hidden="true">→</span>
                ) : null}
              </article>
            ))}
          </div>
        </Motion.div>

        <div className="ai-usecases">
          {USE_CASES.map((useCase, index) => (
            <Motion.article
              key={useCase.label}
              className="ai-usecase"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.08 }}
            >
              <span>{useCase.label}</span>
              <h3>{useCase.title}</h3>
              <p>{useCase.text}</p>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IntelligenceAutomation;
