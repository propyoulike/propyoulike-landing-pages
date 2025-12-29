import { memo, useEffect, useRef } from "react";
import AmenityCarousel from "./AmenityCarousel";
import AmenityCategoryList from "./AmenityCategoryList";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ✅ Analytics */
import { track } from "@/lib/tracking/track";
import { EventName } from "@/lib/analytics/events";
import { SectionId } from "@/lib/analytics/sectionIds";

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
  id?: SectionId;
  meta?: SectionMeta;

  /** Analytics identifiers (flat, explicit) */
  builder_id?: string;
  project_id?: string;

  amenityImages?: AmenityImage[];
  amenityCategories?: AmenityCategory[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
/**
 * ⚠️ CONTRACT
 * ------------------------------------------------------------
 * - This section must NOT receive ProjectContext
 * - Only flat props are allowed
 * - Analytics identifiers are injected by ProjectRenderer
 */
const AmenitiesComponent = memo(function AmenitiesComponent({
  id = SectionId.Amenities,

  meta = {
    eyebrow: "AMENITIES",
    title: "Amenities for Everyday Living",
    subtitle:
      "Thoughtfully curated spaces that support leisure, wellness, and community life",
  },

  builder_id,
  project_id,

  amenityImages = [],
  amenityCategories = [],
}: AmenitiesProps) {
  /* ------------------------------------------------------------
     Progressive enhancement
  ------------------------------------------------------------ */
  useScrollReveal(".fade-up");

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const viewedOnce = useRef(false);

  const hasContent =
    amenityImages.length > 0 ||
    amenityCategories.length > 0;

  /* ------------------------------------------------------------
     VIEW TRACKING (CANONICAL, FAIL-SAFE)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!hasContent) return;
    if (!builder_id || !project_id) return;
    if (!sectionRef.current) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewedOnce.current) return;

        viewedOnce.current = true;

        track(EventName.SectionView, {
          section_id: SectionId.Amenities,
          builder_id,
          project_id,
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasContent, builder_id, project_id]);

  if (!hasContent) return null;

  /* ------------------------------------------------------------
     Render
  ------------------------------------------------------------ */
  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      <div ref={sectionRef}>
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
      </div>
    </BaseSection>
  );
});

export default AmenitiesComponent;
