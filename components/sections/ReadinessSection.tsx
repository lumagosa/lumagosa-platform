import { getRideRecommendation } from "../../lib/ride/getRideRecommendation";
import type {
  RideRecommendation,
  RideRecommendationLevel,
} from "../../lib/ride/types";
import { SectionHeading } from "../ui/SectionHeading";

const levelLabels: Record<RideRecommendationLevel, string> = {
  excellent: "Excelente",
  good: "Bueno",
  fair: "Aceptable",
  poor: "Desfavorable",
};

const levelClasses: Record<RideRecommendationLevel, string> = {
  excellent:
    "border-emerald-300 bg-emerald-50 text-emerald-800",
  good:
    "border-lime-300 bg-lime-50 text-lime-800",
  fair:
    "border-amber-300 bg-amber-50 text-amber-800",
  poor:
    "border-red-300 bg-red-50 text-red-800",
};

function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(updatedAt));
}

function ScoreCard({
  recommendation,
}: {
  recommendation: RideRecommendation;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div
            className={[
              "inline-flex rounded-full border px-3 py-1 text-sm font-semibold",
              levelClasses[recommendation.level],
            ].join(" ")}
          >
            {levelLabels[recommendation.level]}
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {recommendation.title}
          </h3>

          <p className="mt-3 text-base leading-7 text-slate-600">
            {recommendation.recommendation}
          </p>

          <p className="mt-4 text-sm font-medium text-slate-700">
            Mejor ventana estimada:{" "}
            <span className="font-bold">
              {recommendation.bestWindow}
            </span>
          </p>
        </div>

        <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-8 border-slate-100 bg-slate-950 text-white">
          <span className="text-4xl font-black">
            {recommendation.score}
          </span>

          <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">
            de 100
          </span>
        </div>
      </div>
    </article>
  );
}

function MetricsGrid({
  recommendation,
}: {
  recommendation: RideRecommendation;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recommendation.metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">
            {metric.label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-950">
            {metric.value}
          </p>
        </article>
      ))}
    </div>
  );
}

function ReasonsList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-slate-700"
            >
              <span aria-hidden="true">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}

export async function ReadinessSection() {
  const recommendation = await getRideRecommendation();

  return (
    <section
      id="hoy-para-rodar"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hoy para rodar"
          title={`Condiciones en ${recommendation.location}`}
        />

        <div className="mt-10 space-y-6">
          <ScoreCard recommendation={recommendation} />

          <MetricsGrid recommendation={recommendation} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ReasonsList
              title="¿Por qué esta recomendación?"
              items={recommendation.reasons}
              emptyMessage="No se identificaron ventajas destacables para esta ventana."
            />

            <ReasonsList
              title="Advertencias"
              items={recommendation.warnings}
              emptyMessage="No se identificaron advertencias relevantes."
            />
          </div>

          <footer className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Fuente meteorológica: {recommendation.source}</p>

            <p>
              Actualizado:{" "}
              {formatUpdatedAt(recommendation.updatedAt)}
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}