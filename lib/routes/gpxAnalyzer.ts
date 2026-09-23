import type { GeoPoint } from "./types";

export interface GpxTrackPoint extends GeoPoint {
  elevationM?: number;
  recordedAt?: string;
}

export interface GpxBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type GpxQualityLevel =
  | "insufficient"
  | "provisional"
  | "usable"
  | "complete";

export interface GpxAnalysis {
  fileName: string;
  trackName: string;
  pointCount: number;

  distanceKm: number;
  elevationGainM: number;

  minimumElevationM?: number;
  maximumElevationM?: number;

  startPoint: GeoPoint;
  endPoint: GeoPoint;
  bounds: GpxBounds;

  startedAt?: string;
  finishedAt?: string;
  durationMinutes?: number;

  qualityScore: number;
  qualityLevel: GpxQualityLevel;
  qualityLabel: string;

  warnings: string[];
  points: GpxTrackPoint[];
}

interface RawTrackPoint {
  latitude: number;
  longitude: number;
  elevationM?: number;
  recordedAt?: string;
}

const EARTH_RADIUS_KM = 6371.0088;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function roundValue(
  value: number,
  decimals = 1,
): number {
  const factor = 10 ** decimals;

  return Math.round(value * factor) / factor;
}

function calculateDistanceKm(
  first: GeoPoint,
  second: GeoPoint,
): number {
  const latitudeDelta = toRadians(
    second.latitude - first.latitude,
  );

  const longitudeDelta = toRadians(
    second.longitude - first.longitude,
  );

  const firstLatitude =
    toRadians(first.latitude);

  const secondLatitude =
    toRadians(second.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(1 - haversine),
    );

  return EARTH_RADIUS_KM * angularDistance;
}

function parseOptionalNumber(
  value: string | null | undefined,
): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function parseTrackPoint(
  element: Element,
): RawTrackPoint | null {
  const latitude = parseOptionalNumber(
    element.getAttribute("lat"),
  );

  const longitude = parseOptionalNumber(
    element.getAttribute("lon"),
  );

  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    return null;
  }

  const elevationElement =
    element.getElementsByTagName("ele")[0];

  const timeElement =
    element.getElementsByTagName("time")[0];

  const elevationM = parseOptionalNumber(
    elevationElement?.textContent,
  );

  const recordedAt =
    timeElement?.textContent?.trim() ||
    undefined;

  return {
    latitude,
    longitude,
    elevationM,
    recordedAt,
  };
}

function getElementsByLocalName(
  document: Document,
  localName: string,
): Element[] {
  return Array.from(
    document.getElementsByTagNameNS(
      "*",
      localName,
    ),
  );
}

function calculateDistance(
  points: GpxTrackPoint[],
): number {
  let distanceKm = 0;

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    distanceKm += calculateDistanceKm(
      points[index - 1],
      points[index],
    );
  }

  return roundValue(distanceKm, 2);
}

function calculateElevationGain(
  points: GpxTrackPoint[],
): number {
  let elevationGainM = 0;

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    const previousElevation =
      points[index - 1].elevationM;

    const currentElevation =
      points[index].elevationM;

    if (
      previousElevation === undefined ||
      currentElevation === undefined
    ) {
      continue;
    }

    const difference =
      currentElevation - previousElevation;

    /*
     * Ignoramos variaciones menores a 1.5 metros
     * para reducir parte del ruido habitual del GPS.
     */
    if (difference >= 1.5) {
      elevationGainM += difference;
    }
  }

  return roundValue(elevationGainM);
}

function calculateBounds(
  points: GpxTrackPoint[],
): GpxBounds {
  const latitudes = points.map(
    (point) => point.latitude,
  );

  const longitudes = points.map(
    (point) => point.longitude,
  );

  return {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes),
  };
}

function calculateDurationMinutes(
  startedAt?: string,
  finishedAt?: string,
): number | undefined {
  if (!startedAt || !finishedAt) {
    return undefined;
  }

  const startTime =
    new Date(startedAt).getTime();

  const finishTime =
    new Date(finishedAt).getTime();

  if (
    !Number.isFinite(startTime) ||
    !Number.isFinite(finishTime) ||
    finishTime <= startTime
  ) {
    return undefined;
  }

  return roundValue(
    (finishTime - startTime) /
      (1000 * 60),
  );
}

function getQualityLevel(
  score: number,
): GpxQualityLevel {
  if (score >= 90) {
    return "complete";
  }

  if (score >= 70) {
    return "usable";
  }

  if (score >= 40) {
    return "provisional";
  }

  return "insufficient";
}

function getQualityLabel(
  level: GpxQualityLevel,
): string {
  switch (level) {
    case "complete":
      return "Registro completo";

    case "usable":
      return "Registro utilizable";

    case "provisional":
      return "Registro provisional";

    case "insufficient":
      return "Registro insuficiente";
  }
}

function assessGpxQuality(
  points: GpxTrackPoint[],
  distanceKm: number,
): {
  score: number;
  level: GpxQualityLevel;
  label: string;
  warnings: string[];
} {
  let score = 0;
  const warnings: string[] = [];

  if (points.length >= 500) {
    score += 30;
  } else if (points.length >= 100) {
    score += 22;
  } else if (points.length >= 20) {
    score += 12;
  } else {
    warnings.push(
      "El archivo contiene pocos puntos de seguimiento.",
    );
  }

  if (distanceKm >= 1) {
    score += 20;
  } else {
    warnings.push(
      "La distancia registrada es demasiado corta para considerarla una ruta completa.",
    );
  }

  const pointsWithElevation =
    points.filter(
      (point) =>
        point.elevationM !== undefined,
    ).length;

  const elevationCoverage =
    pointsWithElevation /
    Math.max(points.length, 1);

  if (elevationCoverage >= 0.9) {
    score += 25;
  } else if (elevationCoverage >= 0.5) {
    score += 15;
    warnings.push(
      "La información de elevación está incompleta.",
    );
  } else {
    warnings.push(
      "El archivo no contiene elevación suficiente para calcular desnivel con confianza.",
    );
  }

  const pointsWithTime =
    points.filter(
      (point) =>
        point.recordedAt !== undefined,
    ).length;

  const timeCoverage =
    pointsWithTime /
    Math.max(points.length, 1);

  if (timeCoverage >= 0.9) {
    score += 15;
  } else if (timeCoverage > 0) {
    score += 7;
    warnings.push(
      "Las marcas de tiempo están incompletas.",
    );
  } else {
    warnings.push(
      "El archivo no contiene marcas de tiempo.",
    );
  }

  if (points.length >= 2) {
    score += 10;
  }

  const normalizedScore = Math.max(
    0,
    Math.min(100, Math.round(score)),
  );

  const level =
    getQualityLevel(normalizedScore);

  return {
    score: normalizedScore,
    level,
    label: getQualityLabel(level),
    warnings,
  };
}

function getTrackName(
  document: Document,
  fileName: string,
): string {
  const trackElement =
    getElementsByLocalName(
      document,
      "trk",
    )[0];

  const nameElement =
    trackElement
      ? Array.from(trackElement.children).find(
          (element) =>
            element.localName === "name",
        )
      : undefined;

  const trackName =
    nameElement?.textContent?.trim();

  if (trackName) {
    return trackName;
  }

  return fileName.replace(
    /\.gpx$/i,
    "",
  );
}

export function analyzeGpx(
  xmlText: string,
  fileName: string,
): GpxAnalysis {
  if (
    typeof DOMParser === "undefined"
  ) {
    throw new Error(
      "El analizador GPX necesita ejecutarse en el navegador.",
    );
  }

  const parser = new DOMParser();

  const document = parser.parseFromString(
    xmlText,
    "application/xml",
  );

  const parserError =
    document.querySelector("parsererror");

  if (parserError) {
    throw new Error(
      "El archivo no contiene XML válido.",
    );
  }

  const trackPointElements =
    getElementsByLocalName(
      document,
      "trkpt",
    );

  const routePointElements =
    getElementsByLocalName(
      document,
      "rtept",
    );

  const sourceElements =
    trackPointElements.length > 0
      ? trackPointElements
      : routePointElements;

  const points = sourceElements
    .map(parseTrackPoint)
    .filter(
      (
        point,
      ): point is RawTrackPoint =>
        point !== null,
    );

  if (points.length < 2) {
    throw new Error(
      "El GPX necesita al menos dos puntos geográficos válidos.",
    );
  }

  const normalizedPoints:
    GpxTrackPoint[] = points.map(
    (point) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      elevationM: point.elevationM,
      recordedAt: point.recordedAt,
    }),
  );

  const distanceKm =
    calculateDistance(
      normalizedPoints,
    );

  const elevationGainM =
    calculateElevationGain(
      normalizedPoints,
    );

  const elevations = normalizedPoints
    .map((point) => point.elevationM)
    .filter(
      (
        elevation,
      ): elevation is number =>
        elevation !== undefined,
    );

  const timedPoints =
    normalizedPoints.filter(
      (point) =>
        point.recordedAt !== undefined,
    );

  const startedAt =
    timedPoints[0]?.recordedAt;

  const finishedAt =
    timedPoints[
      timedPoints.length - 1
    ]?.recordedAt;

  const quality = assessGpxQuality(
    normalizedPoints,
    distanceKm,
  );

  return {
    fileName,
    trackName: getTrackName(
      document,
      fileName,
    ),
    pointCount:
      normalizedPoints.length,

    distanceKm,
    elevationGainM,

    minimumElevationM:
      elevations.length > 0
        ? roundValue(
            Math.min(...elevations),
          )
        : undefined,

    maximumElevationM:
      elevations.length > 0
        ? roundValue(
            Math.max(...elevations),
          )
        : undefined,

    startPoint: normalizedPoints[0],
    endPoint:
      normalizedPoints[
        normalizedPoints.length - 1
      ],

    bounds: calculateBounds(
      normalizedPoints,
    ),

    startedAt,
    finishedAt,

    durationMinutes:
      calculateDurationMinutes(
        startedAt,
        finishedAt,
      ),

    qualityScore: quality.score,
    qualityLevel: quality.level,
    qualityLabel: quality.label,

    warnings: quality.warnings,
    points: normalizedPoints,
  };
}