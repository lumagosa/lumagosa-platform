"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  analyzeGpx,
  type GpxAnalysis,
  type GpxQualityLevel,
} from "../../lib/routes/gpxAnalyzer";
import { createRouteProfileFromGpx } from "../../lib/routes/gpxRouteFactory";
import type { RouteProfile } from "../../lib/routes/types";

interface GpxImportPanelProps {
  onRouteReady: (
    route: RouteProfile,
  ) => void;
}

const qualityClasses: Record<
  GpxQualityLevel,
  string
> = {
  insufficient:
    "border-red-200 bg-red-50 text-red-900",

  provisional:
    "border-amber-200 bg-amber-50 text-amber-900",

  usable:
    "border-blue-200 bg-blue-50 text-blue-900",

  complete:
    "border-emerald-200 bg-emerald-50 text-emerald-900",
};

function formatCoordinate(
  value: number,
): string {
  return value.toFixed(6);
}

function AnalysisMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-lg font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

function GpxAnalysisResult({
  analysis,
  onUseRoute,
}: {
  analysis: GpxAnalysis;
  onUseRoute: () => void;
}) {
  const canUseRoute =
    analysis.qualityLevel !==
    "insufficient";

  return (
    <div className="mt-6 space-y-5">
      <article>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Archivo analizado
        </p>

        <h4 className="mt-1 text-xl font-bold text-slate-950">
          {analysis.trackName}
        </h4>

        <p className="mt-1 text-sm text-slate-500">
          {analysis.fileName}
        </p>
      </article>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AnalysisMetric
          label="Distancia"
          value={`${analysis.distanceKm} km`}
        />

        <AnalysisMetric
          label="Desnivel positivo"
          value={`${analysis.elevationGainM} m+`}
        />

        <AnalysisMetric
          label="Puntos GPX"
          value={String(
            analysis.pointCount,
          )}
        />

        <AnalysisMetric
          label="Duración"
          value={
            analysis.durationMinutes !==
            undefined
              ? `${analysis.durationMinutes} min`
              : "No disponible"
          }
        />

        <AnalysisMetric
          label="Altitud mínima"
          value={
            analysis.minimumElevationM !==
            undefined
              ? `${analysis.minimumElevationM} m`
              : "No disponible"
          }
        />

        <AnalysisMetric
          label="Altitud máxima"
          value={
            analysis.maximumElevationM !==
            undefined
              ? `${analysis.maximumElevationM} m`
              : "No disponible"
          }
        />

        <AnalysisMetric
          label="Inicio"
          value={`${formatCoordinate(
            analysis.startPoint.latitude,
          )}, ${formatCoordinate(
            analysis.startPoint.longitude,
          )}`}
        />

        <AnalysisMetric
          label="Final"
          value={`${formatCoordinate(
            analysis.endPoint.latitude,
          )}, ${formatCoordinate(
            analysis.endPoint.longitude,
          )}`}
        />
      </div>

      <section
        className={[
          "rounded-2xl border p-5",
          qualityClasses[
            analysis.qualityLevel
          ],
        ].join(" ")}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              Calidad del registro GPX
            </p>

            <h5 className="mt-1 text-lg font-black">
              {analysis.qualityLabel}
            </h5>
          </div>

          <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-sm font-bold">
            {analysis.qualityScore}/100
          </span>
        </div>

        {analysis.warnings.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {analysis.warnings.map(
              (warning) => (
                <li key={warning}>
                  • {warning}
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-4 text-sm">
            El archivo contiene información
            suficiente para construir una ruta
            temporal.
          </p>
        )}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={!canUseRoute}
          onClick={onUseRoute}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Usar esta ruta en la evaluación
        </button>

        {!canUseRoute ? (
          <p className="text-sm text-red-700">
            El registro necesita más información
            antes de utilizarse en el Risk Engine.
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Se creará una ruta temporal; no se
            guardará en el catálogo.
          </p>
        )}
      </div>
    </div>
  );
}

export function GpxImportPanel({
  onRouteReady,
}: GpxImportPanelProps) {
  const inputReference =
    useRef<HTMLInputElement>(null);

  const [analysis, setAnalysis] =
    useState<GpxAnalysis | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setAnalysis(null);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      if (
        !file.name
          .toLowerCase()
          .endsWith(".gpx")
      ) {
        throw new Error(
          "Selecciona un archivo con extensión .gpx.",
        );
      }

      const xmlText =
        await file.text();

      const result = analyzeGpx(
        xmlText,
        file.name,
      );

      setAnalysis(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible analizar el archivo GPX.",
      );
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const handleUseRoute = (): void => {
    if (!analysis) {
      return;
    }

    const route =
      createRouteProfileFromGpx(
        analysis,
      );

    onRouteReady(route);
  };

  return (
    <section
      aria-labelledby="gpx-import-title"
      className="space-y-4"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Datos reales de recorrido
        </p>

        <h3
          id="gpx-import-title"
          className="mt-1 text-xl font-semibold text-slate-900"
        >
          Analizar archivo GPX
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Carga un GPX y conviértelo en una ruta
          temporal para que el motor combine su
          distancia, desnivel y geometría con el
          clima y tu perfil ciclista.
        </p>
      </div>

      <input
        ref={inputReference}
        type="file"
        accept=".gpx,application/gpx+xml,application/xml,text/xml"
        onChange={handleFileChange}
        className="sr-only"
      />

      <button
        type="button"
        disabled={isProcessing}
        onClick={() =>
          inputReference.current?.click()
        }
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
      >
        {isProcessing
          ? "Analizando GPX..."
          : "Seleccionar archivo GPX"}
      </button>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900"
        >
          {errorMessage}
        </div>
      ) : null}

      {analysis ? (
        <GpxAnalysisResult
          analysis={analysis}
          onUseRoute={
            handleUseRoute
          }
        />
      ) : null}
    </section>
  );
}