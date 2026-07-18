"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  readStoredRideDiscipline,
  storeRideDiscipline,
  subscribeToRideDiscipline,
} from "../../../lib/ride/preferenceStorage";
import type { RideDiscipline } from "../../../lib/ride/types";

interface RidePreferenceContextValue {
  discipline: RideDiscipline;
  setDiscipline: (
    discipline: RideDiscipline,
  ) => void;
}

const RidePreferenceContext =
  createContext<RidePreferenceContextValue | null>(
    null,
  );

interface RidePreferenceProviderProps {
  children: ReactNode;
  initialDiscipline?: RideDiscipline;
}

export function RidePreferenceProvider({
  children,
  initialDiscipline = "xc",
}: RidePreferenceProviderProps) {
  const discipline = useSyncExternalStore(
    subscribeToRideDiscipline,
    () =>
      readStoredRideDiscipline() ??
      initialDiscipline,
    () => initialDiscipline,
  );

  const setDiscipline = useCallback(
    (newDiscipline: RideDiscipline) => {
      storeRideDiscipline(newDiscipline);
    },
    [],
  );

  const value = useMemo(
    () => ({
      discipline,
      setDiscipline,
    }),
    [discipline, setDiscipline],
  );

  return (
    <RidePreferenceContext.Provider
      value={value}
    >
      {children}
    </RidePreferenceContext.Provider>
  );
}

export function useRidePreference():
  RidePreferenceContextValue {
  const context = useContext(
    RidePreferenceContext,
  );

  if (!context) {
    throw new Error(
      "useRidePreference must be used inside RidePreferenceProvider",
    );
  }

  return context;
}