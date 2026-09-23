import type { RouteProfile } from "./types";

export const RouteCatalog: readonly RouteProfile[] = [
  {
    id: "teotihuacan-valley-loop",
    slug: "circuito-valle-teotihuacan",
    name: "Circuito Valle de Teotihuacán",
    region: "Valle de Teotihuacán, Estado de México",
    description:
      "Circuito piloto con caminos rurales, tramos de terracería y vistas del entorno del Valle de Teotihuacán.",

    distanceKm: 26,
    elevationGainM: 310,
    estimatedDurationMinutes: 150,

    physicalDifficulty: "moderate",
    technicalDifficulty: "basic",
    surface: "mixed",
    exposureLevel: "moderate",
    trustLevel: "partial",

    recommendedDisciplines: [
      "xc",
      "gravel",
      "trail",
    ],

    safetyFeatures: [],

    sources: [
      {
        type: "manual",
        name: "Catálogo piloto de Proyecto Tepetl",
      },
    ],

    validation: {
      status: "draft",
      notes: [
        "Distancia y desnivel requieren confirmación mediante registro GPX.",
        "El trazado, accesos y condiciones de paso todavía deben revisarse en campo.",
        "No debe publicarse como ruta definitivamente verificada.",
      ],
    },
  },

  {
    id: "otumba-trails",
    slug: "senderos-otumba",
    name: "Senderos de Otumba",
    region: "Otumba, Estado de México",
    description:
      "Recorrido piloto orientado al desarrollo de técnica y resistencia sobre caminos de tierra y terreno ondulado.",

    distanceKm: 18,
    elevationGainM: 240,
    estimatedDurationMinutes: 110,

    physicalDifficulty: "easy",
    technicalDifficulty: "intermediate",
    surface: "dirt",
    exposureLevel: "low",
    trustLevel: "partial",

    recommendedDisciplines: [
      "xc",
      "trail",
    ],

    safetyFeatures: [],

    sources: [
      {
        type: "manual",
        name: "Catálogo piloto de Proyecto Tepetl",
      },
    ],

    validation: {
      status: "draft",
      notes: [
        "El nombre representa una zona piloto, no un trazado GPX validado.",
        "Deben confirmarse propiedad de caminos, accesos y sentido recomendado.",
      ],
    },
  },

  {
    id: "volcanic-circuit",
    slug: "circuito-volcanico",
    name: "Circuito Volcánico",
    region: "Valle de Teotihuacán, Estado de México",
    description:
      "Concepto de ruta de mayor exigencia física con ascensos acumulados, terreno rocoso y sectores potencialmente expuestos.",

    distanceKm: 34,
    elevationGainM: 720,
    estimatedDurationMinutes: 240,

    physicalDifficulty: "demanding",
    technicalDifficulty: "advanced",
    surface: "rock",
    exposureLevel: "high",
    trustLevel: "partial",

    recommendedDisciplines: [
      "xc",
      "trail",
      "enduro",
    ],

    safetyFeatures: [],

    sources: [
      {
        type: "manual",
        name: "Catálogo piloto de Proyecto Tepetl",
      },
    ],

    validation: {
      status: "draft",
      notes: [
        "La dificultad técnica es una clasificación preliminar.",
        "Se requiere levantamiento GPX y revisión de sectores expuestos.",
        "No se han registrado todavía puntos de agua, escapatorias o asistencia.",
      ],
    },
  },
];

export const DefaultRouteProfile: RouteProfile =
  RouteCatalog[0];

export function getRouteProfile(
  routeId: string,
): RouteProfile {
  return (
    RouteCatalog.find(
      (route) => route.id === routeId,
    ) ?? DefaultRouteProfile
  );
}