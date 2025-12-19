// src/templates/common/Views_component/Views_component.tsx

import { memo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ViewCarousel from "./ViewCarousel";
import ViewLightbox from "./ViewLightbox";

import SectionHeader from "../SectionHeader";
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
  meta?: SectionMeta;

  /** View / perspective images */
  images?: ViewImage[];
}

const Views_component = memo(function Views({
  id = "views",

  meta = {
    title: "Views & Surroundings",
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
        <div className="fade-up">
          <ViewCarousel
            items={activeImages}
            onTileClick={(index) => {
              setSelectedIndex(index);
              setLightboxOpen(true);
            }}
          />
        </div>
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
    </section>
  );
});

export default Views_component;
