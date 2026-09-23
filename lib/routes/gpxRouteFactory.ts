import type {
  GpxAnalysis,
  GpxQualityLevel,
} from "./gpxAnalyzer";
import type {
  RoutePhysicalDifficulty,
  RouteProfile,
  RouteTechnicalDifficulty,
  RouteVerificationStatus,
} from "./types";

function createSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function inferPhysicalDifficulty(
  distanceKm: number,
  elevationGainM: number,
): RoutePhysicalDifficulty {
  const effortIndex =
    distanceKm + elevationGainM / 25;

  if (effortIndex >= 75) {
    return "extreme";
  }

  if (effortIndex >= 45) {
    return "demanding";
  }

  if (effortIndex >= 22) {
    return "moderate";
  }

  return "easy";
}

function inferTechnicalDifficulty(
  qualityLevel: GpxQualityLevel,
): RouteTechnicalDifficulty {
  /*
   * Un GPX describe geometría y elevación,
   * pero no identifica obstáculos, escalones,
   * roca suelta o dificultad de los descensos.
   *
   * Por seguridad asignamos una clasificación
   * conservadora que deberá confirmarse después.
   */
  if (
    qualityLevel === "complete" ||
    qualityLevel === "usable"
  ) {
    return "intermediate";
  }

  return "basic";
}

function getVerificationStatus(
  qualityLevel: GpxQualityLevel,
): RouteVerificationStatus {
  if (
    qualityLevel === "complete" ||
    qualityLevel === "usable"
  ) {
    return "field-review";
  }

  return "draft";
}

function getEstimatedDurationMinutes(
  analysis: GpxAnalysis,
): number {
  if (
    analysis.durationMinutes !== undefined &&
    analysis.durationMinutes > 0
  ) {
    return Math.round(
      analysis.durationMinutes,
    );
  }

  /*
   * Estimación inicial conservadora para MTB.
   * La duración real dependerá del terreno,
   * la condición física y las pausas.
   */
  const movementMinutes =
    analysis.distanceKm * 4.5;

  const climbingMinutes =
    analysis.elevationGainM / 12;

  return Math.max(
    30,
    Math.round(
      movementMinutes + climbingMinutes,
    ),
  );
}

function getValidationNotes(
  analysis: GpxAnalysis,
): string[] {
  const notes = [
    "La geometría, distancia y elevación proceden de un archivo GPX cargado por el usuario.",
    "La dificultad técnica, superficie y exposición todavía requieren validación.",
    "La ruta temporal no ha sido publicada ni almacenada en el catálogo de LUMAGOSA.",
  ];

  return [
    ...notes,
    ...analysis.warnings,
  ];
}

export function createRouteProfileFromGpx(
  analysis: GpxAnalysis,
): RouteProfile {
  const slugBase =
    createSlug(analysis.trackName) ||
    "ruta-gpx";

  const uniqueSuffix = [
    analysis.pointCount,
    Math.round(analysis.distanceKm * 100),
  ].join("-");

  return {
    id: `gpx-${slugBase}-${uniqueSuffix}`,
    slug: `${slugBase}-${uniqueSuffix}`,

    name: analysis.trackName,

    region: "Ruta importada mediante GPX",

    description:
      "Ruta temporal construida a partir de un archivo GPX. Sus datos geométricos proceden del registro cargado; la superficie, exposición y dificultad técnica siguen siendo provisionales.",

    startPoint: {
      latitude:
        analysis.startPoint.latitude,
      longitude:
        analysis.startPoint.longitude,
    },

    endPoint: {
      latitude:
        analysis.endPoint.latitude,
      longitude:
        analysis.endPoint.longitude,
    },

    distanceKm:
      analysis.distanceKm,

    elevationGainM:
      analysis.elevationGainM,

    estimatedDurationMinutes:
      getEstimatedDurationMinutes(
        analysis,
      ),

    physicalDifficulty:
      inferPhysicalDifficulty(
        analysis.distanceKm,
        analysis.elevationGainM,
      ),

    technicalDifficulty:
      inferTechnicalDifficulty(
        analysis.qualityLevel,
      ),

    surface: "mixed",
    exposureLevel: "moderate",
    trustLevel: "partial",

    recommendedDisciplines: [
      "xc",
      "trail",
      "gravel",
    ],

    safetyFeatures: [],

    sources: [
      {
        type: "gpx",
        name: analysis.fileName,
        collectedAt:
          analysis.startedAt,
      },
    ],

    validation: {
      status:
        getVerificationStatus(
          analysis.qualityLevel,
        ),

      notes:
        getValidationNotes(analysis),
    },
  };
}