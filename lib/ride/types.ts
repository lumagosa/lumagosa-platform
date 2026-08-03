import type { WeatherSnapshot } from "../weather/types";

export type RideRecommendationLevel =
  | "excellent"
  | "good"
  | "fair"
  | "poor";

export type RideDiscipline =
  | "road"
  | "xc"
  | "trail"
  | "enduro"
  | "gravel"
  | "urban";

export type RiderExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type RiderGoal =
  | "recreation"
  | "fitness"
  | "performance"
  | "exploration";

export interface RiderProfile {
  experienceLevel: RiderExperienceLevel;
  goal: RiderGoal;
}

export interface RideProfile {
  discipline: RideDiscipline;
  displayName: string;

  idealTemperatureMin: number;
  idealTemperatureMax: number;

  maxWind: number;
  maxPrecipitationProbability: number;
  maxHumidity: number;
  maxUvIndex: number;

  windPenalty: number;
  rainPenalty: number;
  temperaturePenalty: number;
  humidityPenalty: number;
  uvPenalty: number;
}

export interface RideContext {
  weather: WeatherSnapshot;
  rideProfile: RideProfile;
  riderProfile: RiderProfile;
}

export interface RiderModifierDefinition {
  windToleranceMultiplier: number;
  rainToleranceMultiplier: number;

  minimumTemperatureAdjustment: number;
  maximumTemperatureAdjustment: number;

  windPenaltyMultiplier: number;
  rainPenaltyMultiplier: number;
  temperaturePenaltyMultiplier: number;
}

export interface ResolvedRideProfile {
  profile: RideProfile;
  personalizationReasons: string[];
  personalizationWarnings: string[];
}

export interface RideMetric {
  label: string;
  value: string;
}

export interface RideRecommendation {
  location: string;
  score: number;
  level: RideRecommendationLevel;
  title: string;
  recommendation: string;
  bestWindow: string;
  reasons: string[];
  warnings: string[];
  metrics: RideMetric[];
  source: string;
  updatedAt: string;
}