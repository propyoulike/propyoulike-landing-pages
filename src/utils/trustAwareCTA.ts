// src/utils/trustAwareCTA.ts
export function getTrustAwareCTA(
  baseLabel: string,
  trustReviewed: boolean
) {
  if (!trustReviewed) return baseLabel;

  switch (baseLabel) {
    case "Schedule site visit":
      return "Schedule site visit (details verified)";

    case "Check availability":
      return "Check verified availability";

    case "Get pricing":
      return "View verified pricing";

    default:
      return baseLabel;
  }
}
