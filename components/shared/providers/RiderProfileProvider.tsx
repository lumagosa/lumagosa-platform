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
  getDefaultRiderProfileSnapshot,
  parseRiderProfileSnapshot,
  readRiderProfileSnapshot,
  storeRiderProfile,
  subscribeToRiderProfile,
} from "../../../lib/ride/riderProfileStorage";
import type {
  RiderExperienceLevel,
  RiderGoal,
  RiderProfile,
} from "../../../lib/ride/types";

interface RiderProfileContextValue {
  profile: RiderProfile;
  setExperienceLevel: (
    experienceLevel: RiderExperienceLevel,
  ) => void;
  setGoal: (goal: RiderGoal) => void;
  resetProfile: () => void;
}

const RiderProfileContext =
  createContext<RiderProfileContextValue | null>(
    null,
  );

interface RiderProfileProviderProps {
  children: ReactNode;
}

export function RiderProfileProvider({
  children,
}: RiderProfileProviderProps) {
  const snapshot = useSyncExternalStore(
    subscribeToRiderProfile,
    readRiderProfileSnapshot,
    getDefaultRiderProfileSnapshot,
  );

  const profile = useMemo(
    () => parseRiderProfileSnapshot(snapshot),
    [snapshot],
  );

  const setExperienceLevel = useCallback(
    (
      experienceLevel: RiderExperienceLevel,
    ) => {
      storeRiderProfile({
        ...profile,
        experienceLevel,
      });
    },
    [profile],
  );

  const setGoal = useCallback(
    (goal: RiderGoal) => {
      storeRiderProfile({
        ...profile,
        goal,
      });
    },
    [profile],
  );

  const resetProfile = useCallback(() => {
    storeRiderProfile({
      experienceLevel: "intermediate",
      goal: "recreation",
    });
  }, []);

  const value = useMemo(
    () => ({
      profile,
      setExperienceLevel,
      setGoal,
      resetProfile,
    }),
    [
      profile,
      resetProfile,
      setExperienceLevel,
      setGoal,
    ],
  );

  return (
    <RiderProfileContext.Provider value={value}>
      {children}
    </RiderProfileContext.Provider>
  );
}

export function useRiderProfile():
  RiderProfileContextValue {
  const context = useContext(
    RiderProfileContext,
  );

  if (!context) {
    throw new Error(
      "useRiderProfile must be used inside RiderProfileProvider",
    );
  }

  return context;
}