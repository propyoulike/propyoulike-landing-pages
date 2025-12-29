// src/lib/analytics/sectionIds.ts

/**
 * =====================================================
 * CANONICAL SECTION IDS (FROZEN)
 * =====================================================
 *
 * Purpose:
 * - Stable semantic identifiers for page sections
 * - Used across analytics, navigation, scroll, attribution
 *
 * Rules:
 * - Do NOT rename once released (breaking change)
 * - Do NOT add without product approval
 * - Labels/UI may change; IDs must not
 */

export enum SectionId {
  // ─────────────────────────────────
  // Above-the-fold / Orientation
  // ─────────────────────────────────
  Hero = "hero",
  Summary = "summary",
  Highlights = "highlights",

  // ─────────────────────────────────
  // Product & Inventory
  // ─────────────────────────────────
  Pricing = "pricing",
  FloorPlans = "floor_plans",
  UnitMix = "unit_mix",
  Availability = "availability",
  ConstructionStatus = "construction_status",

  // ─────────────────────────────────
  // Location & Context
  // ─────────────────────────────────
  Location = "location",
  Connectivity = "connectivity",
  Neighborhood = "neighborhood",

  // ─────────────────────────────────
  // Amenities & Lifestyle
  // ─────────────────────────────────
  Amenities = "amenities",
  Clubhouse = "clubhouse",
  OpenSpaces = "open_spaces",

  // ─────────────────────────────────
  // Trust & Proof
  // ─────────────────────────────────
  AboutBuilder = "about_builder",
  Testimonials = "testimonials",
  FAQ = "faq",

  // ─────────────────────────────────
  // Conversion & Support
  // ─────────────────────────────────
  LoanAssistance = "loan_assistance",
  Contact = "contact",
}
