// src/lib/analytics/events.ts

/**
 * =====================================================
 * CANONICAL ANALYTICS EVENTS (FROZEN)
 * =====================================================
 *
 * Rules:
 * - These event names are a permanent contract
 * - Do NOT rename (breaking change)
 * - Do NOT add without product approval
 * - UI / section / CTA details go in properties
 *
 * This file is tool-agnostic (GA4, Meta, internal, etc.)
 */

export enum EventName {
  // ─────────────────────────────────
  // Page & Section visibility
  // ─────────────────────────────────
  PageView = "page_view",
  SectionView = "section_view",

  // ─────────────────────────────────
  // Navigation & exploration
  // ─────────────────────────────────
  NavClick = "nav_click",
  ScrollDepth = "scroll_depth",

  // ─────────────────────────────────
  // Media & content engagement
  // ─────────────────────────────────
  MediaOpen = "media_open",
  MediaPlay = "media_play",
  MediaComplete = "media_complete",

  BrochureView = "brochure_view",
  BrochureDownload = "brochure_download",

  // ─────────────────────────────────
  // CTAs & intent
  // ─────────────────────────────────
  CTAClick = "cta_click",
  ContactInitiated = "contact_initiated",

  // ─────────────────────────────────
  // Forms & leads
  // ─────────────────────────────────
  FormStart = "form_start",
  FormSubmit = "form_submit",
  LeadCreated = "lead_created",

  // ─────────────────────────────────
  // Trust & friction
  // ─────────────────────────────────
  TestimonialInteraction = "testimonial_interaction",
  FAQInteraction = "faq_interaction",

  FormError = "form_error",
}
