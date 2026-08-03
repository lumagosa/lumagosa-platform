"use client";

import { RouteCatalog } from "../../lib/routes/catalog";
import type {
  RoutePhysicalDifficulty,
  RouteProfile,
  RouteSurface,
  RouteTechnicalDifficulty,
  RouteTrustLevel,
} from "../../lib/routes/types";

interface RouteContextSelectorProps {
  selectedRouteId: string;
  onRouteChange: (routeId: string) => void;
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

const trustLabels: Record<
  RouteTrustLevel,
  string
> = {
  "lumagosa-verified": "Verificada por LUMAGOSA",
  "community-verified": "Verificada por comunidad",
  partial: "Información parcial",
};

function RouteSummary({
  route,
}: {
  route: RouteProfile;
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Distancia
        </p>

        <p className="mt-1 text-lg font-bold text-slate-950">
          {route.distanceKm} km
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Desnivel
        </p>

        <p className="mt-1 text-lg font-bold text-slate-950">
          {route.elevationGainM} m+
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Exigencia
        </p>

        <p className="mt-1 text-lg font-bold text-slate-950">
          {
            physicalDifficultyLabels[
              route.physicalDifficulty
            ]
          }
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Técnica
        </p>

        <p className="mt-1 text-lg font-bold text-slate-950">
          {
            technicalDifficultyLabels[
              route.technicalDifficulty
            ]
          }
        </p>
      </div>
    </div>
  );
}

export function RouteContextSelector({
  selectedRouteId,
  onRouteChange,
}: RouteContextSelectorProps) {
  const selectedRoute =
    RouteCatalog.find(
      (route) => route.id === selectedRouteId,
    ) ?? RouteCatalog[0];

  return (
    <section
      aria-labelledby="route-context-title"
      className="space-y-4"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Contexto de la rodada
        </p>

        <h3
          id="route-context-title"
          className="mt-1 text-xl font-semibold text-slate-900"
        >
          Selecciona una ruta
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          La ruta formará parte del contexto utilizado
          para evaluar dificultad, exposición y riesgo
          acumulado.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {RouteCatalog.map((route) => {
          const isSelected =
            route.id === selectedRouteId;

          return (
            <button
              key={route.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                onRouteChange(route.id)
              }
              className={[
                "rounded-2xl border p-4 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
              ].join(" ")}
            >
              <span className="block text-sm font-bold">
                {route.name}
              </span>

              <span
                className={[
                  "mt-1 block text-xs",
                  isSelected
                    ? "text-slate-300"
                    : "text-slate-500",
                ].join(" ")}
              >
                {route.region}
              </span>

              <span
                className={[
                  "mt-3 block text-sm leading-5",
                  isSelected
                    ? "text-slate-200"
                    : "text-slate-600",
                ].join(" ")}
              >
                {route.distanceKm} km ·{" "}
                {surfaceLabels[route.surface]}
              </span>
            </button>
          );
        })}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-950">
              {selectedRoute.name}
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              {selectedRoute.region}
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {trustLabels[selectedRoute.trustLevel]}
          </span>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          {selectedRoute.description}
        </p>

        <RouteSummary route={selectedRoute} />
      </article>
    </section>
  );
}