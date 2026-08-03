export type RoutePhysicalDifficulty =
  | "easy"
  | "moderate"
  | "demanding"
  | "extreme";

export type RouteTechnicalDifficulty =
  | "basic"
  | "intermediate"
  | "advanced"
  | "expert";

export type RouteSurface =
  | "pavement"
  | "gravel"
  | "dirt"
  | "rock"
  | "mixed";

export type RouteExposureLevel =
  | "low"
  | "moderate"
  | "high";

export type RouteTrustLevel =
  | "lumagosa-verified"
  | "community-verified"
  | "partial";

export interface RouteProfile {
  id: string;
  name: string;
  region: string;
  description: string;

  distanceKm: number;
  elevationGainM: number;
  estimatedDurationMinutes: number;

  physicalDifficulty: RoutePhysicalDifficulty;
  technicalDifficulty: RouteTechnicalDifficulty;
  surface: RouteSurface;
  exposureLevel: RouteExposureLevel;
  trustLevel: RouteTrustLevel;
}