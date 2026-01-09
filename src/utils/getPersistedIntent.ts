// src/components/lead/utils/getPersistedIntent.ts

import type { LeadIntent } from "../types/LeadIntent";

export function getPersistedIntent(): Partial<LeadIntent> {
  if (typeof window === "undefined") return {};

  const stage = sessionStorage.getItem("buyer_stage");

  return stage
    ? { decisionStage: stage as LeadIntent["decisionStage"] }
    : {};
}
