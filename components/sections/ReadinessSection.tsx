import { readiness } from "../../data/home";
import { SectionHeading } from "../ui/SectionHeading";

export function ReadinessSection() {
  return (
    <section className="section readiness-section" id="hoy">
      <SectionHeading eyebrow="HOY PARA RODAR" title="Una respuesta clara antes de salir.">
        <p>Primera versión visual. El siguiente paso será conectarla con una fuente meteorológica real.</p>
      </SectionHeading>

      <article className="readiness-card">
        <div className="score-block">
          <span className="score">{readiness.score}</span>
          <span className="score-label">de 100</span>
        </div>

        <div className="readiness-copy">
          <span className="status-pill">{readiness.status}</span>
          <h3>{readiness.title}</h3>
          <p>
            Ventana recomendada: <strong>07:00–10:30</strong>. Lleva hidratación,
            protección solar y revisa la presión de tus llantas.
          </p>
        </div>

        <div className="weather-grid">
          {readiness.metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
