import { memo } from "react";
import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";
import type { LeadIntent } from "@/components/lead/types/LeadIntent";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

interface TrustAndClarityProps {
  id?: string;
  meta?: SectionMeta | null;

  reputation?: {
    signals?: Array<{
      title: string;
      source: string;
      date?: string;
      url?: string;
    }>;
  };

  googleReviews?: {
    summary?: {
      rating: number;
      reviewCount: number;
      highlight?: string;
    };
    rating?: number;
    reviewCount?: number;
    highlight?: string;
    url?: string;
    cta?: {
      label: string;
      url: string;
    };
  };

  regulatory?: {
    authority: string;
    status: string;
    reraId?: string | string[];
    legalText?: string;
    documents?: Array<{
      title: string;
      url: string;
    }>;
  };

  builderStats?: Array<{
    label: string;
    value: string;
  }>;

  buyerConcerns?: {
    title: string;
    items: Array<{
      question: string;
      clarification: string;
    }>;
  };

  priceContext?: {
    title: string;
    factors: string[];
  };

  buyerReadiness?: {
    title: string;
    stages: Array<{
      label: string;
      cta: string;
      stage: "exploring" | "shortlisting" | "ready_to_visit";
    }>;
  };

  lastVerified?: string;
}

const TrustAndClarity_component = memo(function TrustAndClarity_component({
  id = "trust-and-clarity",
  meta,
  reputation,
  googleReviews,
  regulatory,
  builderStats,
  buyerConcerns,
  priceContext,
  buyerReadiness,
  lastVerified,
}: TrustAndClarityProps) {
  const { openCTA } = useLeadCTAContext();

  if (
    !reputation &&
    !buyerConcerns &&
    !priceContext &&
    !buyerReadiness &&
    !googleReviews &&
    !regulatory
  ) {
    return null;
  }

  /* -------------------------------------------------
     CTA Intent Builder
  -------------------------------------------------- */
  const buildIntent = (
    stage: "exploring" | "shortlisting" | "ready_to_visit",
    label: string,
    cta: string
  ): LeadIntent & { ctaLabel: string } => ({
    decisionStage: stage,
    sourceSection: "trust_and_clarity",
    sourceItem: "decision_journey",
    question:
      stage === "ready_to_visit"
        ? "I want to schedule a site visit"
        : stage === "shortlisting"
        ? "I want to check availability and pricing"
        : "I am exploring options",
    ctaLabel: cta,
  });

  /* -------------------------------------------------
     Normalize Google Reviews
  -------------------------------------------------- */
  const reviewRating =
    googleReviews?.summary?.rating ?? googleReviews?.rating;

  const reviewCount =
    googleReviews?.summary?.reviewCount ??
    googleReviews?.reviewCount;

  const reviewHighlight =
    googleReviews?.summary?.highlight ??
    googleReviews?.highlight;

  /* -------------------------------------------------
     Normalize RERA IDs (ARRAY SAFE)
  -------------------------------------------------- */
  const reraIds: string[] = regulatory?.reraId
    ? Array.isArray(regulatory.reraId)
      ? regulatory.reraId
      : [regulatory.reraId]
    : [];

  /* -------------------------------------------------
     Documents & Complaints
  -------------------------------------------------- */
  const reraComplaintsLink =
    regulatory?.documents?.find((d) =>
      d.title.toLowerCase().includes("complaint")
    );

  const otherDocuments =
    regulatory?.documents?.filter(
      (d) => d !== reraComplaintsLink
    ) ?? [];

  return (
    <BaseSection id={id} meta={meta} align="center" padding="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

        {/* ================= TRUST & REPUTATION ================= */}
        <div className="rounded-2xl border bg-background p-8">
          <h3 className="text-xl font-semibold mb-6">
            Trust & Reputation
          </h3>

          {/* MEDIA / NEWS */}
          {reputation?.signals?.map((item, i) => (
            <p key={i} className="text-muted-foreground mb-3">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-foreground"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}{" "}
              — <strong>{item.source}</strong>
            </p>
          ))}

          {/* GOOGLE REVIEWS */}
          {reviewRating && reviewCount && (
            <>
              <hr className="my-6" />
              <p className="font-medium">
                ⭐ {reviewRating} / 5 · {reviewCount} reviews
              </p>
              {reviewHighlight && (
                <p className="text-sm text-muted-foreground mt-1">
                  {reviewHighlight}
                </p>
              )}
              {(googleReviews?.cta || googleReviews?.url) && (
                <a
                  href={
                    googleReviews.cta?.url ||
                    googleReviews.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium mt-2 inline-block"
                >
                  {googleReviews.cta?.label ||
                    "Read all reviews on Google"} →
                </a>
              )}
            </>
          )}

          {/* REGULATORY */}
          {regulatory && (
            <>
              <hr className="my-6" />
              <p className="font-medium">
                {regulatory.authority} · {regulatory.status}
              </p>

              {reraIds.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {reraIds.map((id, i) => (
                    <li key={i}>RERA ID: {id}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* LEGAL TEXT */}
          {regulatory?.legalText && (
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              {regulatory.legalText}
            </p>
          )}

          {/* DOCUMENTS */}
          {otherDocuments.length > 0 && (
            <>
              <hr className="my-6" />
              <p className="font-medium text-sm mb-2">
                Official documents
              </p>
              <ul className="space-y-2 text-sm">
                {otherDocuments.map((doc, i) => (
                  <li key={i}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {doc.title} →
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* RERA COMPLAINTS */}
          {reraComplaintsLink && (
            <>
              <hr className="my-6" />
              <p className="font-medium text-sm">
                Regulatory transparency
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                RERA portals list all complaints filed by buyers.
                These may include resolved or procedural cases and
                do not imply wrongdoing unless a final order is passed.
              </p>
              <a
                href={reraComplaintsLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium text-sm mt-3 inline-block"
              >
                View complaints on RERA website →
              </a>
            </>
          )}

          {/* BUILDER STATS */}
          {builderStats?.length > 0 && (
            <>
              <hr className="my-6" />
              <div className="grid grid-cols-2 gap-4">
                {builderStats.map((s, i) => (
                  <div key={i}>
                    <p className="font-semibold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {lastVerified && (
            <p className="text-xs text-muted-foreground mt-6">
              Last verified: {lastVerified}
            </p>
          )}
        </div>

        {/* BUYER CONCERNS */}
        {buyerConcerns && (
          <div className="rounded-2xl border bg-background p-8">
            <h3 className="text-xl font-semibold mb-6">
              {buyerConcerns.title}
            </h3>
            {buyerConcerns.items.map((item, i) => (
              <div key={i} className="mb-4">
                <p className="font-medium">{item.question}</p>
                <p className="text-muted-foreground">
                  {item.clarification}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PRICE CONTEXT */}
        {priceContext && (
          <div className="rounded-2xl border bg-background p-8">
            <h3 className="text-xl font-semibold mb-6">
              {priceContext.title}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {priceContext.factors.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* BUYER READINESS */}
        {buyerReadiness && (
          <div className="rounded-2xl border bg-background p-8">
            <h3 className="text-xl font-semibold mb-6">
              {buyerReadiness.title}
            </h3>

            <div className="space-y-4">
              {buyerReadiness.stages.map((stage, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    openCTA(
                      buildIntent(
                        stage.stage,
                        stage.label,
                        stage.cta
                      )
                    )
                  }
                  className="w-full flex items-center justify-between rounded-xl border px-4 py-4 hover:bg-muted transition"
                >
                  <span>{stage.label}</span>
                  <span className="text-primary font-medium">
                    {stage.cta}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseSection>
  );
});

export default TrustAndClarity_component;
