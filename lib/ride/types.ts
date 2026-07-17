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