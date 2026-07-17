"use client";

import { RideProfiles } from "../../lib/ride/profiles";
import type { RideDiscipline } from "../../lib/ride/types";
import { useRidePreference } from "../providers/RidePreferenceProvider";

const disciplines: RideDiscipline[] = [
  "road",
  "xc",
  "trail",
  "enduro",
  "gravel",
  "urban",
];

const disciplineIcons: Record<RideDiscipline, string> = {
  road: "🚴",
  xc: "🚵",
  trail: "🌲",
  enduro: "⛰️",
  gravel: "🪨",
  urban: "🏙️",
};

export function RideDisciplineSelector() {
  const { discipline, setDiscipline } =
    useRidePreference();

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-700">
        Selecciona tu disciplina
      </legend>

      <div className="mt-3 flex flex-wrap gap-2">
        {disciplines.map((item) => {
          const profile = RideProfiles[item];
          const isActive = item === discipline;

          return (
            <button
              key={item}
              type="button"
              aria-pressed={isActive}
              onClick={() => setDiscipline(item)}
              className={[
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
                isActive
                  ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-100",
              ].join(" ")}
            >
              <span aria-hidden="true">
                {disciplineIcons[item]}
              </span>

              <span>{profile.displayName}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}