// src/templates/common/Testimonials_component.tsx

import { memo, useRef } from "react";

import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialSingle from "./TestimonialSingle";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface TestimonialsProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta | null;

  testimonials?: any[];
  autoScrollSpeed?: number;

  onCtaClick?: () => void;
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
  const sectionRef = useRef<HTMLDivElement | null>(null);

  if (!testimonials.length) return null;

  const isSingle = testimonials.length === 1;

  /* ---------------- Analytics ---------------- */
  const trackPlay = (name: string) => {
    window?.gtag?.("event", "testimonial_video_play", {
      section: id,
      user: name,
    });

    window?.fbq?.("trackCustom", "TestimonialVideoPlay", {
      user: name,
    });
  };

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      <div ref={sectionRef}>
        {isSingle ? (
          <TestimonialSingle
            t={testimonials[0]}
            onCtaClick={onCtaClick}
          />
        ) : (
          <TestimonialCarousel
            testimonials={testimonials}
            autoScrollSpeed={autoScrollSpeed}
            onPlay={trackPlay}
          />
        )}
      </div>
    </BaseSection>
  );
});

export default Testimonials_component;
