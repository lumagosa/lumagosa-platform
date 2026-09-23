import type {
  RouteExposureLevel,
  RoutePhysicalDifficulty,
  RouteTechnicalDifficulty,
} from "../routes/types";
import type { WeatherHour } from "../weather/types";
import type {
  RideContext,
  RiderExperienceLevel,
  RiskAssessment,
  RiskLevel,
} from "./types";

const physicalDifficultyScores: Record<
  RoutePhysicalDifficulty,
  number
> = {
  easy: 5,
  moderate: 15,
  demanding: 30,
  extreme: 45,
};

const technicalDifficultyScores: Record<
  RouteTechnicalDifficulty,
  number
> = {
  basic: 0,
  intermediate: 12,
  advanced: 28,
  expert: 45,
};

const exposureScores: Record<
  RouteExposureLevel,
  number
> = {
  low: 0,
  moderate: 10,
  high: 24,
};

const experienceTechnicalTolerance: Record<
  RiderExperienceLevel,
  number
> = {
  beginner: 0,
  intermediate: 10,
  advanced: 22,
};

function clampRiskScore(score: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(score)),
  );
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) {
    return "critical";
  }

  if (score >= 50) {
    return "high";
  }

  if (score >= 25) {
    return "moderate";
  }

  return "low";
}

function getRiskTitle(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "Riesgo bajo";

    case "moderate":
      return "Riesgo moderado";

    case "high":
      return "Riesgo alto";

    case "critical":
      return "Riesgo crítico";
  }
}

function getRiskSummary(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "La combinación de ruta, perfil y ambiente no presenta riesgos destacados.";

    case "moderate":
      return "La rodada requiere preparación y atención a varios factores.";

    case "high":
      return "La combinación actual exige experiencia, equipo adecuado y una planificación cuidadosa.";

    case "critical":
      return "La combinación de ruta y condiciones no es recomendable sin reducir exposición o elegir una alternativa.";
  }
}

function getRelevantWeatherHour(
  context: RideContext,
): WeatherHour | undefined {
  const timezone =
    context.weather.timezone ||
    "America/Mexico_City";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [
        part.type,
        part.value,
      ]),
  );

  const currentHourKey =
    `${values.year}-${values.month}-${values.day}` +
    `T${values.hour}:00`;

  return (
    context.weather.hours.find(
      (hour) => hour.time >= currentHourKey,
    ) ?? context.weather.hours[0]
  );
}

function calculatePhysicalRisk(
  context: RideContext,
  factors: string[],
  mitigations: string[],
): number {
  const route = context.routeProfile;

  if (!route) {
    return 0;
  }

  let score =
    physicalDifficultyScores[
      route.physicalDifficulty
    ];

  if (route.distanceKm >= 50) {
    score += 15;
    factors.push(
      `Distancia elevada de ${route.distanceKm} km`,
    );
    mitigations.push(
      "Planifica hidratación, alimentación y puntos de abandono.",
    );
  } else if (route.distanceKm >= 30) {
    score += 8;
    factors.push(
      `Distancia considerable de ${route.distanceKm} km`,
    );
  }

  if (route.elevationGainM >= 1000) {
    score += 20;
    factors.push(
      `Desnivel acumulado elevado de ${route.elevationGainM} m+`,
    );
    mitigations.push(
      "Reduce intensidad y reserva energía para los ascensos finales.",
    );
  } else if (route.elevationGainM >= 600) {
    score += 10;
    factors.push(
      `Desnivel acumulado exigente de ${route.elevationGainM} m+`,
    );
  }

  if (
    context.riderProfile.experienceLevel ===
      "beginner" &&
    route.physicalDifficulty !== "easy"
  ) {
    score += 12;
    factors.push(
      "La exigencia física supera el nivel recomendado para un principiante.",
    );
    mitigations.push(
      "Considera una ruta más corta o con menor desnivel.",
    );
  }

  return score;
}

function calculateTechnicalRisk(
  context: RideContext,
  factors: string[],
  mitigations: string[],
): number {
  const route = context.routeProfile;

  if (!route) {
    return 0;
  }

  const baseTechnicalScore =
    technicalDifficultyScores[
      route.technicalDifficulty
    ];

  const tolerance =
    experienceTechnicalTolerance[
      context.riderProfile.experienceLevel
    ];

  const adjustedTechnicalScore = Math.max(
    0,
    baseTechnicalScore - tolerance,
  );

  if (adjustedTechnicalScore >= 20) {
    factors.push(
      `Dificultad técnica ${route.technicalDifficulty} para el nivel de experiencia seleccionado`,
    );

    mitigations.push(
      "Reduce velocidad en descensos y reconoce previamente los sectores técnicos.",
    );
  }

  if (
    route.surface === "rock" ||
    route.surface === "mixed"
  ) {
    factors.push(
      "La superficie puede incluir tramos irregulares o pérdida de adherencia.",
    );
  }

  return adjustedTechnicalScore;
}

function calculateExposureRisk(
  context: RideContext,
  factors: string[],
  mitigations: string[],
): number {
  const route = context.routeProfile;

  if (!route) {
    return 0;
  }

  const score =
    exposureScores[route.exposureLevel];

  if (route.exposureLevel === "high") {
    factors.push(
      "La ruta presenta sectores con exposición elevada.",
    );

    mitigations.push(
      "Evita recorrer sectores expuestos con viento, lluvia o visibilidad reducida.",
    );
  }

  return score;
}

function calculateWeatherRisk(
  context: RideContext,
  factors: string[],
  mitigations: string[],
): number {
  const hour = getRelevantWeatherHour(context);

  if (!hour) {
    factors.push(
      "No hay datos horarios suficientes para evaluar el riesgo ambiental.",
    );

    return 15;
  }

  let score = 0;

  if (hour.precipitationProbability >= 70) {
    score += 30;
    factors.push(
      `Probabilidad alta de lluvia: ${Math.round(
        hour.precipitationProbability,
      )}%`,
    );

    mitigations.push(
      "Pospón la salida o elige una ruta corta con escapatorias.",
    );
  } else if (
    hour.precipitationProbability >= 40
  ) {
    score += 15;
    factors.push(
      `Probabilidad moderada de lluvia: ${Math.round(
        hour.precipitationProbability,
      )}%`,
    );
  }

  if (hour.windGusts >= 50) {
    score += 28;
    factors.push(
      `Rachas fuertes de ${Math.round(
        hour.windGusts,
      )} km/h`,
    );

    mitigations.push(
      "Evita crestas, descensos rápidos y zonas abiertas.",
    );
  } else if (hour.windGusts >= 35) {
    score += 14;
    factors.push(
      `Rachas moderadas de ${Math.round(
        hour.windGusts,
      )} km/h`,
    );
  }

  if (
    hour.temperature >= 33 ||
    hour.apparentTemperature >= 35
  ) {
    score += 20;
    factors.push(
      "Temperatura o sensación térmica elevada.",
    );

    mitigations.push(
      "Reduce duración, evita horas centrales y aumenta hidratación.",
    );
  }

  if (
    hour.uvIndex !== undefined &&
    hour.uvIndex >= 8
  ) {
    score += 12;
    factors.push(
      `Exposición UV muy alta: ${hour.uvIndex.toFixed(
        1,
      )}`,
    );

    mitigations.push(
      "Usa protección solar, gafas y ropa adecuada.",
    );
  }

  return score;
}

function calculateTrustRisk(
  context: RideContext,
  factors: string[],
  mitigations: string[],
): number {
  const route = context.routeProfile;

  if (!route) {
    return 0;
  }

  if (route.trustLevel === "partial") {
    factors.push(
      "La información de la ruta todavía es parcial.",
    );

    mitigations.push(
      "Confirma trazado, accesos y condiciones locales antes de salir.",
    );

    return 10;
  }

  return 0;
}

function removeDuplicates(
  values: string[],
): string[] {
  return [...new Set(values)];
}

export function assessRideRisk(
  context: RideContext,
): RiskAssessment | undefined {
  if (!context.routeProfile) {
    return undefined;
  }

  const factors: string[] = [];
  const mitigations: string[] = [];

  const rawScore =
    calculatePhysicalRisk(
      context,
      factors,
      mitigations,
    ) +
    calculateTechnicalRisk(
      context,
      factors,
      mitigations,
    ) +
    calculateExposureRisk(
      context,
      factors,
      mitigations,
    ) +
    calculateWeatherRisk(
      context,
      factors,
      mitigations,
    ) +
    calculateTrustRisk(
      context,
      factors,
      mitigations,
    );

  const score = clampRiskScore(rawScore);
  const level = getRiskLevel(score);

  if (factors.length === 0) {
    factors.push(
      "No se identificaron factores de riesgo destacados.",
    );
  }

  if (mitigations.length === 0) {
    mitigations.push(
      "Mantén revisión mecánica, hidratación y comunicación del itinerario.",
    );
  }

  return {
    score,
    level,
    title: getRiskTitle(level),
    summary: getRiskSummary(level),
    factors: removeDuplicates(factors),
    mitigations: removeDuplicates(
      mitigations,
    ),
  };
}