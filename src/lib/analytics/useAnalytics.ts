import { EventName } from "./events";
import { debugEvent } from "./debug";
import { assertValidEvent } from "./guards";

type Properties = Record<string, any>;

export function useAnalytics() {
  function track(name: EventName, properties: Properties = {}) {
    // SSR guard
    if (typeof window === "undefined") return;

    // 🚨 DEV-ONLY GUARDRAILS
    if (process.env.NODE_ENV === "development") {
      assertValidEvent(name, properties);
    }

    // 🔍 Dev visibility
    debugEvent(name, properties);

    // GA4
    window.gtag?.("event", name, properties);
  }

  return { track };
}
