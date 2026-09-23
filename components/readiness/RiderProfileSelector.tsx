"use client";

import {
  RiderExperienceOptions,
  RiderGoalOptions,
} from "../../lib/ride/riderProfile";
import type {
  RiderExperienceLevel,
  RiderGoal,
} from "../../lib/ride/types";
import { useRiderProfile } from "../shared/providers/RiderProfileProvider";

function getOptionClassName(
  isSelected: boolean,
): string {
  const baseClassName =
    "rounded-xl border p-4 text-left transition";

  if (isSelected) {
    return `${baseClassName} border-slate-900 bg-slate-900 text-white shadow-sm`;
  }

  return `${baseClassName} border-slate-200 bg-white text-slate-700 hover:border-slate-400`;
}

export function RiderProfileSelector() {
  const {
    profile,
    setExperienceLevel,
    setGoal,
    resetProfile,
  } = useRiderProfile();

  const handleExperienceChange = (
    experienceLevel: RiderExperienceLevel,
  ): void => {
    setExperienceLevel(experienceLevel);
  };

  const handleGoalChange = (
    goal: RiderGoal,
  ): void => {
    setGoal(goal);
  };

  return (
    <section
      aria-labelledby="rider-profile-title"
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Perfil del ciclista
          </p>

          <h3
            id="rider-profile-title"
            className="mt-1 text-xl font-semibold text-slate-900"
          >
            Personaliza tu experiencia
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Estos datos permitirán adaptar
            progresivamente las recomendaciones,
            rutas y contenidos de LUMAGOSA.
          </p>
        </div>

        <button
          type="button"
          onClick={resetProfile}
          className="self-start text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          Restaurar perfil
        </button>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900">
          Nivel de experiencia
        </legend>

        <div className="grid gap-3 md:grid-cols-3">
          {RiderExperienceOptions.map(
            (option) => {
              const isSelected =
                profile.experienceLevel ===
                option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    handleExperienceChange(
                      option.value,
                    )
                  }
                  className={getOptionClassName(
                    isSelected,
                  )}
                >
                  <span className="block font-semibold">
                    {option.label}
                  </span>

                  <span
                    className={`mt-1 block text-sm leading-5 ${
                      isSelected
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {option.description}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-slate-900">
          Objetivo principal
        </legend>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {RiderGoalOptions.map((option) => {
            const isSelected =
              profile.goal === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() =>
                  handleGoalChange(option.value)
                }
                className={getOptionClassName(
                  isSelected,
                )}
              >
                <span className="block font-semibold">
                  {option.label}
                </span>

                <span
                  className={`mt-1 block text-sm leading-5 ${
                    isSelected
                      ? "text-slate-200"
                      : "text-slate-500"
                  }`}
                >
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}