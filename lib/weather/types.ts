export interface WeatherHour {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  windSpeed: number;
  windGusts: number;
  humidity?: number;
  uvIndex?: number;
}

export interface WeatherSnapshot {
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  sunrise: string;
  sunset?: string;
  updatedAt: string;
  hours: WeatherHour[];
}