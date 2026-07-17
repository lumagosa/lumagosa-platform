"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RideDiscipline } from "../../lib/ride/types";

interface RidePreferenceContextValue {
  discipline: RideDiscipline;
  setDiscipline: (discipline: RideDiscipline) => void;
}

const RidePreferenceContext =
  createContext<RidePreferenceContextValue | null>(null);

interface RidePreferenceProviderProps {
  children: ReactNode;
  initialDiscipline?: RideDiscipline;
}

export function RidePreferenceProvider({
  children,
  initialDiscipline = "xc",
}: RidePreferenceProviderProps) {
  const [discipline, setDiscipline] =
    useState<RideDiscipline>(initialDiscipline);

  const value = useMemo(
    () => ({
      discipline,
      setDiscipline,
    }),
    [discipline],
  );

  return (
    <RidePreferenceContext.Provider value={value}>
      {children}
    </RidePreferenceContext.Provider>
  );
}

export function useRidePreference(): RidePreferenceContextValue {
  const context = useContext(RidePreferenceContext);

  if (!context) {
    throw new Error(
      "useRidePreference must be used inside RidePreferenceProvider",
    );
  }

  return context;
}