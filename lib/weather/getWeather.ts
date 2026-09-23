import { getWeatherFromOpenMeteo } from "./providers/openMeteoProvider";
import type { WeatherSnapshot } from "./types";

export async function getWeather(): Promise<WeatherSnapshot> {
  return getWeatherFromOpenMeteo();
}