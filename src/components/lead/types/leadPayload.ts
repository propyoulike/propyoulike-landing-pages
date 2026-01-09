// src/types/leadPayload.ts
export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;

  // NEW
  trust_reviewed?: boolean;
  decision_stage?: "research" | "shortlist" | "visit";
  source_section?: string;
}
