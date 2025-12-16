// src/templates/common/Testimonials_component.tsx
import { memo, useRef } from "react";
import CTAButtons from "@/components/CTAButtons";
import TestimonialCarousel from "./TestimonialCarousel";
import TestimonialSingle from "./TestimonialSingle";

const Testimonials = memo(function Testimonials({
  id = "Testimonials",
  title = "What Our Customers Say",
  subtitle = "",
  testimonials = [],
  autoScrollSpeed = 0.6,
  onCtaClick,
}) {
  const sectionRef = useRef(null);

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
        {!isSingle && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        {isSingle ? (
          <TestimonialSingle
            t={testimonials[0]}
            title={title}
            subtitle={subtitle}
            onCtaClick={onCtaClick}
          />
        ) : (
          <>
            <TestimonialCarousel
              testimonials={testimonials}
              autoScrollSpeed={autoScrollSpeed}
              onPlay={trackPlay}
            />
          </>
        )}
      </div>
      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}
    </section>
  );
});

export default Testimonials;