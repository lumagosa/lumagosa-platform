import type { RideDiscipline } from "./types";

const RIDE_DISCIPLINE_STORAGE_KEY =
  "lumagosa.ride.discipline";

const RIDE_DISCIPLINE_CHANGE_EVENT =
  "lumagosa:ride-discipline-change";

const validDisciplines: ReadonlySet<RideDiscipline> =
  new Set([
    "road",
    "xc",
    "trail",
    "enduro",
    "gravel",
    "urban",
  ]);

function isRideDiscipline(
  value: string,
): value is RideDiscipline {
  return validDisciplines.has(
    value as RideDiscipline,
  );
}

export function readStoredRideDiscipline():
  | RideDiscipline
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        RIDE_DISCIPLINE_STORAGE_KEY,
      );

    if (
      !storedValue ||
      !isRideDiscipline(storedValue)
    ) {
      return null;
    }

    return storedValue;
  } catch {
    return null;
  }
}

export function storeRideDiscipline(
  discipline: RideDiscipline,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      RIDE_DISCIPLINE_STORAGE_KEY,
      discipline,
    );

    window.dispatchEvent(
      new Event(
        RIDE_DISCIPLINE_CHANGE_EVENT,
      ),
    );
  } catch {
    // La aplicación continúa funcionando en memoria
    // aunque localStorage no esté disponible.
  }
}

export function subscribeToRideDiscipline(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  function handleStorageEvent(
    event: StorageEvent,
  ): void {
    if (
      event.key ===
      RIDE_DISCIPLINE_STORAGE_KEY
    ) {
      callback();
    }
  }

  window.addEventListener(
    "storage",
    handleStorageEvent,
  );

  window.addEventListener(
    RIDE_DISCIPLINE_CHANGE_EVENT,
    callback,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorageEvent,
    );

    window.removeEventListener(
      RIDE_DISCIPLINE_CHANGE_EVENT,
      callback,
    );
  };
}