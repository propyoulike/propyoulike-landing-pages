import { memo } from "react";
import CTAButtons from "@/components/CTAButtons";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import LocationMediaPanel from "./LocationMediaPanel";
import LocationCategoryAccordion from "./LocationCategoryAccordion";

const LocationUI_component = memo(function LocationUI({
  title,
  subtitle,
  tagline,
  videoId,
  mapUrl,
  categories = [],
  ctaText = "Enquire Now",
  onCtaClick
}) {

  useScrollReveal(".fade-up");

  return (
    <section id="location" className="py-24 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          {tagline && <p className="text-sm italic text-muted-foreground">{tagline}</p>}
        </div>

        <LocationMediaPanel videoId={videoId} mapUrl={mapUrl} />

        <div className="max-w-4xl mx-auto mt-10 fade-up">
          <LocationCategoryAccordion categories={categories} />
        </div>
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

export default LocationUI_component;
