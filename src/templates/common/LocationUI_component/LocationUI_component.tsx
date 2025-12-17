import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
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
}) {
  useScrollReveal(".fade-up");
  const { openCTA } = useLeadCTAContext();

  return (
    <section id="location" className="py-24 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 fade-up">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground mt-2">
              {subtitle}
            </p>
          )}

          {tagline && (
            <p className="text-sm italic text-muted-foreground mt-1">
              {tagline}
            </p>
          )}
        </div>

        {/* Media */}
        <LocationMediaPanel videoId={videoId} mapUrl={mapUrl} />

        {/* Distances */}
        <div className="max-w-4xl mx-auto mt-12 fade-up">
          <LocationCategoryAccordion categories={categories} />
        </div>

        {/* ✅ SINGLE, SOFT CTA */}
<div className="mt-14 text-center fade-up">
  <Button
    size="lg"
    className="rounded-xl px-12"
    onClick={() =>
      openCTA({
        source: "section",
        label: "Location – Book Site Visit",
      })
    }
  >
    Book Site Visit
  </Button>
</div>

      </div>
    </section>
  );
});

export default LocationUI_component;
