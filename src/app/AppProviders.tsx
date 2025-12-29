// src/app/AppProviders.tsx

import { Outlet, useLocation } from "react-router-dom";
import { TrackingProvider } from "@/lib/tracking/TrackingContext";
import { buildTrackingContext } from "@/lib/tracking/buildTrackingContext";

export function AppProviders() {
  const { pathname } = useLocation();

  // ✅ Pass ONLY what the builder expects
  const trackingContext = buildTrackingContext({ pathname });

  return (
    <TrackingProvider context={trackingContext}>
      <Outlet />
    </TrackingProvider>
  );
}
