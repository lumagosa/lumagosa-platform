import { getWeather } from "../../lib/weather/getWeather";
import { ReadinessDashboard } from "../readiness/ReadinessDashboard";
import { SectionHeading } from "../ui/SectionHeading";

export async function ReadinessSection() {
  const weather = await getWeather();

  return (
    <section
      id="hoy-para-rodar"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hoy para rodar"
          title={`Condiciones en ${weather.location}`}
        />

        <ReadinessDashboard weather={weather} />
      </div>
    </section>
  );
}