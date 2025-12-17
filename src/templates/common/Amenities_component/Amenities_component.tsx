import { memo } from "react";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Amenities_component = memo(function Amenities({
  heroTitle,
  heroSubtitle,
  amenityImages = [],
  amenityCategories = [],
}) {
  useScrollReveal(".fade-up");

  if (!amenityImages.length && !amenityCategories.length) return null;

  return (
    <section
      id="amenities"
      className="py-24 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* Header */}
        {(heroTitle || heroSubtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            {heroTitle && (
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                {heroTitle}
              </h2>
            )}
            {heroSubtitle && (
              <p className="text-lg text-muted-foreground">
                {heroSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Visual Discovery */}
        <AmenityCarousel items={amenityImages} />

        {/* Textual Scan */}
        <AmenityCategoryList categories={amenityCategories} />

      </div>
    </section>
  );
});

export default Amenities_component;
