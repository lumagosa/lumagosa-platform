import type {
  RouteProfile,
  RouteVerificationStatus,
} from "./types";

export type RouteDataQualityLevel =
  | "insufficient"
  | "provisional"
  | "usable"
  | "verified";

export interface RouteDataQuality {
  score: number;
  level: RouteDataQualityLevel;
  label: string;
  missingFields: string[];
  warnings: string[];
}

function clampScore(score: number): number {
  return Math.max(
    0,
    Math.min(100, Math.round(score)),
  );
}

function getVerificationScore(
  status: RouteVerificationStatus,
): number {
  switch (status) {
    case "draft":
      return 5;

    case "field-review":
      return 20;

    case "verified":
      return 35;

    case "deprecated":
      return 0;
  }
}

function getQualityLevel(
  score: number,
): RouteDataQualityLevel {
  if (score >= 85) {
    return "verified";
  }

  if (score >= 65) {
    return "usable";
  }

  if (score >= 35) {
    return "provisional";
  }

  return "insufficient";
}

function getQualityLabel(
  level: RouteDataQualityLevel,
): string {
  switch (level) {
    case "insufficient":
      return "Información insuficiente";

    case "provisional":
      return "Información provisional";

    case "usable":
      return "Información utilizable";

    case "verified":
      return "Información verificada";
  }
}

export function assessRouteDataQuality(
  route: RouteProfile,
): RouteDataQuality {
  let score = 0;

  const missingFields: string[] = [];
  const warnings: string[] = [];

  if (route.distanceKm > 0) {
    score += 10;
  } else {
    missingFields.push("Distancia");
  }

  if (route.elevationGainM >= 0) {
    score += 10;
  } else {
    missingFields.push("Desnivel acumulado");
  }

  if (route.estimatedDurationMinutes > 0) {
    score += 5;
  } else {
    missingFields.push("Duración estimada");
  }

  if (route.startPoint) {
    score += 10;
  } else {
    missingFields.push("Punto de inicio");
  }

  if (route.endPoint) {
    score += 5;
  } else {
    missingFields.push("Punto final");
  }

  if (route.sources.length > 0) {
    score += 10;
  } else {
    missingFields.push("Fuente de información");
  }

  if (route.recommendedDisciplines.length > 0) {
    score += 5;
  } else {
    missingFields.push("Disciplinas recomendadas");
  }

  if (route.safetyFeatures.length > 0) {
    score += 10;
  } else {
    warnings.push(
      "No se han documentado puntos de agua, asistencia o escapatorias.",
    );
  }

  score += getVerificationScore(
    route.validation.status,
  );

  if (route.validation.status === "draft") {
    warnings.push(
      "La ruta sigue siendo un borrador y requiere verificación en campo.",
    );
  }

  if (route.validation.status === "deprecated") {
    warnings.push(
      "La ruta está marcada como obsoleta y no debe recomendarse.",
    );
  }

  const normalizedScore = clampScore(score);
  const level = getQualityLevel(
    normalizedScore,
  );

  return {
    score: normalizedScore,
    level,
    label: getQualityLabel(level),
    missingFields,
    warnings,
  };
}