import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { EventName } from "@/lib/analytics/events";
import { useTracking } from "@/lib/tracking/TrackingContext";

/**
 * =====================================================
 * Global Tracking Orchestrator
 * =====================================================
 *
 * Responsibilities:
 * - Fire page_view exactly once per route
 * - No UI
 * - No vendor logic
 *
 * MUST remain lightweight and deterministic
 */

export default function Tracking() {
  const location = useLocation();
  const { track } = useTracking();

  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;

    // Guard: fire once per route
    if (lastPathRef.current === currentPath) return;
    lastPathRef.current = currentPath;

    track(EventName.PageView);
  }, [location.pathname, track]);

  return null;
}
