import type {
  ResolvedRideProfile,
  RideProfile,
  RiderExperienceLevel,
  RiderGoal,
  RiderModifierDefinition,
  RiderProfile,
} from "./types";

const NEUTRAL_MODIFIER: RiderModifierDefinition = {
  windToleranceMultiplier: 1,
  rainToleranceMultiplier: 1,
  minimumTemperatureAdjustment: 0,
  maximumTemperatureAdjustment: 0,
  windPenaltyMultiplier: 1,
  rainPenaltyMultiplier: 1,
  temperaturePenaltyMultiplier: 1,
};

const ExperienceModifiers: Record<
  RiderExperienceLevel,
  RiderModifierDefinition
> = {
  beginner: {
    windToleranceMultiplier: 0.8,
    rainToleranceMultiplier: 0.75,
    minimumTemperatureAdjustment: 2,
    maximumTemperatureAdjustment: -2,
    windPenaltyMultiplier: 1.2,
    rainPenaltyMultiplier: 1.25,
    temperaturePenaltyMultiplier: 1.15,
  },

  intermediate: {
    ...NEUTRAL_MODIFIER,
  },

  advanced: {
    windToleranceMultiplier: 1.15,
    rainToleranceMultiplier: 1.15,
    minimumTemperatureAdjustment: -1,
    maximumTemperatureAdjustment: 1,
    windPenaltyMultiplier: 0.9,
    rainPenaltyMultiplier: 0.9,
    temperaturePenaltyMultiplier: 0.95,
  },
};

const GoalModifiers: Record<
  RiderGoal,
  RiderModifierDefinition
> = {
  recreation: {
    windToleranceMultiplier: 0.9,
    rainToleranceMultiplier: 0.9,
    minimumTemperatureAdjustment: 1,
    maximumTemperatureAdjustment: -1,
    windPenaltyMultiplier: 1.1,
    rainPenaltyMultiplier: 1.1,
    temperaturePenaltyMultiplier: 1.1,
  },

  fitness: {
    ...NEUTRAL_MODIFIER,
  },

  performance: {
    windToleranceMultiplier: 1.1,
    rainToleranceMultiplier: 1.05,
    minimumTemperatureAdjustment: -1,
    maximumTemperatureAdjustment: 1,
    windPenaltyMultiplier: 0.95,
    rainPenaltyMultiplier: 0.95,
    temperaturePenaltyMultiplier: 0.95,
  },

  exploration: {
    windToleranceMultiplier: 1.05,
    rainToleranceMultiplier: 1.1,
    minimumTemperatureAdjustment: 0,
    maximumTemperatureAdjustment: 0,
    windPenaltyMultiplier: 0.95,
    rainPenaltyMultiplier: 0.9,
    temperaturePenaltyMultiplier: 1,
  },
};

function combineModifiers(
  experience: RiderModifierDefinition,
  goal: RiderModifierDefinition,
): RiderModifierDefinition {
  return {
    windToleranceMultiplier:
      experience.windToleranceMultiplier *
      goal.windToleranceMultiplier,

    rainToleranceMultiplier:
      experience.rainToleranceMultiplier *
      goal.rainToleranceMultiplier,

    minimumTemperatureAdjustment:
      experience.minimumTemperatureAdjustment +
      goal.minimumTemperatureAdjustment,

    maximumTemperatureAdjustment:
      experience.maximumTemperatureAdjustment +
      goal.maximumTemperatureAdjustment,

    windPenaltyMultiplier:
      experience.windPenaltyMultiplier *
      goal.windPenaltyMultiplier,

    rainPenaltyMultiplier:
      experience.rainPenaltyMultiplier *
      goal.rainPenaltyMultiplier,

    temperaturePenaltyMultiplier:
      experience.temperaturePenaltyMultiplier *
      goal.temperaturePenaltyMultiplier,
  };
}

function getExperienceReason(
  experienceLevel: RiderExperienceLevel,
): string {
  switch (experienceLevel) {
    case "beginner":
      return "La recomendación prioriza condiciones más controladas para un ciclista principiante.";

    case "intermediate":
      return "La recomendación utiliza una tolerancia equilibrada para un ciclista intermedio.";

    case "advanced":
      return "La recomendación considera la mayor experiencia del ciclista ante condiciones variables.";
  }
}

function getGoalReason(goal: RiderGoal): string {
  switch (goal) {
    case "recreation":
      return "Se priorizan comodidad y condiciones favorables porque el objetivo es recreativo.";

    case "fitness":
      return "Se mantiene un equilibrio entre condiciones ambientales y continuidad del entrenamiento.";

    case "performance":
      return "El objetivo de rendimiento permite una tolerancia moderadamente mayor a condiciones exigentes.";

    case "exploration":
      return "El objetivo de exploración admite cierta variabilidad ambiental sin ignorar los límites de seguridad.";
  }
}

function getPersonalizationWarnings(
  riderProfile: RiderProfile,
): string[] {
  const warnings: string[] = [];

  if (riderProfile.experienceLevel === "beginner") {
    warnings.push(
      "Como ciclista principiante, evita incrementar la dificultad técnica cuando el clima también sea desfavorable.",
    );
  }

  if (riderProfile.goal === "performance") {
    warnings.push(
      "El objetivo de rendimiento no elimina los riesgos asociados con viento, lluvia, temperatura o exposición ambiental.",
    );
  }

  return warnings;
}

function roundValue(value: number): number {
  return Math.round(value * 10) / 10;
}

export function resolveRideProfile(
  rideProfile: RideProfile,
  riderProfile: RiderProfile,
): ResolvedRideProfile {
  const experienceModifier =
    ExperienceModifiers[
      riderProfile.experienceLevel
    ];

  const goalModifier =
    GoalModifiers[riderProfile.goal];

  const modifier = combineModifiers(
    experienceModifier,
    goalModifier,
  );

  const adjustedMinimum =
    rideProfile.idealTemperatureMin +
    modifier.minimumTemperatureAdjustment;

  const adjustedMaximum =
    rideProfile.idealTemperatureMax +
    modifier.maximumTemperatureAdjustment;

  const profile: RideProfile = {
    ...rideProfile,

    idealTemperatureMin: roundValue(
      Math.min(
        adjustedMinimum,
        adjustedMaximum,
      ),
    ),

    idealTemperatureMax: roundValue(
      Math.max(
        adjustedMinimum,
        adjustedMaximum,
      ),
    ),

    maxWind: roundValue(
      rideProfile.maxWind *
        modifier.windToleranceMultiplier,
    ),

    maxPrecipitationProbability: Math.min(
      100,
      roundValue(
        rideProfile.maxPrecipitationProbability *
          modifier.rainToleranceMultiplier,
      ),
    ),

    windPenalty: Math.max(
      0,
      roundValue(
        rideProfile.windPenalty *
          modifier.windPenaltyMultiplier,
      ),
    ),

    rainPenalty: Math.max(
      0,
      roundValue(
        rideProfile.rainPenalty *
          modifier.rainPenaltyMultiplier,
      ),
    ),

    temperaturePenalty: Math.max(
      0,
      roundValue(
        rideProfile.temperaturePenalty *
          modifier.temperaturePenaltyMultiplier,
      ),
    ),
  };

  return {
    profile,

    personalizationReasons: [
      getExperienceReason(
        riderProfile.experienceLevel,
      ),
      getGoalReason(
        riderProfile.goal,
      ),
    ],

    personalizationWarnings:
      getPersonalizationWarnings(
        riderProfile,
      ),
  };
}