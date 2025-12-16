// src/lib/track.ts
type TrackPayload = Record<string, any>;

export function track(event: string, payload: TrackPayload = {}) {
  if (import.meta.env.DEV) {
    console.log("📊 TRACK", event, payload);
    return;
  }

  // Works with Plausible / GA / PostHog later
  window?.plausible?.(event, { props: payload });
}
