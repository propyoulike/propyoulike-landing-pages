// src/templates/common/Testimonials_component.tsx

import { memo, useRef } from "react";
import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialSingle from "./TestimonialSingle";

const Testimonials = memo(function Testimonials({
  id = "testimonials",
  title = "What Our Customers Say",
  subtitle,
  testimonials = [],
  autoScrollSpeed = 0.6,
  onCtaClick,
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  if (!testimonials.length) return null;

  const isSingle = testimonials.length === 1;

  /* Analytics */
  const trackPlay = (name: string) => {
    window?.gtag?.("event", "testimonial_video_play", {
      section: id,
      user: name,
    });
    window?.fbq?.("trackCustom", "TestimonialVideoPlay", { user: name });
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* ✅ Always show header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {isSingle ? (
          <TestimonialSingle
            t={testimonials[0]}
            onCtaClick={onCtaClick} // optional soft CTA inside
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

export default Testimonials;
