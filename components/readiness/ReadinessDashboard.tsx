"use client";

import { useMemo } from "react";
import { calculateRideRecommendation } from "../../lib/ride/calculateRideRecommendation";
import { RideProfiles } from "../../lib/ride/profiles";
import type { WeatherSnapshot } from "../../lib/weather/types";
import { useRidePreference } from "../shared/providers/RidePreferenceProvider";
import { MetricsGrid } from "./MetricsGrid";
import { ReasonsList } from "./ReasonsList";
import { RideDisciplineSelector } from "./RideDisciplineSelector";
import { ScoreCard } from "./ScoreCard";

interface ReadinessDashboardProps {
  weather: WeatherSnapshot;
}

function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(updatedAt));
}

export function ReadinessDashboard({
  weather,
}: ReadinessDashboardProps) {
  const { discipline } = useRidePreference();

  const recommendation = useMemo(
    () =>
      calculateRideRecommendation(
        weather,
        RideProfiles[discipline],
      ),
    [discipline, weather],
  );

  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RideDisciplineSelector />
      </div>

      <ScoreCard recommendation={recommendation} />

      <MetricsGrid recommendation={recommendation} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReasonsList
          title="¿Por qué esta recomendación?"
          items={recommendation.reasons}
          emptyMessage="No se identificaron ventajas destacables para esta ventana."
        />

        <ReasonsList
          title="Advertencias"
          items={recommendation.warnings}
          emptyMessage="No se identificaron advertencias relevantes."
          variant="warning"
        />
      </div>

      <footer className="flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Fuente meteorológica: {recommendation.source}
        </p>

        <p>
          Actualizado:{" "}
          {formatUpdatedAt(recommendation.updatedAt)}
        </p>
      </footer>
    </div>
  );
}