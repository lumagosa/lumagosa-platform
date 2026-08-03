import type { RouteProfile } from "./types";

export const RouteCatalog: readonly RouteProfile[] = [
  {
    id: "teotihuacan-valley-loop",
    name: "Circuito Valle de Teotihuacán",
    region: "Valle de Teotihuacán, Estado de México",
    description:
      "Circuito piloto con caminos rurales, tramos de terracería y vistas del entorno arqueológico.",

    distanceKm: 26,
    elevationGainM: 310,
    estimatedDurationMinutes: 150,

    physicalDifficulty: "moderate",
    technicalDifficulty: "basic",
    surface: "mixed",
    exposureLevel: "moderate",
    trustLevel: "lumagosa-verified",
  },

  {
    id: "otumba-trails",
    name: "Senderos de Otumba",
    region: "Otumba, Estado de México",
    description:
      "Recorrido corto para desarrollar técnica y resistencia sobre caminos de tierra y terreno ondulado.",

    distanceKm: 18,
    elevationGainM: 240,
    estimatedDurationMinutes: 110,

    physicalDifficulty: "easy",
    technicalDifficulty: "intermediate",
    surface: "dirt",
    exposureLevel: "low",
    trustLevel: "partial",
  },

  {
    id: "volcanic-circuit",
    name: "Circuito Volcánico",
    region: "Valle de Teotihuacán, Estado de México",
    description:
      "Ruta de mayor exigencia física con ascensos acumulados, terreno rocoso y sectores expuestos.",

    distanceKm: 34,
    elevationGainM: 720,
    estimatedDurationMinutes: 240,

    physicalDifficulty: "demanding",
    technicalDifficulty: "advanced",
    surface: "rock",
    exposureLevel: "high",
    trustLevel: "partial",
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