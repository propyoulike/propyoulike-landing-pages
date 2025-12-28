// src/templates/common/Testimonials_component.tsx

/**
 * ============================================================
 * Testimonials_component
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays customer / buyer testimonials
 * - Supports single testimonial or carousel mode
 * - Reinforces trust without aggressive persuasion
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - No effects or lifecycle dependencies
 * - Analytics are optional, browser-only
 * - Safe for SSR / hydration
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. TRUST OVER PROMOTION
 *    → Testimonials inform, not push decisions
 *
 * 2. MEDIA-LED CREDIBILITY
 *    → Video or voice carries more weight than copy
 *
 * 3. OPTIONAL ANALYTICS
 *    → Rendering must succeed without analytics globals
 *
 * ============================================================
 */

import { memo } from "react";

import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialSingle from "./TestimonialSingle";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES (SCHEMA-ALIGNED)
------------------------------------------------------------------------*/
interface TestimonialsProps {
  id?: string;

  /**
   * Canonical section meta
   * - undefined → use defaults
   * - null      → suppress header rendering
   */
  meta?: SectionMeta | null;

  testimonials?: any[];

  /** Carousel auto-scroll speed (only when multiple items) */
  autoScrollSpeed?: number;

  /** Optional downstream CTA */
  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   BROWSER-SAFE ANALYTICS
------------------------------------------------------------------------*/
function trackTestimonialPlay(
  sectionId: string,
  name: string
) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "testimonial_video_play", {
    section: sectionId,
    user: name,
  });

  window.fbq?.("trackCustom", "TestimonialVideoPlay", {
    user: name,
  });
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Testimonials_component = memo(function Testimonials_component({
  id = "testimonials",

  meta = {
    eyebrow: "TRUST",
    title: "What homeowners are saying",
    subtitle:
      "Real experiences from people who explored or bought here",
    tagline:
      "Unfiltered feedback to help you decide with confidence",
  },

  testimonials = [],
  autoScrollSpeed = 0.6,
  onCtaClick,
}: TestimonialsProps) {
  if (!testimonials.length) return null;

  const isSingle = testimonials.length === 1;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {isSingle ? (
        <TestimonialSingle
          t={testimonials[0]}
          onCtaClick={onCtaClick}
        />
      ) : (
        <TestimonialCarousel
          testimonials={testimonials}
          autoScrollSpeed={autoScrollSpeed}
          onPlay={(name) =>
            trackTestimonialPlay(id, name)
          }
        />
      )}
    </BaseSection>
  );
});

export default Testimonials_component;
