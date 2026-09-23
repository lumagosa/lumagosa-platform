import type {
  WeatherHour,
  WeatherSnapshot,
} from "../weather/types";
import { RideProfiles } from "./profiles";
import type {
  RideProfile,
  RideRecommendation,
  RideRecommendationLevel,
} from "./types";

const DEFAULT_TIMEZONE = "America/Mexico_City";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getLevel(score: number): RideRecommendationLevel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";

  return "poor";
}

function getTitle(
  level: RideRecommendationLevel,
): string {
  switch (level) {
    case "excellent":
      return "Excelente momento para rodar";

    case "good":
      return "Buenas condiciones para rodar";

    case "fair":
      return "Condiciones aceptables con precaución";

    case "poor":
      return "No es el mejor momento para rodar";
  }
}

/**
 * Open-Meteo entrega las horas como tiempo local:
 * 2026-07-17T08:00
 *
 * Evitamos convertirlas directamente con new Date(), ya que
 * el servidor podría ejecutarse en una zona horaria diferente.
 */
function getLocalDateTimeKey(
  date: Date,
  timezone: string,
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return [
    `${values.year}-${values.month}-${values.day}`,
    `${values.hour}:${values.minute}`,
  ].join("T");
}

function formatHour(dateTime: string): string {
  return dateTime.slice(11, 16);
}

function isInsideDaylight(
  hour: WeatherHour,
  sunrise: string,
  sunset?: string,
): boolean {
  if (hour.time < sunrise) {
    return false;
  }

  if (sunset && hour.time > sunset) {
    return false;
  }

  return true;
}

function calculateTemperaturePenalty(
  temperature: number,
  profile: RideProfile,
): number {
  const {
    idealTemperatureMin,
    idealTemperatureMax,
    temperaturePenalty,
  } = profile;

  if (
    temperature >= idealTemperatureMin &&
    temperature <= idealTemperatureMax
  ) {
    return 0;
  }

  const distanceFromIdeal =
    temperature < idealTemperatureMin
      ? idealTemperatureMin - temperature
      : temperature - idealTemperatureMax;

  if (distanceFromIdeal <= 5) {
    return Math.round(temperaturePenalty / 2);
  }

  if (distanceFromIdeal <= 10) {
    return temperaturePenalty;
  }

  return temperaturePenalty * 2;
}

function calculateThresholdPenalty(
  value: number,
  maximum: number,
  penalty: number,
): number {
  if (value <= maximum) {
    return 0;
  }

  const excessRatio = value / Math.max(maximum, 1);

  if (excessRatio >= 1.75) {
    return penalty * 2;
  }

  if (excessRatio >= 1.35) {
    return Math.round(penalty * 1.5);
  }

  return penalty;
}

function calculateHourScore(
  hour: WeatherHour,
  profile: RideProfile,
): number {
  let score = 100;

  score -= calculateTemperaturePenalty(
    hour.temperature,
    profile,
  );

  score -= Math.round(
    calculateTemperaturePenalty(
      hour.apparentTemperature,
      profile,
    ) * 0.5,
  );

  score -= calculateThresholdPenalty(
    hour.precipitationProbability,
    profile.maxPrecipitationProbability,
    profile.rainPenalty,
  );

  score -= calculateThresholdPenalty(
    hour.windSpeed,
    profile.maxWind,
    profile.windPenalty,
  );

  const maximumRecommendedGust =
    profile.maxWind * 1.5;

  score -= calculateThresholdPenalty(
    hour.windGusts,
    maximumRecommendedGust,
    Math.round(profile.windPenalty * 0.75),
  );

  if (hour.humidity !== undefined) {
    score -= calculateThresholdPenalty(
      hour.humidity,
      profile.maxHumidity,
      profile.humidityPenalty,
    );
  }

  if (hour.uvIndex !== undefined) {
    score -= calculateThresholdPenalty(
      hour.uvIndex,
      profile.maxUvIndex,
      profile.uvPenalty,
    );
  }

  return clampScore(score);
}

function getReasons(
  hour: WeatherHour,
  profile: RideProfile,
): string[] {
  const reasons: string[] = [];

  if (
    hour.temperature >= profile.idealTemperatureMin &&
    hour.temperature <= profile.idealTemperatureMax
  ) {
    reasons.push(
      `Temperatura favorable para ${profile.displayName}`,
    );
  }

  if (
    hour.precipitationProbability <=
    profile.maxPrecipitationProbability
  ) {
    reasons.push(
      "Probabilidad de lluvia dentro del rango tolerable",
    );
  }

  if (hour.windSpeed <= profile.maxWind) {
    reasons.push(
      "Velocidad del viento compatible con la disciplina",
    );
  }

  if (hour.windGusts <= profile.maxWind * 1.5) {
    reasons.push("Rachas de viento controladas");
  }

  if (
    hour.humidity !== undefined &&
    hour.humidity <= profile.maxHumidity
  ) {
    reasons.push("Humedad dentro del rango aceptable");
  }

  if (
    hour.uvIndex !== undefined &&
    hour.uvIndex <= profile.maxUvIndex
  ) {
    reasons.push("Exposición UV dentro del rango previsto");
  }

  return reasons;
}

function getWarnings(
  hour: WeatherHour,
  profile: RideProfile,
): string[] {
  const warnings: string[] = [];

  if (
    hour.temperature < profile.idealTemperatureMin ||
    hour.temperature > profile.idealTemperatureMax
  ) {
    warnings.push(
      `Temperatura fuera del rango ideal para ${profile.displayName}`,
    );
  }

  if (
    hour.uvIndex !== undefined &&
    hour.uvIndex > profile.maxUvIndex
  ) {
    warnings.push(
      `Índice UV ${hour.uvIndex.toFixed(
        1,
      )}: usa protección solar`,
    );
  }

  if (
    hour.humidity !== undefined &&
    hour.humidity > profile.maxHumidity
  ) {
    warnings.push(
      `Humedad elevada de ${Math.round(hour.humidity)} %`,
    );
  }

  if (
    hour.precipitationProbability >
    profile.maxPrecipitationProbability
  ) {
    warnings.push(
      `La probabilidad de lluvia supera el límite recomendado para ${profile.displayName}`,
    );
  }

  if (hour.windSpeed > profile.maxWind) {
    warnings.push(
      `El viento supera los ${profile.maxWind} km/h recomendados`,
    );
  }

  if (hour.windGusts > profile.maxWind * 1.5) {
    warnings.push(
      `Se esperan rachas de hasta ${Math.round(
        hour.windGusts,
      )} km/h`,
    );
  }

  return warnings;
}

function getBestWindow(
  hours: WeatherHour[],
  bestHourIndex: number,
): string {
  const start = hours[bestHourIndex];
  const end =
    hours[Math.min(bestHourIndex + 2, hours.length - 1)];

  if (!start || !end) {
    return "No disponible";
  }

  return `${formatHour(start.time)} a ${formatHour(end.time)}`;
}

export function calculateRideRecommendation(
  weather: WeatherSnapshot,
  profile: RideProfile = RideProfiles.xc,
): RideRecommendation {
  const timezone = weather.timezone || DEFAULT_TIMEZONE;
  const nowLocal = getLocalDateTimeKey(
    new Date(),
    timezone,
  );

  const futureDaylightHours = weather.hours
    .filter((hour) => hour.time >= nowLocal)
    .filter((hour) =>
      isInsideDaylight(
        hour,
        weather.sunrise,
        weather.sunset,
      ),
    )
    .slice(0, 14);

  const daylightHours = weather.hours
    .filter((hour) =>
      isInsideDaylight(
        hour,
        weather.sunrise,
        weather.sunset,
      ),
    )
    .slice(0, 14);

  const candidateHours =
    futureDaylightHours.length > 0
      ? futureDaylightHours
      : daylightHours;

  if (candidateHours.length === 0) {
    return {
      location: weather.location,
      score: 0,
      level: "poor",
      title: "No hay una ventana diurna disponible",
      recommendation:
        "No se encontró una hora futura con luz natural dentro del pronóstico disponible.",
      bestWindow: "No disponible",
      reasons: [],
      warnings: [
        "Evita rodar en rutas de montaña sin iluminación suficiente",
      ],
      metrics: [],
      source: "Open-Meteo",
      updatedAt: weather.updatedAt,
    };
  }

  let bestHourIndex = 0;
  let bestHourScore = -1;

  candidateHours.forEach((hour, index) => {
    const score = calculateHourScore(hour, profile);

    if (score > bestHourScore) {
      bestHourScore = score;
      bestHourIndex = index;
    }
  });

  const bestHour = candidateHours[bestHourIndex];
  const score = clampScore(bestHourScore);
  const level = getLevel(score);

  return {
    location: weather.location,
    score,
    level,
    title: getTitle(level),
    recommendation:
      level === "poor"
        ? `Considera posponer la rodada de ${profile.displayName} o elegir una sesión corta, cercana y de baja dificultad.`
        : `Las condiciones permiten planear una rodada de ${profile.displayName}, manteniendo atención a posibles cambios del clima.`,
    bestWindow: getBestWindow(
      candidateHours,
      bestHourIndex,
    ),
    reasons: getReasons(bestHour, profile),
    warnings: getWarnings(bestHour, profile),
    metrics: [
      {
        label: "Disciplina",
        value: profile.displayName,
      },
      {
        label: "Temperatura",
        value: `${Math.round(bestHour.temperature)} °C`,
      },
      {
        label: "Sensación",
        value: `${Math.round(
          bestHour.apparentTemperature,
        )} °C`,
      },
      {
        label: "Lluvia",
        value: `${Math.round(
          bestHour.precipitationProbability,
        )} %`,
      },
      {
        label: "Viento",
        value: `${Math.round(bestHour.windSpeed)} km/h`,
      },
      {
        label: "Rachas",
        value: `${Math.round(bestHour.windGusts)} km/h`,
      },
      {
        label: "Humedad",
        value:
          bestHour.humidity !== undefined
            ? `${Math.round(bestHour.humidity)} %`
            : "No disponible",
      },
      {
        label: "Índice UV",
        value:
          bestHour.uvIndex !== undefined
            ? bestHour.uvIndex.toFixed(1)
            : "No disponible",
      },
      {
        label: "Atardecer",
        value: weather.sunset
          ? formatHour(weather.sunset)
          : "No disponible",
      },
    ],
    source: "Open-Meteo",
    updatedAt: weather.updatedAt,
  };
}