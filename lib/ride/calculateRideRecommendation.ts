import type {
  WeatherHour,
  WeatherSnapshot,
} from "../weather/types";
import type {
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

function getTitle(level: RideRecommendationLevel): string {
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
 * Evitamos convertirlas directamente con new Date(), ya que el servidor
 * podría estar ejecutándose en una zona horaria diferente.
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

function calculateHourScore(hour: WeatherHour): number {
  let score = 100;

  if (hour.temperature < 5 || hour.temperature > 34) {
    score -= 35;
  } else if (hour.temperature < 10 || hour.temperature > 29) {
    score -= 15;
  }

  if (hour.apparentTemperature < 5 || hour.apparentTemperature > 35) {
    score -= 15;
  }

  if (hour.precipitationProbability >= 70) {
    score -= 45;
  } else if (hour.precipitationProbability >= 40) {
    score -= 25;
  } else if (hour.precipitationProbability >= 20) {
    score -= 10;
  }

  if (hour.windSpeed >= 35) {
    score -= 35;
  } else if (hour.windSpeed >= 25) {
    score -= 20;
  } else if (hour.windSpeed >= 15) {
    score -= 8;
  }

  if (hour.windGusts >= 50) {
    score -= 25;
  } else if (hour.windGusts >= 35) {
    score -= 12;
  }

  if (hour.humidity !== undefined) {
    if (hour.humidity >= 90) {
      score -= 12;
    } else if (hour.humidity >= 80) {
      score -= 6;
    }
  }

  if (hour.uvIndex !== undefined) {
    if (hour.uvIndex >= 11) {
      score -= 20;
    } else if (hour.uvIndex >= 8) {
      score -= 12;
    } else if (hour.uvIndex >= 6) {
      score -= 5;
    }
  }

  return clampScore(score);
}

function getReasons(hour: WeatherHour): string[] {
  const reasons: string[] = [];

  if (hour.temperature >= 12 && hour.temperature <= 27) {
    reasons.push("Temperatura adecuada para actividad física");
  }

  if (hour.precipitationProbability < 20) {
    reasons.push("Baja probabilidad de lluvia");
  }

  if (hour.windSpeed < 15) {
    reasons.push("Viento ligero");
  }

  if (hour.windGusts < 30) {
    reasons.push("Rachas de viento moderadas");
  }

  if (
    hour.humidity !== undefined &&
    hour.humidity >= 35 &&
    hour.humidity < 75
  ) {
    reasons.push("Humedad dentro de un rango cómodo");
  }

  if (
    hour.uvIndex !== undefined &&
    hour.uvIndex < 6
  ) {
    reasons.push("Exposición UV moderada o baja");
  }

  return reasons;
}

function getWarnings(hour: WeatherHour): string[] {
  const warnings: string[] = [];

  if (
    hour.uvIndex !== undefined &&
    hour.uvIndex >= 6
  ) {
    warnings.push(
      `Índice UV ${hour.uvIndex.toFixed(1)}: usa protección solar`,
    );
  }

  if (
    hour.humidity !== undefined &&
    hour.humidity >= 80
  ) {
    warnings.push(
      `Humedad elevada de ${Math.round(hour.humidity)} %`,
    );
  }

  if (hour.precipitationProbability >= 40) {
    warnings.push(
      "Existe una probabilidad considerable de lluvia",
    );
  }

  if (hour.windGusts >= 35) {
    warnings.push(
      `Se esperan rachas de hasta ${Math.round(
        hour.windGusts,
      )} km/h`,
    );
  }

  if (
    hour.temperature >= 30 ||
    hour.apparentTemperature >= 32
  ) {
    warnings.push(
      "La temperatura puede aumentar el riesgo de deshidratación",
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
): RideRecommendation {
  const timezone = weather.timezone || DEFAULT_TIMEZONE;
  const nowLocal = getLocalDateTimeKey(new Date(), timezone);

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
    const score = calculateHourScore(hour);

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
        ? "Considera posponer la rodada o elegir una sesión corta, cercana y de baja dificultad."
        : "Las condiciones permiten planear una rodada, manteniendo atención a posibles cambios del clima.",
    bestWindow: getBestWindow(
      candidateHours,
      bestHourIndex,
    ),
    reasons: getReasons(bestHour),
    warnings: getWarnings(bestHour),
    metrics: [
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