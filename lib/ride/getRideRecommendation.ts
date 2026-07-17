import { getWeather } from "../weather/getWeather";
import { calculateRideRecommendation } from "./calculateRideRecommendation";
import type { RideRecommendation } from "./types";

export async function getRideRecommendation(): Promise<RideRecommendation> {
  const weather = await getWeather();

  return calculateRideRecommendation(weather);
}