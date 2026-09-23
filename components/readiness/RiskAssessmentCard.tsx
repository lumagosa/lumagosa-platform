import type {
  RiskAssessment,
  RiskLevel,
} from "../../lib/ride/types";

interface RiskAssessmentCardProps {
  assessment: RiskAssessment;
}

const riskClasses: Record<
  RiskLevel,
  string
> = {
  low:
    "border-emerald-200 bg-emerald-50 text-emerald-900",

  moderate:
    "border-amber-200 bg-amber-50 text-amber-950",

  high:
    "border-orange-300 bg-orange-50 text-orange-950",

  critical:
    "border-red-300 bg-red-50 text-red-950",
};

const scoreClasses: Record<
  RiskLevel,
  string
> = {
  low: "bg-emerald-700",
  moderate: "bg-amber-600",
  high: "bg-orange-700",
  critical: "bg-red-700",
};

export function RiskAssessmentCard({
  assessment,
}: RiskAssessmentCardProps) {
  return (
    <section
      aria-labelledby="risk-title"
      className={[
        "rounded-3xl border p-6 shadow-sm lg:p-8",
        riskClasses[assessment.level],
      ].join(" ")}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider opacity-70">
            Evaluación contextual
          </p>

          <h3
            id="risk-title"
            className="mt-2 text-2xl font-black"
          >
            {assessment.title}
          </h3>

          <p className="mt-3 leading-7 opacity-80">
            {assessment.summary}
          </p>
        </div>

        <div
          className={[
            "flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full text-white shadow-md",
            scoreClasses[assessment.level],
          ].join(" ")}
        >
          <span className="text-3xl font-black">
            {assessment.score}
          </span>

          <span className="text-xs font-semibold uppercase tracking-widest opacity-80">
            riesgo
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl bg-white/70 p-5">
          <h4 className="font-bold">
            Factores identificados
          </h4>

          <ul className="mt-4 space-y-3">
            {assessment.factors.map(
              (factor) => (
                <li
                  key={factor}
                  className="flex gap-3 text-sm leading-6"
                >
                  <span aria-hidden="true">
                    •
                  </span>

                  <span>{factor}</span>
                </li>
              ),
            )}
          </ul>
        </article>

        <article className="rounded-2xl bg-white/70 p-5">
          <h4 className="font-bold">
            Cómo reducir el riesgo
          </h4>

          <ul className="mt-4 space-y-3">
            {assessment.mitigations.map(
              (mitigation) => (
                <li
                  key={mitigation}
                  className="flex gap-3 text-sm leading-6"
                >
                  <span aria-hidden="true">
                    ✓
                  </span>

                  <span>
                    {mitigation}
                  </span>
                </li>
              ),
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}