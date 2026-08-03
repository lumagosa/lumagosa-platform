import { calculateRideRecommendation } from "./calculateRideRecommendation";
import { assessRideRisk } from "./riskEngine";
import { resolveRideProfile } from "./riderModifiers";
import type {
  RideContext,
  RideRecommendation,
  RiderExperienceLevel,
  RiderGoal,
} from "./types";

export interface RecommendationEngine {
  evaluate(
    context: RideContext,
  ): RideRecommendation;
}

function removeDuplicates(
  values: string[],
): string[] {
  return [...new Set(values)];
}

function getExperienceLabel(
  experienceLevel: RiderExperienceLevel,
): string {
  switch (experienceLevel) {
    case "beginner":
      return "Principiante";

    case "intermediate":
      return "Intermedio";

    case "advanced":
      return "Avanzado";
  }
}

function getGoalLabel(
  goal: RiderGoal,
): string {
  switch (goal) {
    case "recreation":
      return "Recreación";

    case "fitness":
      return "Condición física";

    case "performance":
      return "Rendimiento";

    case "exploration":
      return "Exploración";
  }
}

export const recommendationEngine: RecommendationEngine =
  {
    evaluate(
      context: RideContext,
    ): RideRecommendation {
      const resolved =
        resolveRideProfile(
          context.rideProfile,
          context.riderProfile,
        );

      const recommendation =
        calculateRideRecommendation(
          context.weather,
          resolved.profile,
        );

      const riskAssessment =
        assessRideRisk(context);

      const routeMetrics = context.routeProfile
        ? [
            {
              label: "Ruta",
              value:
                context.routeProfile.name,
            },
            {
              label: "Distancia",
              value:
                `${context.routeProfile.distanceKm} km`,
            },
            {
              label: "Desnivel",
              value:
                `${context.routeProfile.elevationGainM} m+`,
            },
          ]
        : [];

      const riskWarnings =
        riskAssessment &&
        (
          riskAssessment.level === "high" ||
          riskAssessment.level === "critical"
        )
          ? [
              `${riskAssessment.title}: ${riskAssessment.summary}`,
            ]
          : [];

      return {
        ...recommendation,

        reasons: removeDuplicates([
          ...resolved.personalizationReasons,
          ...recommendation.reasons,
        ]),

        warnings: removeDuplicates([
          ...recommendation.warnings,
          ...resolved.personalizationWarnings,
          ...riskWarnings,
        ]),

        metrics: [
          {
            label: "Experiencia",
            value: getExperienceLabel(
              context.riderProfile
                .experienceLevel,
            ),
          },
          {
            label: "Objetivo",
            value: getGoalLabel(
              context.riderProfile.goal,
            ),
          },
          ...routeMetrics,
          ...recommendation.metrics,
        ],

        riskAssessment,
      };
    },
  };