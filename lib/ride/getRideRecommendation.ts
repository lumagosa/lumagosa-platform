import { getWeather } from "../weather/getWeather";
import { calculateRideRecommendation } from "./calculateRideRecommendation";
import { RideProfiles } from "./profiles";
import type {
  RideDiscipline,
  RideRecommendation,
} from "./types";

export async function getRideRecommendation(
  discipline: RideDiscipline = "xc",
): Promise<RideRecommendation> {
  const weather = await getWeather();
  const profile = RideProfiles[discipline];

  return calculateRideRecommendation(weather, profile);
}