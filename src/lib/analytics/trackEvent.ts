// src/lib/analytics/trackEvent.ts

import { EventName } from "./events";

export function trackEvent(
  name: EventName,
  properties: Record<string, any> = {}
) {
  // GA4
  window.gtag?.("event", name, properties);

  // Meta / others later
  // internal pipeline later
}
