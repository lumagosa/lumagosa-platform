import { DefaultRiderProfile } from "./riderProfile";
import type {
  RiderExperienceLevel,
  RiderGoal,
  RiderProfile,
} from "./types";

const STORAGE_KEY = "lumagosa:rider-profile";
const PROFILE_CHANGE_EVENT =
  "lumagosa:rider-profile-change";

const DEFAULT_PROFILE_SNAPSHOT = JSON.stringify(
  DefaultRiderProfile,
);

const validExperienceLevels: RiderExperienceLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

const validGoals: RiderGoal[] = [
  "recreation",
  "fitness",
  "performance",
  "exploration",
];

function isRiderExperienceLevel(
  value: unknown,
): value is RiderExperienceLevel {
  return validExperienceLevels.includes(
    value as RiderExperienceLevel,
  );
}

function isRiderGoal(
  value: unknown,
): value is RiderGoal {
  return validGoals.includes(value as RiderGoal);
}

function normalizeRiderProfile(
  value: unknown,
): RiderProfile {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return DefaultRiderProfile;
  }

  const candidate = value as Partial<RiderProfile>;

  return {
    experienceLevel: isRiderExperienceLevel(
      candidate.experienceLevel,
    )
      ? candidate.experienceLevel
      : DefaultRiderProfile.experienceLevel,

    goal: isRiderGoal(candidate.goal)
      ? candidate.goal
      : DefaultRiderProfile.goal,
  };
}

export function getDefaultRiderProfileSnapshot(): string {
  return DEFAULT_PROFILE_SNAPSHOT;
}

export function readRiderProfileSnapshot(): string {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE_SNAPSHOT;
  }

  const storedValue =
    window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return DEFAULT_PROFILE_SNAPSHOT;
  }

  try {
    const parsedValue: unknown =
      JSON.parse(storedValue);

    return JSON.stringify(
      normalizeRiderProfile(parsedValue),
    );
  } catch {
    return DEFAULT_PROFILE_SNAPSHOT;
  }
}

export function parseRiderProfileSnapshot(
  snapshot: string,
): RiderProfile {
  try {
    const parsedValue: unknown =
      JSON.parse(snapshot);

    return normalizeRiderProfile(parsedValue);
  } catch {
    return DefaultRiderProfile;
  }
}

export function storeRiderProfile(
  profile: RiderProfile,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedProfile =
    normalizeRiderProfile(profile);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizedProfile),
  );

  window.dispatchEvent(
    new Event(PROFILE_CHANGE_EVENT),
  );
}

export function subscribeToRiderProfile(
  listener: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (
    event: StorageEvent,
  ): void => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener(
    PROFILE_CHANGE_EVENT,
    listener,
  );

  window.addEventListener(
    "storage",
    handleStorage,
  );

  return () => {
    window.removeEventListener(
      PROFILE_CHANGE_EVENT,
      listener,
    );

    window.removeEventListener(
      "storage",
      handleStorage,
    );
  };
}