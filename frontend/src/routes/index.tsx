import { Footer } from "#/components/footer";
import { Navbar } from "#/components/navbar";
import { CtaBand } from "#/features/landing/component/cta-band";
import { FeaturesGrid } from "#/features/landing/component/features-grid";
import { Hero } from "#/features/landing/component/hero";
import { OfflineStrip } from "#/features/landing/component/offline-strip";
import { Roles } from "#/features/landing/component/roles";
import { apiClient } from "#/lib/api";
import { setAuth } from "#/lib/auth-store";
import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";


export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
   const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);


  useEffect(() => {
    apiClient
      .post("/api/auth/refresh")
      .then(({ data }) => {
          setAuth({ token: data.token, role: data.role });
        navigate({ to: "/dashboard" });
      })
      .catch(() => {
        // No valid session — that's fine, just show the login form
        setCheckingSession(false);
      });
  }, [navigate]);

  if (checkingSession) {
    return null; // or a small spinner if a blank flash bothers you
  }
  
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
