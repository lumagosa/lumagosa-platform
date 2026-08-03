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
}

export function createRideContext({
  weather,
  rideProfile = RideProfiles.xc,
  riderProfile = DefaultRiderProfile,
}: CreateRideContextInput): RideContext {
  return {
    weather,
    rideProfile,
    riderProfile,
  };
}