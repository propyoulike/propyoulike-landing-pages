// src/templates/common/Testimonials_component.tsx

import { memo, useRef } from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialSingle from "./TestimonialSingle";

import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface Props {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

  testimonials?: any[];
  autoScrollSpeed?: number;

  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Testimonials_component = memo(function Testimonials({
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
}: Props) {
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
    <section
      id={id}
      ref={sectionRef}
      className="py-12 md:py-16 scroll-mt-32 bg-background"
    >
      <div className="container max-w-6xl">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        <div className="mb-12">
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
            align="center"
          />
        </div>

        {/* ─────────────────────────────
           CONTENT
        ───────────────────────────── */}
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
    </section>
  );
});

export default Testimonials_component;
