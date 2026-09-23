import type {
  GpxAnalysis,
  GpxTrackPoint,
} from "./gpxAnalyzer";

export interface ElevationProfilePoint {
  distanceKm: number;
  elevationM: number;
}

export interface NormalizedRoutePoint {
  x: number;
  y: number;
}

export interface GpxVisualization {
  elevationProfile: ElevationProfilePoint[];
  normalizedRoute: NormalizedRoutePoint[];

  minimumElevationM?: number;
  maximumElevationM?: number;

  totalAscentM: number;
  totalDescentM: number;
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
  first: GpxTrackPoint,
  second: GpxTrackPoint,
): number {
  const latitudeDelta = toRadians(
    second.latitude - first.latitude,
  );

  const longitudeDelta = toRadians(
    second.longitude - first.longitude,
  );

  const firstLatitude = toRadians(
    first.latitude,
  );

  const secondLatitude = toRadians(
    second.latitude,
  );

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

function createElevationProfile(
  points: GpxTrackPoint[],
): ElevationProfilePoint[] {
  if (points.length === 0) {
    return [];
  }

  let cumulativeDistanceKm = 0;

  const profile: ElevationProfilePoint[] = [];

  points.forEach((point, index) => {
    if (index > 0) {
      cumulativeDistanceKm +=
        calculateDistanceKm(
          points[index - 1],
          point,
        );
    }

    if (point.elevationM === undefined) {
      return;
    }

    profile.push({
      distanceKm: roundValue(
        cumulativeDistanceKm,
        3,
      ),
      elevationM: roundValue(
        point.elevationM,
      ),
    });
  });

  return profile;
}

function normalizeRoutePoints(
  analysis: GpxAnalysis,
): NormalizedRoutePoint[] {
  const {
    north,
    south,
    east,
    west,
  } = analysis.bounds;

  const longitudeSpan = Math.max(
    east - west,
    0.000001,
  );

  const latitudeSpan = Math.max(
    north - south,
    0.000001,
  );

  return analysis.points.map((point) => ({
    x:
      ((point.longitude - west) /
        longitudeSpan) *
      100,

    /*
     * SVG comienza en la parte superior.
     * Invertimos el eje vertical para que
     * el norte aparezca arriba.
     */
    y:
      100 -
      ((point.latitude - south) /
        latitudeSpan) *
        100,
  }));
}

function calculateElevationMovement(
  points: GpxTrackPoint[],
): {
  ascentM: number;
  descentM: number;
} {
  let ascentM = 0;
  let descentM = 0;

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    const previous =
      points[index - 1].elevationM;

    const current =
      points[index].elevationM;

    if (
      previous === undefined ||
      current === undefined
    ) {
      continue;
    }

    const difference = current - previous;

    /*
     * Reducimos parte del ruido vertical
     * ignorando variaciones inferiores
     * a 1.5 metros.
     */
    if (difference >= 1.5) {
      ascentM += difference;
    } else if (difference <= -1.5) {
      descentM += Math.abs(difference);
    }
  }

  return {
    ascentM: roundValue(ascentM),
    descentM: roundValue(descentM),
  };
}

export function createGpxVisualization(
  analysis: GpxAnalysis,
): GpxVisualization {
  const elevations = analysis.points
    .map((point) => point.elevationM)
    .filter(
      (
        elevation,
      ): elevation is number =>
        elevation !== undefined,
    );

  const movement =
    calculateElevationMovement(
      analysis.points,
    );

  return {
    elevationProfile:
      createElevationProfile(
        analysis.points,
      ),

    normalizedRoute:
      normalizeRoutePoints(analysis),

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

    totalAscentM: movement.ascentM,
    totalDescentM: movement.descentM,
  };
}