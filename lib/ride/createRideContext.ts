import type { RouteProfile } from "../routes/types";
import type { WeatherSnapshot } from "../weather/types";
import { RideProfiles } from "./profiles";
import { DefaultRiderProfile } from "./riderProfile";
import type {
  RideContext,
  RideProfile,
  RiderProfile,
} from "./types";

interface CreateRideContextInput {
  weather: WeatherSnapshot;
  rideProfile?: RideProfile;
  riderProfile?: RiderProfile;
  routeProfile?: RouteProfile;
}

export function createRideContext({
  weather,
  rideProfile = RideProfiles.xc,
  riderProfile = DefaultRiderProfile,
  routeProfile,
}: CreateRideContextInput): RideContext {
  return {
    weather,
    rideProfile,
    riderProfile,
    routeProfile,
  };
}