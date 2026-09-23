"use client";

import type {
  RouteDiscipline,
  RouteExposureLevel,
  RouteProfile,
  RouteSurface,
  RouteTechnicalDifficulty,
} from "../../lib/routes/types";
import { useRouteLibrary } from "../shared/providers/RouteLibraryProvider";

interface ImportedRouteEditorProps {
  route: RouteProfile;

  onRouteChange: (
    route: RouteProfile,
  ) => void;

  onRemove: () => void;
}

const surfaceOptions: {
  value: RouteSurface;
  label: string;
  description: string;
}[] = [
  {
    value: "pavement",
    label: "Pavimento",
    description:
      "Asfalto, concreto o camino completamente pavimentado.",
  },
  {
    value: "gravel",
    label: "Grava",
    description:
      "Camino de grava compactada o material suelto fino.",
  },
  {
    value: "dirt",
    label: "Terracería",
    description:
      "Tierra compactada, caminos rurales o senderos sin pavimento.",
  },
  {
    value: "rock",
    label: "Roca",
    description:
      "Sectores rocosos, piedra suelta o terreno muy irregular.",
  },
  {
    value: "mixed",
    label: "Mixta",
    description:
      "Combinación de pavimento, terracería, grava o roca.",
  },
];

const technicalOptions: {
  value: RouteTechnicalDifficulty;
  label: string;
  description: string;
}[] = [
  {
    value: "basic",
    label: "Básica",
    description:
      "Camino estable, sin obstáculos técnicos importantes.",
  },
  {
    value: "intermediate",
    label: "Intermedia",
    description:
      "Curvas, terreno irregular y obstáculos moderados.",
  },
  {
    value: "advanced",
    label: "Avanzada",
    description:
      "Descensos exigentes, roca, escalones o pérdida de adherencia.",
  },
  {
    value: "expert",
    label: "Experta",
    description:
      "Sectores técnicos severos que requieren experiencia especializada.",
  },
];

const exposureOptions: {
  value: RouteExposureLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "low",
    label: "Baja",
    description:
      "Ruta cercana a poblaciones o con escapatorias frecuentes.",
  },
  {
    value: "moderate",
    label: "Moderada",
    description:
      "Sectores aislados, pero con opciones razonables de salida.",
  },
  {
    value: "high",
    label: "Alta",
    description:
      "Tramos remotos, crestas, barrancos o asistencia limitada.",
  },
];

const disciplineOptions: {
  value: RouteDiscipline;
  label: string;
}[] = [
  {
    value: "road",
    label: "Ruta",
  },
  {
    value: "xc",
    label: "Cross Country",
  },
  {
    value: "trail",
    label: "Trail",
  },
  {
    value: "enduro",
    label: "Enduro",
  },
  {
    value: "gravel",
    label: "Gravel",
  },
  {
    value: "urban",
    label: "Urbano",
  },
];

function getOptionClassName(
  isSelected: boolean,
): string {
  return [
    "rounded-xl border p-4 text-left transition",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
    isSelected
      ? "border-slate-950 bg-slate-950 text-white shadow-sm"
      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400",
  ].join(" ");
}

function updateValidationNotes(
  route: RouteProfile,
  fieldNote: string,
): string[] {
  const existingNotes =
    route.validation.notes ?? [];

  return [
    ...new Set([
      ...existingNotes,
      fieldNote,
    ]),
  ];
}

export function ImportedRouteEditor({
  route,
  onRouteChange,
  onRemove,
}: ImportedRouteEditorProps) {
  const {
    saveRoute,
    containsRoute,
  } = useRouteLibrary();

  const isSaved =
    containsRoute(route.id);

  const handleSurfaceChange = (
    surface: RouteSurface,
  ): void => {
    onRouteChange({
      ...route,
      surface,

      validation: {
        ...route.validation,

        notes: updateValidationNotes(
          route,
          "La superficie fue declarada manualmente por el usuario después de importar el GPX.",
        ),
      },
    });
  };

  const handleTechnicalChange = (
    technicalDifficulty:
      RouteTechnicalDifficulty,
  ): void => {
    onRouteChange({
      ...route,
      technicalDifficulty,

      validation: {
        ...route.validation,

        notes: updateValidationNotes(
          route,
          "La dificultad técnica fue declarada manualmente y requiere verificación independiente.",
        ),
      },
    });
  };

  const handleExposureChange = (
    exposureLevel: RouteExposureLevel,
  ): void => {
    onRouteChange({
      ...route,
      exposureLevel,

      validation: {
        ...route.validation,

        notes: updateValidationNotes(
          route,
          "El nivel de exposición fue declarado manualmente por el usuario.",
        ),
      },
    });
  };

  const handleDisciplineToggle = (
    discipline: RouteDiscipline,
  ): void => {
    const isSelected =
      route.recommendedDisciplines.includes(
        discipline,
      );

    const recommendedDisciplines =
      isSelected
        ? route.recommendedDisciplines.filter(
            (item) =>
              item !== discipline,
          )
        : [
            ...route.recommendedDisciplines,
            discipline,
          ];

    onRouteChange({
      ...route,
      recommendedDisciplines,

      validation: {
        ...route.validation,

        notes: updateValidationNotes(
          route,
          "Las disciplinas recomendadas fueron ajustadas manualmente.",
        ),
      },
    });
  };

  return (
    <section
      aria-labelledby="imported-route-editor-title"
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Ruta GPX activa
          </p>

          <h3
            id="imported-route-editor-title"
            className="mt-1 text-xl font-bold text-slate-950"
          >
            Completa la información del terreno
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            El GPX proporciona geometría y
            elevación, pero estos datos
            contextuales deben confirmarse por
            una persona que conozca o haya
            recorrido la ruta.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              saveRoute(route)
            }
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {isSaved
              ? "Actualizar ruta guardada"
              : "Guardar en Mis rutas"}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50"
          >
            Retirar ruta importada
          </button>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-950">
          Superficie predominante
        </legend>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {surfaceOptions.map(
            (option) => {
              const isSelected =
                route.surface ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleSurfaceChange(
                      option.value,
                    )
                  }
                  className={getOptionClassName(
                    isSelected,
                  )}
                >
                  <span className="block font-bold">
                    {option.label}
                  </span>

                  <span
                    className={[
                      "mt-1 block text-xs leading-5",
                      isSelected
                        ? "text-slate-300"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {
                      option.description
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-950">
          Dificultad técnica estimada
        </legend>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {technicalOptions.map(
            (option) => {
              const isSelected =
                route.technicalDifficulty ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleTechnicalChange(
                      option.value,
                    )
                  }
                  className={getOptionClassName(
                    isSelected,
                  )}
                >
                  <span className="block font-bold">
                    {option.label}
                  </span>

                  <span
                    className={[
                      "mt-1 block text-xs leading-5",
                      isSelected
                        ? "text-slate-300"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {
                      option.description
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-950">
          Nivel de exposición
        </legend>

        <div className="grid gap-3 md:grid-cols-3">
          {exposureOptions.map(
            (option) => {
              const isSelected =
                route.exposureLevel ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleExposureChange(
                      option.value,
                    )
                  }
                  className={getOptionClassName(
                    isSelected,
                  )}
                >
                  <span className="block font-bold">
                    {option.label}
                  </span>

                  <span
                    className={[
                      "mt-1 block text-xs leading-5",
                      isSelected
                        ? "text-slate-300"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {
                      option.description
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-slate-950">
          Disciplinas compatibles
        </legend>

        <div className="flex flex-wrap gap-2">
          {disciplineOptions.map(
            (option) => {
              const isSelected =
                route.recommendedDisciplines.includes(
                  option.value,
                );

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleDisciplineToggle(
                      option.value,
                    )
                  }
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            },
          )}
        </div>

        {route.recommendedDisciplines
          .length === 0 ? (
          <p className="text-sm font-medium text-amber-700">
            Selecciona al menos una disciplina
            compatible.
          </p>
        ) : null}
      </fieldset>

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950">
        <p className="font-bold">
          Evaluación actualizada
        </p>

        <p className="mt-2 text-sm leading-6">
          Los cambios se aplican inmediatamente
          al RouteProfile y al RiskEngine.
          Cuando quieras conservarlos, utiliza
          Guardar en Mis rutas o Actualizar ruta
          guardada.
        </p>
      </div>
    </section>
  );
}