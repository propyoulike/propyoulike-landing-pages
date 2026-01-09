// src/utils/getCallScript.ts

import type { DecisionStage } from "@/components/lead/types/LeadIntent";

export function getCallScript(stage?: DecisionStage) {
  switch (stage) {
    case "visit":
      return "User is visit-ready. Skip credibility. Confirm availability and slot.";
    case "shortlist":
      return "User is comparing. Focus on layout, price structure, timeline.";
    case "research":
    default:
      return "User is early. Lead with trust, reviews, RERA, builder track record.";
  }
}
