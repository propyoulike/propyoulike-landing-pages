// src/templates/common/GoogleReviews_component/GoogleReviews_component.tsx

/**
 * ============================================================
 * GoogleReviews_component
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays aggregate Google review credibility for a project
 * - Shows rating, review count, optional highlight, and CTA
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - No data fetching
 * - No JSON shape awareness
 * - Adapter / resolver owned wiring
 * - Safe for SSR / hydration
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. TRUST SIGNAL, NOT SALES COPY
 * 2. SOURCE TRANSPARENCY (Google)
 * 3. FAIL-SOFT (do not render on missing data)
 *
 * ============================================================
 */

import { memo } from "react";
import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   Props (Adapter-owned contract)
------------------------------------------------------------------------*/
interface GoogleReviewsProps {
  id?: string;

  /**
   * Canonical section meta
   * - undefined → BaseSection defaults
   * - null      → suppress header rendering
   */
  meta?: SectionMeta | null;

  /** Google rating (e.g. 4.3) */
  rating?: number;

  /** Total Google review count */
  reviewCount?: number;

  /** Optional highlighted sentiment */
  highlight?: string;

  /** Outbound CTA */
  cta?: {
    label: string;
    url: string;
  };
}

/* ---------------------------------------------------------------------
   Component
------------------------------------------------------------------------*/
const GoogleReviews_component = memo(function GoogleReviews_component({
  id = "google-reviews",
  meta,
  rating,
  reviewCount,
  highlight,
  cta,
}: GoogleReviewsProps) {
  /* ----------------------------------------------------------
     Guard: do not render incomplete trust signals
  ---------------------------------------------------------- */
  if (
    typeof rating !== "number" ||
    typeof reviewCount !== "number" ||
    !cta?.url
  ) {
    return null;
  }

  return (
    <BaseSection id={id} meta={meta} align="center" padding="sm" background="muted">
      <div className="google-reviews">
        <div className="google-reviews__card">
          {/* Rating */}
          <div className="google-reviews__score">
            ⭐ {rating.toFixed(1)} <span className="google-reviews__outof">/ 5</span>
          </div>

          {/* Count */}
          <div className="google-reviews__count">
            Based on {reviewCount} Google reviews
          </div>

          {/* Optional highlight */}
          {highlight && (
            <p className="google-reviews__highlight">
              “{highlight}”
            </p>
          )}

          {/* Source */}
          <div className="google-reviews__source">
            Source: Google Reviews
          </div>

          {/* CTA */}
          <a
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="google-reviews__cta"
          >
            {cta.label} →
          </a>
        </div>
      </div>
    </BaseSection>
  );
});

export default GoogleReviews_component;
