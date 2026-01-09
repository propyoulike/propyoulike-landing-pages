// src/components/lead/types/LeadIntent.ts

export type DecisionStage =
  | "research"
  | "shortlisting"
  | "ready_to_visit";

export interface LeadIntent {
  /* attribution */
  sourceSection?: string;
  sourceItem?: string;

  /* identity */
  builderId?: string;

  /* buyer intelligence */
  decisionStage?: DecisionStage;
  trustReviewed?: boolean;

  /* UX context */
  label?: string;
  question?: string;

  /* CRM directives */
  crm?: {
    priority: "HIGH" | "MEDIUM" | "LOW";
    followup_type: "CALL_IMMEDIATE" | "WHATSAPP_FOLLOWUP";
    call_script: "VISIT_READY" | "RESEARCH_NURTURE";
  };
}
