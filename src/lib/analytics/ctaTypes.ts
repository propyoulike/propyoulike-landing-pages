// src/lib/analytics/ctaTypes.ts

/**
 * =====================================================
 * CANONICAL CTA TYPES (FROZEN)
 * =====================================================
 *
 * Purpose:
 * - Describes user intent behind a CTA click
 * - Used with EventName.CTAClick
 *
 * Rules:
 * - Intent-based, not UI-based
 * - Channel is a property, not the type
 * - Do NOT rename once released
 */

export enum CTAType {
  // ─────────────────────────────────
  // Soft intent (exploration)
  // ─────────────────────────────────
  ViewPricing = "view_pricing",
  ViewFloorPlans = "view_floor_plans",
  ViewLocation = "view_location",
  ViewAmenities = "view_amenities",

  // ─────────────────────────────────
  // Medium intent (content access)
  // ─────────────────────────────────
  DownloadBrochure = "download_brochure",
  ViewGallery = "view_gallery",
  WatchVideo = "watch_video",

  // ─────────────────────────────────
  // Hard intent (contact / action)
  // ─────────────────────────────────
  ContactWhatsApp = "contact_whatsapp",
  ContactCall = "contact_call",
  ContactForm = "contact_form",

  ScheduleSiteVisit = "schedule_site_visit",
  RequestCallback = "request_callback",
}
