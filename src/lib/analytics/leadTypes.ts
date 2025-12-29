// src/lib/analytics/leadTypes.ts

/**
 * =====================================================
 * CANONICAL LEAD TYPES (FROZEN)
 * =====================================================
 *
 * Purpose:
 * - Business classification of qualified leads
 * - Used ONLY with EventName.LeadCreated
 *
 * Rules:
 * - LeadType ≠ CTAType
 * - Assigned after validation / qualification
 * - Do NOT rename once released
 */

export enum LeadType {
  // ─────────────────────────────────
  // High intent (sales-ready)
  // ─────────────────────────────────
  SalesEnquiry = "sales_enquiry",
  SiteVisitRequest = "site_visit_request",

  // ─────────────────────────────────
  // Medium intent (assisted)
  // ─────────────────────────────────
  CallbackRequest = "callback_request",
  LoanAssistanceRequest = "loan_assistance_request",

  // ─────────────────────────────────
  // Low intent (nurture)
  // ─────────────────────────────────
  BrochureRequest = "brochure_request",

  // ─────────────────────────────────
  // Fallback
  // ─────────────────────────────────
  GeneralEnquiry = "general_enquiry",
}
