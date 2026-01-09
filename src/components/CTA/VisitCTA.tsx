// src/components/cta/VisitCTA.tsx

import { resolveDecisionStage } from "@/utils/resolveDecisionStage";
import { useTrustReviewed } from "@/hooks/useTrustReviewed";
import type { LeadIntent } from "@/components/lead/types/LeadIntent";

export function VisitCTA({ openLeadForm }: { openLeadForm: (i: LeadIntent) => void }) {
  const trustReviewed = useTrustReviewed();

  const intent: LeadIntent = {
    decisionStage: resolveDecisionStage(trustReviewed, "visit"),
    trustReviewed,
    sourceSection: "trust-and-clarity",
    sourceItem: "visit-cta",
  };

  return (
    <button onClick={() => openLeadForm(intent)}>
      Schedule Site Visit
    </button>
  );
}
