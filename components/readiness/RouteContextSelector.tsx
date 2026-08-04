"use client";

import { RouteCatalog } from "../../lib/routes/catalog";
import {
  assessRouteDataQuality,
  type RouteDataQualityLevel,
} from "../../lib/routes/routeQuality";
import type {
  RoutePhysicalDifficulty,
  RouteProfile,
  RouteSurface,
  RouteTechnicalDifficulty,
  RouteTrustLevel,
  RouteVerificationStatus,
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
  "lumagosa-verified":
    "Verificada por LUMAGOSA",
  "community-verified":
    "Verificada por comunidad",
  partial: "Información parcial",
};

const verificationLabels: Record<
  RouteVerificationStatus,
  string
> = {
  draft: "Borrador",
  "field-review": "En revisión de campo",
  verified: "Verificada",
  deprecated: "Obsoleta",
};

const qualityClasses: Record<
  RouteDataQualityLevel,
  string
> = {
  insufficient:
    "border-red-200 bg-red-50 text-red-900",

  provisional:
    "border-amber-200 bg-amber-50 text-amber-900",

  usable:
    "border-blue-200 bg-blue-50 text-blue-900",

  verified:
    "border-emerald-200 bg-emerald-50 text-emerald-900",
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

function RouteQualityPanel({
  route,
}: {
  route: RouteProfile;
}) {
  const quality =
    assessRouteDataQuality(route);

  return (
    <section
      className={[
        "mt-5 rounded-2xl border p-5",
        qualityClasses[quality.level],
      ].join(" ")}
      aria-label="Calidad de la información de la ruta"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">
            Calidad de datos
          </p>

          <h5 className="mt-1 text-lg font-black">
            {quality.label}
          </h5>
        </div>

        <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-sm font-bold">
          {quality.score}/100
        </span>
      </div>

      {quality.missingFields.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-bold">
            Información pendiente
          </p>

          <ul className="mt-2 space-y-1 text-sm">
            {quality.missingFields.map(
              (field) => (
                <li key={field}>
                  • {field}
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}

      {quality.warnings.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-bold">
            Observaciones
          </p>

          <ul className="mt-2 space-y-1 text-sm">
            {quality.warnings.map(
              (warning) => (
                <li key={warning}>
                  • {warning}
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RouteContextSelector({
  selectedRouteId,
  onRouteChange,
}: RouteContextSelectorProps) {
  const selectedRoute =
    RouteCatalog.find(
      (route) =>
        route.id === selectedRouteId,
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
          La recomendación combina las
          características de la ruta, el clima y
          el perfil del ciclista. Las fichas
          piloto todavía requieren validación
          mediante trazados GPX y revisión de
          campo.
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

              <span
                className={[
                  "mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                  isSelected
                    ? "bg-white/10 text-slate-200"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {
                  verificationLabels[
                    route.validation.status
                  ]
                }
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

          <div className="flex flex-wrap gap-2">
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {
                trustLabels[
                  selectedRoute.trustLevel
                ]
              }
            </span>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {
                verificationLabels[
                  selectedRoute.validation
                    .status
                ]
              }
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          {selectedRoute.description}
        </p>

        <RouteSummary
          route={selectedRoute}
        />

        <RouteQualityPanel
          route={selectedRoute}
        />
      </article>
    </section>
  );
}