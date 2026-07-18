import type {
  RideRecommendation,
  RideRecommendationLevel,
} from "../../lib/ride/types";

const levelLabels: Record<
  RideRecommendationLevel,
  string
> = {
  excellent: "Excelente",
  good: "Bueno",
  fair: "Aceptable",
  poor: "Desfavorable",
};

const levelClasses: Record<
  RideRecommendationLevel,
  string
> = {
  excellent:
    "border-emerald-300 bg-emerald-50 text-emerald-800",
  good:
    "border-lime-300 bg-lime-50 text-lime-800",
  fair:
    "border-amber-300 bg-amber-50 text-amber-800",
  poor:
    "border-red-300 bg-red-50 text-red-800",
};

const scoreRingClasses: Record<
  RideRecommendationLevel,
  string
> = {
  excellent: "border-emerald-400",
  good: "border-lime-400",
  fair: "border-amber-400",
  poor: "border-red-400",
};

interface ScoreCardProps {
  recommendation: RideRecommendation;
}

export function ScoreCard({
  recommendation,
}: ScoreCardProps) {
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

        <div
          className={[
            "flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full border-8 bg-slate-950 text-white shadow-lg",
            scoreRingClasses[recommendation.level],
          ].join(" ")}
        >
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