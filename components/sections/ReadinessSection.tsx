import { getRideReadiness } from "../../lib/weather/getRideReadiness";
import { SectionHeading } from "../ui/SectionHeading";

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

export async function ReadinessSection() {
  const readiness = await getRideReadiness();

  return (
    <section className="section readiness-section" id="hoy">
      <SectionHeading
        eyebrow="HOY PARA RODAR"
        title="Una respuesta clara antes de salir."
      >
        <p>
          Condiciones para {readiness.location}. Datos meteorológicos
          actualizados automáticamente.
        </p>
      </SectionHeading>

      <article className="readiness-card">
        <div className="score-block">
          <span className="score">{readiness.score}</span>
          <span className="score-label">de 100</span>
        </div>

        <div className="readiness-copy">
          <span className="status-pill">{readiness.status}</span>
          <h3>{readiness.title}</h3>
          <p>{readiness.description}</p>
          <p className="readiness-window">
            Mejor ventana: <strong>{readiness.recommendedWindow}</strong>
          </p>
          <small className="weather-source">
            Fuente: {readiness.source} · Actualizado:{" "}
            {formatUpdatedAt(readiness.updatedAt)}
            {readiness.isFallback ? " · Información de respaldo" : ""}
          </small>
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
