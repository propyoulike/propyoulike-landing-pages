import { memo } from "react";
import CTAButtons from "@/components/CTAButtons";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Amenities_component = memo(function Amenities({
  heroTitle,
  heroSubtitle,
  amenityImages = [],
  amenityCategories = [],
  onCtaClick,
}) {
  useScrollReveal(".fade-up");

  return (
    <section id="amenities" className="py-24 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">{heroTitle}</h2>
          <p className="text-lg text-muted-foreground">{heroSubtitle}</p>
        </div>

        {/* Carousel (images/videos) */}
        <AmenityCarousel items={amenityImages} />

        {/* Categories (text only) */}
        <AmenityCategoryList categories={amenityCategories} />

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

export default Amenities_component;
