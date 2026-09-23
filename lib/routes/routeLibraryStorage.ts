import type { RouteProfile } from "./types";

const STORAGE_KEY =
  "lumagosa.route-library.v1";

const CHANGE_EVENT =
  "lumagosa:route-library-change";

const EMPTY_SNAPSHOT = "[]";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isRouteProfile(
  value: unknown,
): value is RouteProfile {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const route =
    value as Partial<RouteProfile>;

  return (
    typeof route.id === "string" &&
    typeof route.slug === "string" &&
    typeof route.name === "string" &&
    typeof route.region === "string" &&
    typeof route.description === "string" &&
    typeof route.distanceKm === "number" &&
    typeof route.elevationGainM === "number" &&
    typeof route.estimatedDurationMinutes ===
      "number" &&
    Array.isArray(
      route.recommendedDisciplines,
    ) &&
    Array.isArray(route.safetyFeatures) &&
    Array.isArray(route.sources) &&
    typeof route.validation === "object" &&
    route.validation !== null
  );
}

function parseSnapshot(
  snapshot: string,
): RouteProfile[] {
  try {
    const parsed: unknown =
      JSON.parse(snapshot);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      isRouteProfile,
    );
  } catch {
    return [];
  }
}

function normalizeRoutes(
  routes: RouteProfile[],
): RouteProfile[] {
  const uniqueRoutes = new Map<
    string,
    RouteProfile
  >();

  routes.forEach((route) => {
    uniqueRoutes.set(
      route.id,
      route,
    );
  });

  return [
    ...uniqueRoutes.values(),
  ];
}

function writeRoutes(
  routes: RouteProfile[],
): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedRoutes =
    normalizeRoutes(routes);

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      normalizedRoutes,
    ),
  );

  window.dispatchEvent(
    new Event(CHANGE_EVENT),
  );
}

export function getRouteLibrarySnapshot(): string {
  if (!isBrowser()) {
    return EMPTY_SNAPSHOT;
  }

  return (
    window.localStorage.getItem(
      STORAGE_KEY,
    ) ?? EMPTY_SNAPSHOT
  );
}

export function getRouteLibraryServerSnapshot(): string {
  return EMPTY_SNAPSHOT;
}

export function readRouteLibrary(
  snapshot: string,
): RouteProfile[] {
  return parseSnapshot(snapshot);
}

export function saveRouteToLibrary(
  route: RouteProfile,
): void {
  const currentRoutes =
    parseSnapshot(
      getRouteLibrarySnapshot(),
    );

  writeRoutes([
    route,
    ...currentRoutes.filter(
      (currentRoute) =>
        currentRoute.id !==
        route.id,
    ),
  ]);
}

export function removeRouteFromLibrary(
  routeId: string,
): void {
  const currentRoutes =
    parseSnapshot(
      getRouteLibrarySnapshot(),
    );

  writeRoutes(
    currentRoutes.filter(
      (route) =>
        route.id !== routeId,
    ),
  );
}

export function clearRouteLibrary(): void {
  writeRoutes([]);
}

export function subscribeToRouteLibrary(
  listener: () => void,
): () => void {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleStorage = (
    event: StorageEvent,
  ): void => {
    if (
      event.key === STORAGE_KEY
    ) {
      listener();
    }
  };

  window.addEventListener(
    "storage",
    handleStorage,
  );

  window.addEventListener(
    CHANGE_EVENT,
    listener,
  );

  return () => {
    window.removeEventListener(
      "storage",
      handleStorage,
    );

    window.removeEventListener(
      CHANGE_EVENT,
      listener,
    );
  };
}