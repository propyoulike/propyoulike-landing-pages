import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import LocationMediaPanel from "./LocationMediaPanel";
import LocationCategoryAccordion from "./LocationCategoryAccordion";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface LocationUIProps {
  id?: string;
  meta?: SectionMeta;
  videoId?: string;
  mapUrl?: string;
  categories?: any[];
}

const LocationUI_component = memo(function LocationUI_component({
  id = "locationUI",
  meta = {
    eyebrow: "LOCATION",
    title: "Location & connectivity",
    subtitle:
      "Distances to key landmarks, offices, schools and transport",
    tagline:
      "Understand daily travel convenience before you visit",
  },
  videoId,
  mapUrl,
  categories = [],
}: LocationUIProps) {
  useScrollReveal(".fade-up");

  const { openCTA } = useLeadCTAContext();

  const hasContent =
    !!videoId || !!mapUrl || categories.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* ─────────────────────────────
         MEDIA (SPACE RESERVED)
      ───────────────────────────── */}
      {(videoId || mapUrl) && (
        <div className="fade-up contain-layout">
          <div className="min-h-[280px] md:min-h-[360px]">
            <LocationMediaPanel
              videoId={videoId}
              mapUrl={mapUrl}
            />
          </div>
        </div>
      )}

      {/* ─────────────────────────────
         DISTANCES / CATEGORIES
      ───────────────────────────── */}
      {categories.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 fade-up contain-layout">
          <LocationCategoryAccordion
            categories={categories}
          />
        </div>
      )}

      {/* ─────────────────────────────
         CTA (HEIGHT LOCKED)
      ───────────────────────────── */}
      <div className="mt-14 text-center fade-up contain-layout">
        <div className="h-[56px] flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-xl px-12"
            onClick={() =>
              openCTA({
                source: "section",
                label: "location_book_site_visit",
              })
            }
          >
            Book site visit
          </Button>
        </div>
      </div>
    </BaseSection>
  );
});

export default LocationUI_component;
