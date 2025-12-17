// src/components/lead/types/LeadIntent.ts
export interface LeadIntent {
  source?: string;     // faq | hero | floating | pricing | etc
  question?: string;   // FAQ question clicked
  label?: string;      // CTA label
}
