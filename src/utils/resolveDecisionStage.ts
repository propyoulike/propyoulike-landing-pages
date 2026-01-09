// src/utils/resolveDecisionStage.ts
export function resolveDecisionStage(
  trustReviewed: boolean,
  action?: "visit" | "pricing" | "generic"
): "research" | "shortlist" | "visit" {
  if (!trustReviewed) return "research";
  if (action === "visit") return "visit";
  return "shortlist";
}
