import type { RideRecommendation } from "../../lib/ride/types";

interface MetricsGridProps {
  recommendation: RideRecommendation;
}

export function MetricsGrid({
  recommendation,
}: MetricsGridProps) {
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