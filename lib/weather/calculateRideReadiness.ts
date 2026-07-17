type CalculateRideReadinessInput = {
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  windSpeed: number;
  windGusts: number;
  weatherCode: number;
};

type ScoreExplanation = {
  score: number;
  status: string;
  title: string;
};

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateRideReadiness({
  temperature,
  apparentTemperature,
  precipitationProbability,
  windSpeed,
  windGusts,
  weatherCode,
}: CalculateRideReadinessInput): ScoreExplanation {
  let score = 100;
  const effectiveTemperature = Math.max(temperature, apparentTemperature);

  if (effectiveTemperature < 5) score -= 30;
  else if (effectiveTemperature < 10) score -= 15;
  else if (effectiveTemperature > 35) score -= 35;
  else if (effectiveTemperature > 30) score -= 18;

  if (precipitationProbability >= 80) score -= 45;
  else if (precipitationProbability >= 60) score -= 32;
  else if (precipitationProbability >= 40) score -= 20;
  else if (precipitationProbability >= 20) score -= 8;

  if (windSpeed >= 35) score -= 30;
  else if (windSpeed >= 25) score -= 18;
  else if (windSpeed >= 18) score -= 8;

  if (windGusts >= 50) score -= 25;
  else if (windGusts >= 35) score -= 12;

  const thunderstormCodes = new Set([95, 96, 99]);
  const heavyRainCodes = new Set([65, 67, 75, 77, 82, 86]);

  if (thunderstormCodes.has(weatherCode)) score -= 55;
  else if (heavyRainCodes.has(weatherCode)) score -= 35;

  score = clamp(Math.round(score));

  if (score >= 85) {
    return {
      score,
      status: "Excelente día para rodar",
      title: "Las condiciones favorecen una buena salida.",
    };
  }

  if (score >= 70) {
    return {
      score,
      status: "Buen día para rodar",
      title: "Sal preparado y aprovecha la mejor ventana.",
    };
  }

  if (score >= 50) {
    return {
      score,
      status: "Rodada con precaución",
      title: "Las condiciones son variables; revisa el detalle antes de salir.",
    };
  }

  return {
    score,
    status: "Mejor considerar otra hora",
    title: "Las condiciones actuales no son favorables para MTB.",
  };
}
