import { useMemo } from "react";
import type { GpxAnalysis } from "../../lib/routes/gpxAnalyzer";
import { createGpxVisualization } from "../../lib/routes/gpxVisualization";

interface GpxRoutePreviewProps {
  analysis: GpxAnalysis;
}

interface PreviewMetricProps {
  label: string;
  value: string;
}

function PreviewMetric({
  label,
  value,
}: PreviewMetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function RouteTrace({
  points,
}: {
  points: {
    x: number;
    y: number;
  }[];
}) {
  const polylinePoints = points
    .map(
      (point) =>
        `${point.x.toFixed(
          2,
        )},${point.y.toFixed(2)}`,
    )
    .join(" ");

  const startPoint = points[0];
  const endPoint =
    points[points.length - 1];

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Geometría del recorrido
        </p>

        <h5 className="mt-1 text-lg font-black text-slate-950">
          Vista aproximada del trazado
        </h5>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <svg
          viewBox="-8 -8 116 116"
          role="img"
          aria-label="Representación aproximada del trazado GPX"
          className="h-auto w-full"
        >
          <defs>
            <pattern
              id="route-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.25"
                className="text-slate-200"
              />
            </pattern>
          </defs>

          <rect
            x="-8"
            y="-8"
            width="116"
            height="116"
            fill="url(#route-grid)"
          />

          <polyline
            points={polylinePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-emerald-700"
          />

          {startPoint ? (
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="2.5"
              fill="currentColor"
              className="text-blue-600"
            />
          ) : null}

          {endPoint ? (
            <circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="2.5"
              fill="currentColor"
              className="text-red-600"
            />
          ) : null}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Inicio
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          Final
        </span>

        <span>
          Norte orientado hacia arriba
        </span>
      </div>
    </article>
  );
}

function ElevationChart({
  profile,
}: {
  profile: {
    distanceKm: number;
    elevationM: number;
  }[];
}) {
  if (profile.length < 2) {
    return (
      <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <h5 className="font-bold">
          Perfil de elevación no disponible
        </h5>

        <p className="mt-2 text-sm">
          El archivo no contiene suficientes
          puntos con altitud.
        </p>
      </article>
    );
  }

  const distances = profile.map(
    (point) => point.distanceKm,
  );

  const elevations = profile.map(
    (point) => point.elevationM,
  );

  const maximumDistance = Math.max(
    ...distances,
    0.001,
  );

  const minimumElevation = Math.min(
    ...elevations,
  );

  const maximumElevation = Math.max(
    ...elevations,
  );

  const elevationRange = Math.max(
    maximumElevation - minimumElevation,
    1,
  );

  const chartPoints = profile.map(
    (point) => ({
      x:
        (point.distanceKm /
          maximumDistance) *
        100,

      y:
        100 -
        ((point.elevationM -
          minimumElevation) /
          elevationRange) *
          100,
    }),
  );

  const linePoints = chartPoints
    .map(
      (point) =>
        `${point.x.toFixed(
          2,
        )},${point.y.toFixed(2)}`,
    )
    .join(" ");

  const areaPoints = [
    "0,100",
    linePoints,
    "100,100",
  ].join(" ");

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Elevación
        </p>

        <h5 className="mt-1 text-lg font-black text-slate-950">
          Perfil altimétrico
        </h5>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <svg
          viewBox="-7 -8 114 120"
          role="img"
          aria-label="Perfil de elevación del recorrido GPX"
          className="h-auto w-full"
        >
          <defs>
            <linearGradient
              id="elevation-fill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="currentColor"
                stopOpacity="0.35"
              />

              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="100"
            x2="100"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-300"
          />

          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-300"
          />

          <polygon
            points={areaPoints}
            fill="url(#elevation-fill)"
            className="text-emerald-600"
          />

          <polyline
            points={linePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-emerald-700"
          />

          <text
            x="0"
            y="110"
            fontSize="4"
            fill="currentColor"
            className="text-slate-500"
          >
            0 km
          </text>

          <text
            x="100"
            y="110"
            fontSize="4"
            textAnchor="end"
            fill="currentColor"
            className="text-slate-500"
          >
            {maximumDistance.toFixed(1)} km
          </text>

          <text
            x="-2"
            y="3"
            fontSize="4"
            textAnchor="end"
            fill="currentColor"
            className="text-slate-500"
          >
            {Math.round(maximumElevation)} m
          </text>

          <text
            x="-2"
            y="100"
            fontSize="4"
            textAnchor="end"
            fill="currentColor"
            className="text-slate-500"
          >
            {Math.round(minimumElevation)} m
          </text>
        </svg>
      </div>
    </article>
  );
}

export function GpxRoutePreview({
  analysis,
}: GpxRoutePreviewProps) {
  const visualization = useMemo(
    () =>
      createGpxVisualization(
        analysis,
      ),
    [analysis],
  );

  return (
    <section
      aria-labelledby="gpx-preview-title"
      className="space-y-5"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Vista técnica
        </p>

        <h4
          id="gpx-preview-title"
          className="mt-1 text-xl font-black text-slate-950"
        >
          Geometría y elevación
        </h4>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Esta representación se genera
          directamente con los puntos del GPX.
          No sustituye un mapa cartográfico ni
          confirma accesos o condiciones del
          terreno.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PreviewMetric
          label="Ascenso acumulado"
          value={`${visualization.totalAscentM} m+`}
        />

        <PreviewMetric
          label="Descenso acumulado"
          value={`${visualization.totalDescentM} m-`}
        />

        <PreviewMetric
          label="Altitud mínima"
          value={
            visualization.minimumElevationM !==
            undefined
              ? `${visualization.minimumElevationM} m`
              : "No disponible"
          }
        />

        <PreviewMetric
          label="Altitud máxima"
          value={
            visualization.maximumElevationM !==
            undefined
              ? `${visualization.maximumElevationM} m`
              : "No disponible"
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <RouteTrace
          points={
            visualization.normalizedRoute
          }
        />

        <ElevationChart
          profile={
            visualization.elevationProfile
          }
        />
      </div>
    </section>
  );
}