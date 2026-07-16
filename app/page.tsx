import { SiteFooter } from "../components/layout/SiteFooter";
import { SiteHeader } from "../components/layout/SiteHeader";
import { ClosingSection } from "../components/sections/ClosingSection";
import { GearSection } from "../components/sections/GearSection";
import { HeroSection } from "../components/sections/HeroSection";
import { KnowledgeSection } from "../components/sections/KnowledgeSection";
import { ReadinessSection } from "../components/sections/ReadinessSection";
import { RoutesSection } from "../components/sections/RoutesSection";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ReadinessSection />
      <RoutesSection />
      <KnowledgeSection />
      <GearSection />
      <ClosingSection />
      <SiteFooter />
    </main>
  );
}
