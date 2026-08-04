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

export type RouteVerificationStatus =
  | "draft"
  | "field-review"
  | "verified"
  | "deprecated";

export type RouteSourceType =
  | "manual"
  | "gpx"
  | "openstreetmap"
  | "community"
  | "external-provider";

export type RouteDiscipline =
  | "road"
  | "xc"
  | "trail"
  | "enduro"
  | "gravel"
  | "urban";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface RouteSource {
  type: RouteSourceType;
  name: string;
  reference?: string;
  collectedAt?: string;
}

export interface RouteValidation {
  status: RouteVerificationStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string[];
}

export interface RouteSafetyFeature {
  id: string;
  type:
    | "water"
    | "repair"
    | "escape"
    | "medical"
    | "shelter"
    | "warning";
  name: string;
  description?: string;
  location?: GeoPoint;
}

export interface RouteProfile {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;

  startPoint?: GeoPoint;
  endPoint?: GeoPoint;

  distanceKm: number;
  elevationGainM: number;
  estimatedDurationMinutes: number;

  physicalDifficulty: RoutePhysicalDifficulty;
  technicalDifficulty: RouteTechnicalDifficulty;
  surface: RouteSurface;
  exposureLevel: RouteExposureLevel;
  trustLevel: RouteTrustLevel;

  recommendedDisciplines: RouteDiscipline[];

  safetyFeatures: RouteSafetyFeature[];
  sources: RouteSource[];
  validation: RouteValidation;
}