// src/templates/common/LocationUI/LocationUI_component.tsx

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import LocationMediaPanel from "./LocationMediaPanel";
import LocationCategoryAccordion from "./LocationCategoryAccordion";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface LocationUIProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta | null;

  videoId?: string;
  mapUrl?: string;

  categories?: any[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const LocationUI_component = memo(function LocationUI_component({
  id = "location",

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
         MEDIA (VIDEO / MAP)
      ───────────────────────────── */}
      {(videoId || mapUrl) && (
        <div className="fade-up">
          <LocationMediaPanel
            videoId={videoId}
            mapUrl={mapUrl}
          />
        </div>
      )}

      {/* ─────────────────────────────
         DISTANCES / CATEGORIES
      ───────────────────────────── */}
      {categories.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 fade-up">
          <LocationCategoryAccordion
            categories={categories}
          />
        </div>
      )}

      {/* ─────────────────────────────
         SINGLE, SOFT CTA
      ───────────────────────────── */}
      <div className="mt-14 text-center fade-up">
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
    </BaseSection>
  );
});

export default LocationUI_component;
