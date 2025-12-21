// src/templates/common/Views_component/Views_component.tsx

import { memo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ViewCarousel from "./ViewCarousel";
import ViewLightbox from "./ViewLightbox";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* -----------------------------------------
   Types match JSON exactly
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

  /** Canonical section meta */
  meta?: SectionMeta | null;

  /** View / perspective images */
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
  useScrollReveal(".fade-up");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /** Only active images, ordered */
  const activeImages = images
    .filter((img) => img.is_active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!activeImages.length) return null;

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
         LIGHTBOX (IMMERSIVE, SECONDARY)
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
