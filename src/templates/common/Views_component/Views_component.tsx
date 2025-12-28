// src/templates/common/Views_component/Views_component.tsx

/**
 * ============================================================
 * Views_component
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays perspective / surroundings imagery
 * - Supports carousel + immersive lightbox
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Pure render from props
 * - No routing or project identity logic
 * - Browser-only enhancements are optional
 * - Hydration-safe
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. PURE BY DEFAULT
 *    → Rendering must succeed without browser APIs
 *
 * 2. PROGRESSIVE ENHANCEMENT
 *    → Scroll animation must never block render
 *
 * 3. SCHEMA-ALIGNED
 *    → Input matches authoring JSON exactly
 *
 * ============================================================
 */

import { memo, useEffect, useMemo, useState } from "react";
import { scrollReveal } from "@/lib/scrollReveal";

import ViewCarousel from "./ViewCarousel";
import ViewLightbox from "./ViewLightbox";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* -----------------------------------------
   Types (JSON-aligned)
------------------------------------------ */
interface ViewImage {
  image_id: string;
  src: string;
  title?: string;
  order?: number;
  is_active?: boolean;
}

interface ViewsProps {
  id?: string;
  meta?: SectionMeta | null;
  images?: ViewImage[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
const Views_component = memo(function Views_component({
  id = "views",

  meta = {
    eyebrow: "VIEWS",
    title: "Views & surroundings",
    subtitle:
      "A glimpse of the surroundings, open spaces, and perspectives from the project",
  },

  images = [],
}: ViewsProps) {
  /* ------------------------------------------------------------
     Progressive enhancement (SAFE)
  ------------------------------------------------------------ */
  useEffect(() => {
    return scrollReveal(".fade-up");
  }, []);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ------------------------------------------------------------
     Normalize images (PURE)
  ------------------------------------------------------------ */
  const activeImages = useMemo(
    () =>
      images
        .filter((img) => img.is_active !== false)
        .sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        ),
    [images]
  );

  if (!activeImages.length) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* ─────────────────────────────
         VISUAL DISCOVERY
      ───────────────────────────── */}
      <div className="fade-up">
        <ViewCarousel
          items={activeImages}
          onTileClick={(index) => {
            setSelectedIndex(index);
            setLightboxOpen(true);
          }}
        />
      </div>

      {/* ─────────────────────────────
         IMMERSIVE LIGHTBOX
      ───────────────────────────── */}
      <ViewLightbox
        open={lightboxOpen}
        index={selectedIndex}
        images={activeImages}
        onClose={() => setLightboxOpen(false)}
      />
    </BaseSection>
  );
});

export default Views_component;
