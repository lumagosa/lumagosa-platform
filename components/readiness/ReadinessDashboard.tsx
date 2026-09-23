"use client";

import {
  useMemo,
  useState,
} from "react";
import { createRideContext } from "../../lib/ride/createRideContext";
import { RideProfiles } from "../../lib/ride/profiles";
import { recommendationEngine } from "../../lib/ride/recommendationEngine";
import {
  DefaultRouteProfile,
  RouteCatalog,
} from "../../lib/routes/catalog";
import type { RouteProfile } from "../../lib/routes/types";
import type { WeatherSnapshot } from "../../lib/weather/types";
import { useRidePreference } from "../shared/providers/RidePreferenceProvider";
import { useRiderProfile } from "../shared/providers/RiderProfileProvider";
import { useRouteLibrary } from "../shared/providers/RouteLibraryProvider";
import { GpxImportPanel } from "./GpxImportPanel";
import { ImportedRouteEditor } from "./ImportedRouteEditor";
import { MetricsGrid } from "./MetricsGrid";
import { ReasonsList } from "./ReasonsList";
import { RideDisciplineSelector } from "./RideDisciplineSelector";
import { RiderProfileSelector } from "./RiderProfileSelector";
import { RiskAssessmentCard } from "./RiskAssessmentCard";
import { RouteContextSelector } from "./RouteContextSelector";
import { RouteLibraryPanel } from "./RouteLibraryPanel";
import { ScoreCard } from "./ScoreCard";

interface ReadinessDashboardProps {
  weather: WeatherSnapshot;
}

function formatUpdatedAt(
  updatedAt: string,
): string {
  return new Intl.DateTimeFormat(
    "es-MX",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone:
        "America/Mexico_City",
    },
  ).format(
    new Date(updatedAt),
  );
}

export function ReadinessDashboard({
  weather,
}: ReadinessDashboardProps) {
  const { discipline } =
    useRidePreference();

  const { profile: riderProfile } =
    useRiderProfile();

  const { routes: libraryRoutes } =
    useRouteLibrary();

  const [
    importedRoute,
    setImportedRoute,
  ] = useState<RouteProfile | null>(
    null,
  );

  const [
    selectedRouteId,
    setSelectedRouteId,
  ] = useState(
    DefaultRouteProfile.id,
  );

  const availableRoutes = useMemo(
    () => {
      const routesById =
        new Map<
          string,
          RouteProfile
        >();

      for (const route of RouteCatalog) {
        routesById.set(
          route.id,
          route,
        );
      }

      for (const route of libraryRoutes) {
        routesById.set(
          route.id,
          route,
        );
      }

      if (importedRoute) {
        routesById.set(
          importedRoute.id,
          importedRoute,
        );
      }

      return Array.from(
        routesById.values(),
      );
    },
    [
      importedRoute,
      libraryRoutes,
    ],
  );

  const selectedRoute = useMemo(
    () =>
      availableRoutes.find(
        (route) =>
          route.id ===
          selectedRouteId,
      ) ?? availableRoutes[0],
    [
      availableRoutes,
      selectedRouteId,
    ],
  );

  const recommendation =
    useMemo(() => {
      const context =
        createRideContext({
          weather,

          rideProfile:
            RideProfiles[
              discipline
            ],

          riderProfile,

          routeProfile:
            selectedRoute,
        });

      return recommendationEngine.evaluate(
        context,
      );
    }, [
      discipline,
      riderProfile,
      selectedRoute,
      weather,
    ]);

  const handleImportedRoute = (
    route: RouteProfile,
  ): void => {
    setImportedRoute(route);

    setSelectedRouteId(
      route.id,
    );
  };

  const handleImportedRouteChange = (
    route: RouteProfile,
  ): void => {
    setImportedRoute(route);

    setSelectedRouteId(
      route.id,
    );
  };

  const handleLibraryRoute = (
    route: RouteProfile,
  ): void => {
    setSelectedRouteId(
      route.id,
    );
  };

  const handleRemoveImportedRoute =
    (): void => {
      const removedRouteId =
        importedRoute?.id;

      setImportedRoute(null);

      if (
        removedRouteId &&
        selectedRouteId ===
          removedRouteId
      ) {
        setSelectedRouteId(
          DefaultRouteProfile.id,
        );
      }
    };

  const libraryRouteIds =
    useMemo(
      () =>
        libraryRoutes.map(
          (route) => route.id,
        ),
      [libraryRoutes],
    );

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RideDisciplineSelector />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RiderProfileSelector />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <GpxImportPanel
          onRouteReady={
            handleImportedRoute
          }
        />
      </div>

      {importedRoute ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
          <ImportedRouteEditor
            route={
              importedRoute
            }
            onRouteChange={
              handleImportedRouteChange
            }
            onRemove={
              handleRemoveImportedRoute
            }
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RouteLibraryPanel
          selectedRouteId={
            selectedRouteId
          }
          onSelectRoute={
            handleLibraryRoute
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RouteContextSelector
          selectedRouteId={
            selectedRouteId
          }
          onRouteChange={
            setSelectedRouteId
          }
          routes={
            availableRoutes
          }
          importedRouteId={
            importedRoute?.id
          }
          libraryRouteIds={
            libraryRouteIds
          }
        />
      </div>

      <ScoreCard
        recommendation={
          recommendation
        }
      />

      {recommendation.riskAssessment ? (
        <RiskAssessmentCard
          assessment={
            recommendation.riskAssessment
          }
        />
      ) : null}

      <MetricsGrid
        recommendation={
          recommendation
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReasonsList
          title="¿Por qué esta recomendación?"
          items={
            recommendation.reasons
          }
          emptyMessage="No se identificaron ventajas destacables para esta ventana."
        />

        <ReasonsList
          title="Advertencias"
          items={
            recommendation.warnings
          }
          emptyMessage="No se identificaron advertencias relevantes."
          variant="warning"
        />
      </div>

      <footer className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Fuente meteorológica:{" "}
          {
            recommendation.source
          }
        </p>

        <p>
          Actualizado:{" "}
          {formatUpdatedAt(
            recommendation.updatedAt,
          )}
        </p>
      </footer>
    </div>
  );
}
