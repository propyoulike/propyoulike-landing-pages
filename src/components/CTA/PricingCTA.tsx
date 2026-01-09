export function PricingCTA({ openLeadForm }: { openLeadForm: (i: LeadIntent) => void }) {
  const trustReviewed = useTrustReviewed();

  return (
    <button
      onClick={() =>
        openLeadForm({
          decisionStage: resolveDecisionStage(trustReviewed, "pricing"),
          trustReviewed,
          sourceSection: "pricing",
          sourceItem: "pricing-cta",
        })
      }
    >
      Get Pricing
    </button>
  );
}
