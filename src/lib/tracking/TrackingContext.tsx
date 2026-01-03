import { createContext, useContext, useEffect } from "react";
import { EventName } from "@/lib/analytics/events";
import { track as rawTrack } from "./track";

/* -------------------------------------------------
   Types
-------------------------------------------------- */
type TrackingContextValue = {
  context: Record<string, any>;
  track: (event: EventName, payload?: Record<string, any>) => void;
};

/* -------------------------------------------------
   Context
-------------------------------------------------- */
const TrackingContext = createContext<TrackingContextValue | null>(null);

/* -------------------------------------------------
   Provider
-------------------------------------------------- */
export function TrackingProvider({
  context,
  children,
}: {
  context: Record<string, any>;
  children: React.ReactNode;
}) {
  /**
   * Canonical event dispatcher
   * - Merges global context + event payload
   * - Delegates to the ONLY dataLayer writer
   */
  function track(event: EventName, payload: Record<string, any> = {}) {
    rawTrack(event, {
      ...context,
      ...payload,
    });
  }

  /* -------------------------------------------------
     One-time bootstrap: PageView
     - Fires once per page load
     - Uses the same canonical context
  -------------------------------------------------- */
  useEffect(() => {
    rawTrack(EventName.PageView, {
      ...context,
    });
  }, [context]);

  return (
    <TrackingContext.Provider value={{ context, track }}>
      {children}
    </TrackingContext.Provider>
  );
}

/* -------------------------------------------------
   Hook (STRICT)
-------------------------------------------------- */
export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) {
    throw new Error("useTracking must be used within TrackingProvider");
  }
  return ctx;
}
