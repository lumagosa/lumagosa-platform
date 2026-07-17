export type WeatherMetric = {
  label: string;
  value: string;
};

export type RideReadiness = {
  location: string;
  score: number;
  status: string;
  title: string;
  description: string;
  recommendedWindow: string;
  metrics: WeatherMetric[];
  source: string;
  updatedAt: string;
  isFallback: boolean;
};
