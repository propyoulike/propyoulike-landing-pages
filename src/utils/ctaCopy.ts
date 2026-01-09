// src/components/lead/utils/ctaCopy.ts

import type { BuyerStage } from "../types/LeadIntent";

export function getCtaLabel(stage?: BuyerStage) {
  switch (stage) {
    case "ready_to_visit":
      return "Schedule site visit";
    case "shortlisting":
      return "Check availability";
    default:
      return "Get project details";
  }
}
