// src/templates/common/Amenities_component/Amenities_component.tsx

import { memo } from "react";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface AmenitiesProps {
  id?: string;

  /** Canonical section meta (REQUIRED when visible) */
  meta?: SectionMeta;

  /** Visual amenity gallery */
  amenityImages?: any[];

  /** Categorised amenity list */
  amenityCategories?: any[];
}

const Amenities_component = memo(function Amenities({
  id = "amenities",

  meta = {
    title: "Amenities for Everyday Living",
    subtitle:
      "Thoughtfully curated spaces that support leisure, wellness, and community life",
  },

  amenityImages = [],
  amenityCategories = [],
}: AmenitiesProps) {
  useScrollReveal(".fade-up");

  if (!amenityImages.length && !amenityCategories.length) return null;

  return (
    <section
      id={id}
      className="py-12 md:py-16 scroll-mt-32 bg-background"
    >
      <div className="container">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        {meta?.title && (
          <div className="mb-12 fade-up">
            <SectionHeader
              eyebrow={meta.eyebrow}
              title={meta.title}
              subtitle={meta.subtitle}
              tagline={meta.tagline}
              align="center"
            />
          </div>
        )}

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
      </div>
    </section>
  );
});

export default Amenities_component;
