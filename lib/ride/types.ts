export type RideRecommendationLevel =
  | "excellent"
  | "good"
  | "fair"
  | "poor";

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