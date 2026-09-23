"use client";

import type { RouteProfile } from "../../lib/routes/types";
import { useRouteLibrary } from "../shared/providers/RouteLibraryProvider";

interface RouteLibraryPanelProps {
  selectedRouteId: string;

  onSelectRoute: (
    route: RouteProfile,
  ) => void;
}

export function RouteLibraryPanel({
  selectedRouteId,
  onSelectRoute,
}: RouteLibraryPanelProps) {
  const {
    routes,
    removeRoute,
  } = useRouteLibrary();

  return (
    <section
      aria-labelledby="route-library-title"
      className="space-y-4"
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
          Las rutas guardadas permanecen
          disponibles en este navegador.
          Posteriormente esta biblioteca podrá
          sincronizarse con una cuenta
          LUMAGOSA.
        </p>
      </div>

      {routes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <p className="font-semibold text-slate-800">
            Todavía no has guardado rutas.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Importa un GPX, completa su
            información y guárdalo en tu
            biblioteca.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {routes.map((route) => {
            const isSelected =
              route.id ===
              selectedRouteId;

            return (
              <article
                key={route.id}
                className={[
                  "rounded-2xl border p-4",
                  isSelected
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-slate-200 bg-white",
                ].join(" ")}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ruta guardada
                </p>

                <h4 className="mt-1 font-bold text-slate-950">
                  {route.name}
                </h4>

                <p className="mt-2 text-sm text-slate-600">
                  {route.distanceKm} km ·{" "}
                  {route.elevationGainM} m+
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {route.region}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectRoute(
                        route,
                      )
                    }
                    className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    Evaluar ruta
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeRoute(
                        route.id,
                      )
                    }
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}