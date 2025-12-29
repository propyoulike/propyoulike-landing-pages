import { createContext, useContext, useEffect } from "react";
import { EventName } from "@/lib/analytics/events";
import { track as rawTrack } from "./track";

type TrackingContextValue = {
  context: Record<string, any>;
  track: (event: EventName, payload?: Record<string, any>) => void;
};

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function TrackingProvider({
  context,
  children,
}: {
  context: Record<string, any>;
  children: React.ReactNode;
}) {
  function track(event: EventName, payload: Record<string, any> = {}) {
    rawTrack(event, {
      ...context,
      ...payload,
    });
  }

  /* ✅ ONE-TIME BOOTSTRAP SIDE EFFECT */
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

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) {
    throw new Error("useTracking must be used within TrackingProvider");
  }
  return ctx;
}
