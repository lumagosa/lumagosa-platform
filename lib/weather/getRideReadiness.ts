import { calculateRideReadiness } from "./calculateRideReadiness";
import type { RideReadiness } from "./types";

const TEOTIHUACAN = {
  name: "Teotihuacán de Arista",
  latitude: 19.686,
  longitude: -98.872,
};

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
};

const fallback: RideReadiness = {
  location: TEOTIHUACAN.name,
  score: 70,
  status: "Datos meteorológicos no disponibles",
  title: "Consulta nuevamente antes de salir.",
  description:
    "No pudimos actualizar el pronóstico. Revisa una fuente meteorológica adicional antes de iniciar tu rodada.",
  recommendedWindow: "Por confirmar",
  metrics: [
    { label: "Temperatura", value: "—" },
    { label: "Lluvia", value: "—" },
    { label: "Viento", value: "—" },
    { label: "Amanecer", value: "—" },
  ],
  source: "Open-Meteo",
  updatedAt: new Date().toISOString(),
  isFallback: true,
};

function formatHour(isoDate: string | undefined) {
  if (!isoDate) return "—";

  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Mexico_City",
  }).format(new Date(isoDate));
}

function getRecommendedWindow(data: OpenMeteoResponse) {
  const candidates = data.hourly.time
    .map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      rain: data.hourly.precipitation_probability[index],
      wind: data.hourly.wind_speed_10m[index],
    }))
    .filter((item) => {
      const hour = new Date(item.time).getHours();

      return (
        hour >= 6 &&
        hour <= 12 &&
        item.temperature >= 8 &&
        item.temperature <= 29 &&
        item.rain <= 30 &&
        item.wind <= 22
      );
    })
    .slice(0, 5);

  if (candidates.length === 0) return "Sin ventana óptima";

  return `${formatHour(candidates[0].time)}–${formatHour(
    candidates[candidates.length - 1].time,
  )}`;
}

export async function getRideReadiness(): Promise<RideReadiness> {
  const params = new URLSearchParams({
    latitude: String(TEOTIHUACAN.latitude),
    longitude: String(TEOTIHUACAN.longitude),
    timezone: "America/Mexico_City",
    forecast_days: "1",
    current:
      "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m",
    hourly:
      "temperature_2m,precipitation_probability,wind_speed_10m",
    daily: "sunrise,sunset",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      {
        next: { revalidate: 1800 },
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const data = (await response.json()) as OpenMeteoResponse;
    const currentIndex = data.hourly.time.findIndex(
      (time) => time.slice(0, 13) === data.current.time.slice(0, 13),
    );

    const precipitationProbability =
      data.hourly.precipitation_probability[Math.max(currentIndex, 0)] ?? 0;

    const result = calculateRideReadiness({
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      precipitationProbability,
      windSpeed: data.current.wind_speed_10m,
      windGusts: data.current.wind_gusts_10m,
      weatherCode: data.current.weather_code,
    });

    return {
      location: TEOTIHUACAN.name,
      score: result.score,
      status: result.status,
      title: result.title,
      description:
        "La recomendación combina temperatura, sensación térmica, lluvia, viento y condiciones meteorológicas actuales.",
      recommendedWindow: getRecommendedWindow(data),
      metrics: [
        {
          label: "Temperatura",
          value: `${Math.round(data.current.temperature_2m)} °C`,
        },
        {
          label: "Lluvia",
          value: `${Math.round(precipitationProbability)}%`,
        },
        {
          label: "Viento",
          value: `${Math.round(data.current.wind_speed_10m)} km/h`,
        },
        {
          label: "Amanecer",
          value: formatHour(data.daily.sunrise[0]),
        },
      ],
      source: "Open-Meteo",
      updatedAt: data.current.time,
      isFallback: false,
    };
  } catch (error) {
    console.error("Unable to load weather data", error);
    return fallback;
  }
}
