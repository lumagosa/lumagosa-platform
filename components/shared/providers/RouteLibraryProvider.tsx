"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearRouteLibrary,
  getRouteLibraryServerSnapshot,
  getRouteLibrarySnapshot,
  readRouteLibrary,
  removeRouteFromLibrary,
  saveRouteToLibrary,
  subscribeToRouteLibrary,
} from "../../../lib/routes/routeLibraryStorage";
import type { RouteProfile } from "../../../lib/routes/types";

interface RouteLibraryContextValue {
  routes: RouteProfile[];

  saveRoute: (
    route: RouteProfile,
  ) => void;

  removeRoute: (
    routeId: string,
  ) => void;

  clearRoutes: () => void;

  containsRoute: (
    routeId: string,
  ) => boolean;
}

const RouteLibraryContext =
  createContext<RouteLibraryContextValue | null>(
    null,
  );

interface RouteLibraryProviderProps {
  children: ReactNode;
}

export function RouteLibraryProvider({
  children,
}: RouteLibraryProviderProps) {
  const snapshot =
    useSyncExternalStore(
      subscribeToRouteLibrary,
      getRouteLibrarySnapshot,
      getRouteLibraryServerSnapshot,
    );

  const routes = useMemo(
    () =>
      readRouteLibrary(snapshot),
    [snapshot],
  );

  const value = useMemo<RouteLibraryContextValue>(
    () => ({
      routes,

      saveRoute:
        saveRouteToLibrary,

      removeRoute:
        removeRouteFromLibrary,

      clearRoutes:
        clearRouteLibrary,

      containsRoute: (
        routeId: string,
      ) =>
        routes.some(
          (route) =>
            route.id === routeId,
        ),
    }),
    [routes],
  );

  return (
    <RouteLibraryContext.Provider
      value={value}
    >
      {children}
    </RouteLibraryContext.Provider>
  );
}

export function useRouteLibrary(): RouteLibraryContextValue {
  const context =
    useContext(
      RouteLibraryContext,
    );

  if (!context) {
    throw new Error(
      "useRouteLibrary debe utilizarse dentro de RouteLibraryProvider.",
    );
  }

  return context;
}
