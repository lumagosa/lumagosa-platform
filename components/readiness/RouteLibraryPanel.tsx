"use client";

import { useState } from "react";
import {
  assessRouteDataQuality,
  type RouteDataQualityLevel,
} from "../../lib/routes/routeQuality";
import type {
  RouteExposureLevel,
  RoutePhysicalDifficulty,
  RouteProfile,
  RouteSurface,
  RouteTechnicalDifficulty,
  RouteVerificationStatus,
} from "../../lib/routes/types";
import { useRouteLibrary } from "../shared/providers/RouteLibraryProvider";

interface RouteLibraryPanelProps {
  selectedRouteId: string;

  onSelectRoute: (
    route: RouteProfile,
  ) => void;
}

const physicalDifficultyLabels: Record<
  RoutePhysicalDifficulty,
  string
> = {
  easy: "Ligera",
  moderate: "Moderada",
  demanding: "Exigente",
  extreme: "Extrema",
};

const technicalDifficultyLabels: Record<
  RouteTechnicalDifficulty,
  string
> = {
  basic: "Básica",
  intermediate: "Intermedia",
  advanced: "Avanzada",
  expert: "Experta",
};

const surfaceLabels: Record<
  RouteSurface,
  string
> = {
  pavement: "Pavimento",
  gravel: "Grava",
  dirt: "Terracería",
  rock: "Roca",
  mixed: "Mixta",
};

const exposureLabels: Record<
  RouteExposureLevel,
  string
> = {
  low: "Baja",
  moderate: "Moderada",
  high: "Alta",
};

const verificationLabels: Record<
  RouteVerificationStatus,
  string
> = {
  draft: "Borrador",
  "field-review": "Registro de campo",
  verified: "Verificada",
  deprecated: "Obsoleta",
};

const qualityLabels: Record<
  RouteDataQualityLevel,
  string
> = {
  insufficient: "Insuficiente",
  provisional: "Provisional",
  usable: "Utilizable",
  verified: "Verificada",
};

const qualityClasses: Record<
  RouteDataQualityLevel,
  string
> = {
  insufficient:
    "bg-red-50 text-red-800 ring-red-200",

  provisional:
    "bg-amber-50 text-amber-800 ring-amber-200",

  usable:
    "bg-blue-50 text-blue-800 ring-blue-200",

  verified:
    "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

function RouteMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-950">
        {value}
      </p>
    </div>
  );
}

export function RouteLibraryPanel({
  selectedRouteId,
  onSelectRoute,
}: RouteLibraryPanelProps) {
  const {
    routes,
    removeRoute,
  } = useRouteLibrary();

  const [
    pendingRemovalRouteId,
    setPendingRemovalRouteId,
  ] = useState<string | null>(
    null,
  );

  const requestRemoval = (
    routeId: string,
  ): void => {
    setPendingRemovalRouteId(
      routeId,
    );
  };

  const cancelRemoval =
    (): void => {
      setPendingRemovalRouteId(
        null,
      );
    };

  const confirmRemoval = (
    routeId: string,
  ): void => {
    removeRoute(routeId);

    setPendingRemovalRouteId(
      null,
    );
  };

  return (
    <section
      aria-labelledby="route-library-title"
      className="space-y-5"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Mis rutas
        </p>

        <h3
          id="route-library-title"
          className="mt-1 text-xl font-bold text-slate-950"
        >
          Biblioteca personal
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Conserva tus recorridos importados y
          consulta la información utilizada por
          LUMAGOSA para evaluar cada ruta.
          Actualmente la biblioteca permanece
          almacenada en este navegador.
        </p>

        {routes.length > 0 ? (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {routes.length}{" "}
            {routes.length === 1
              ? "ruta guardada"
              : "rutas guardadas"}
          </p>
        ) : null}
      </div>

      {routes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <p className="font-semibold text-slate-800">
            Todavía no has guardado rutas.
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Importa un GPX, completa la
            información que el archivo no puede
            determinar por sí mismo y guarda el
            recorrido en tu biblioteca.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {routes.map((route) => {
            const isSelected =
              route.id ===
              selectedRouteId;

            const isPendingRemoval =
              route.id ===
              pendingRemovalRouteId;

            const quality =
              assessRouteDataQuality(
                route,
              );

            return (
              <article
                key={route.id}
                className={[
                  "rounded-2xl border p-5 transition",
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                    : "border-slate-200 bg-white",
                ].join(" ")}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mi ruta
                      </p>

                      {isSelected ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                          En evaluación
                        </span>
                      ) : null}
                    </div>

                    <h4 className="mt-2 text-lg font-bold text-slate-950">
                      {route.name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {route.region}
                    </p>
                  </div>

                  <span
                    className={[
                      "w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset",
                      qualityClasses[
                        quality.level
                      ],
                    ].join(" ")}
                  >
                    {
                      qualityLabels[
                        quality.level
                      ]
                    }
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <RouteMetric
                    label="Distancia"
                    value={`${route.distanceKm} km`}
                  />

                  <RouteMetric
                    label="Desnivel"
                    value={`${route.elevationGainM} m+`}
                  />

                  <RouteMetric
                    label="Exigencia"
                    value={
                      physicalDifficultyLabels[
                        route
                          .physicalDifficulty
                      ]
                    }
                  />

                  <RouteMetric
                    label="Técnica"
                    value={
                      technicalDifficultyLabels[
                        route
                          .technicalDifficulty
                      ]
                    }
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {
                      surfaceLabels[
                        route.surface
                      ]
                    }
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    Exposición{" "}
                    {
                      exposureLabels[
                        route
                          .exposureLevel
                      ]
                    }
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {
                      verificationLabels[
                        route.validation
                          .status
                      ]
                    }
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-slate-600">
                      Calidad de datos
                    </p>

                    <p className="text-sm font-black text-slate-950">
                      {quality.score}/100
                    </p>
                  </div>

                  {quality.warnings.length >
                  0 ? (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {
                        quality.warnings[
                          0
                        ]
                      }
                    </p>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      No hay observaciones
                      adicionales sobre la
                      calidad de esta ruta.
                    </p>
                  )}
                </div>

                {isPendingRemoval ? (
                  <div
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4"
                    role="alert"
                  >
                    <p className="text-sm font-bold text-red-900">
                      ¿Eliminar esta ruta?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      Se eliminará de la
                      biblioteca almacenada en
                      este navegador.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          confirmRemoval(
                            route.id,
                          )
                        }
                        className="rounded-full bg-red-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-800"
                      >
                        Sí, eliminar
                      </button>

                      <button
                        type="button"
                        onClick={
                          cancelRemoval
                        }
                        className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectRoute(
                          route,
                        )
                      }
                      className={[
                        "rounded-full px-4 py-2 text-xs font-bold transition",
                        isSelected
                          ? "bg-emerald-700 text-white hover:bg-emerald-800"
                          : "bg-slate-950 text-white hover:bg-slate-800",
                      ].join(" ")}
                    >
                      {isSelected
                        ? "Ruta en evaluación"
                        : "Evaluar ruta"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        requestRemoval(
                          route.id,
                        )
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
