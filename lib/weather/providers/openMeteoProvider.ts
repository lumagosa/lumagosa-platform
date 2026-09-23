import type { WeatherSnapshot } from "../types";

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const LOCATION = {
  name: "Teotihuacán de Arista",
  latitude: 19.6863,
  longitude: -98.8716,
};

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;

  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    uv_index: number[];
  };

  daily: {
    sunrise: string[];
    sunset: string[];
  };
}

export async function getWeatherFromOpenMeteo(): Promise<WeatherSnapshot> {
  const parameters = new URLSearchParams({
    latitude: LOCATION.latitude.toString(),
    longitude: LOCATION.longitude.toString(),
    hourly: [
      "temperature_2m",
      "apparent_temperature",
      "precipitation_probability",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_gusts_10m",
      "uv_index",
    ].join(","),
    daily: ["sunrise", "sunset"].join(","),
    timezone: "America/Mexico_City",
    forecast_days: "2",
  });

  const response = await fetch(`${OPEN_METEO_URL}?${parameters.toString()}`, {
    next: {
      revalidate: 1800,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Open-Meteo respondió con código ${response.status}`,
    );
  }

  const data = (await response.json()) as OpenMeteoResponse;

  const hours = data.hourly.time.map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    apparentTemperature: data.hourly.apparent_temperature[index],
    precipitationProbability:
      data.hourly.precipitation_probability[index],
    humidity: data.hourly.relative_humidity_2m[index],
    windSpeed: data.hourly.wind_speed_10m[index],
    windGusts: data.hourly.wind_gusts_10m[index],
    uvIndex: data.hourly.uv_index[index],
  }));

  return {
    location: LOCATION.name,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
    updatedAt: new Date().toISOString(),
    hours,
  };
}