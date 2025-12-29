// src/lib/tracking/track.ts

import { EventName } from "@/lib/analytics/events";

export type TrackingPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

/**
 * =====================================================
 * Canonical Analytics Event Router
 * =====================================================
 *
 * RULES (ENFORCED HERE):
 * - This is the ONLY place dataLayer.push() is allowed
 * - Event names must come from EventName enum
 * - Payload must be FLAT (no nested objects)
 * - Global context is injected here, not in components
 * - GTM is a router ONLY
 *
 * Phase: 3 (Frozen)
 */

export function track(
  event: EventName,
  payload: TrackingPayload = {}
) {
  if (typeof window === "undefined") return;

  // 🔒 Runtime safety: block nested payloads in dev
  if (process.env.NODE_ENV === "development") {
    for (const value of Object.values(payload)) {
      if (typeof value === "object" && value !== null) {
        console.error(
          "[Analytics Contract Violation] Nested payload detected:",
          payload
        );
        return;
      }
    }
  }

  const dataLayerEvent = {
    // Required
    event,

    // Global context (contract-approved)
    page_path: window.location.pathname,
    page_title: document.title,

    // Event-specific, flat payload only
    ...payload,
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(dataLayerEvent);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Tracking failed:", dataLayerEvent, err);
    }
  }
}
