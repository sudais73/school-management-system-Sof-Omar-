import { Footer } from "#/components/footer";
import { Navbar } from "#/components/navbar";
import { CtaBand } from "#/features/landing/component/cta-band";
import { FeaturesGrid } from "#/features/landing/component/features-grid";
import { Hero } from "#/features/landing/component/hero";
import { OfflineStrip } from "#/features/landing/component/offline-strip";
import { Roles } from "#/features/landing/component/roles";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-chalk text-ink">
      <Navbar />
      <Hero />
      <FeaturesGrid />
      <OfflineStrip />
      <Roles />
      <CtaBand />
      <Footer />
    </div>
  );
}
