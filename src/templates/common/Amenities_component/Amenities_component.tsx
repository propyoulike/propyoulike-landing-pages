// src/templates/common/Amenities_component/Amenities_component.tsx

import { memo } from "react";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface AmenitiesProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta | null;

  /** Visual amenity gallery */
  amenityImages?: any[];

  /** Categorised amenity list */
  amenityCategories?: any[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Amenities_component = memo(function Amenities_component({
  id = "amenities",

  meta = {
    eyebrow: "AMENITIES",
    title: "Amenities for Everyday Living",
    subtitle:
      "Thoughtfully curated spaces that support leisure, wellness, and community life",
  },

  amenityImages = [],
  amenityCategories = [],
}: AmenitiesProps) {
  useScrollReveal(".fade-up");

  const hasContent =
    amenityImages.length > 0 || amenityCategories.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* ─────────────────────────────
         VISUAL DISCOVERY (PRIMARY)
      ───────────────────────────── */}
      {amenityImages.length > 0 && (
        <div className="fade-up">
          <AmenityCarousel items={amenityImages} />
        </div>
      )}

      {/* ─────────────────────────────
         TEXTUAL SCAN (SECONDARY)
      ───────────────────────────── */}
      {amenityCategories.length > 0 && (
        <div className="mt-10 fade-up">
          <AmenityCategoryList
            categories={amenityCategories}
          />
        </div>
      )}
    </BaseSection>
  );
});

export default Amenities_component;
