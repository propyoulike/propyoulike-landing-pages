// src/templates/common/Amenities_component/Amenities_component.tsx

import { memo } from "react";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES (MATCH project.schema EXACTLY)
------------------------------------------------------------------------*/
interface AmenityImage {
  src: string;
  title?: string;
  description?: string;
  media_type?: "image" | "video";
}

interface AmenityCategory {
  title: string;
  items: string[];
}

interface AmenitiesProps {
  id?: string;
  meta?: SectionMeta;
  amenityImages?: AmenityImage[];
  amenityCategories?: AmenityCategory[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const AmenitiesComponent = memo(function AmenitiesComponent({
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
  /* ------------------------------------------------------------
     Progressive enhancement
     ------------------------------------------------------------
     - Hook called unconditionally
     - Hook internally guards SSR
  ------------------------------------------------------------ */
  useScrollReveal(".fade-up");

  const hasContent =
    amenityImages.length > 0 ||
    amenityCategories.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* VISUAL AMENITIES */}
      {amenityImages.length > 0 && (
        <div className="fade-up">
          <AmenityCarousel items={amenityImages} />
        </div>
      )}

      {/* CATEGORY LIST */}
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

export default AmenitiesComponent;
