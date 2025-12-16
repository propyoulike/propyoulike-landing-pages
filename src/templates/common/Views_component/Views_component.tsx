// src/templates/common/Views_component/Views_component.tsx

import { memo, useState } from "react";
import CTAButtons from "@/components/CTAButtons";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ViewCarousel from "./ViewCarousel";
import ViewLightbox from "./ViewLightbox";

const Views_component = memo(function Views({
  id = "views",
  title,
  subtitle,
  images = [],
  onCtaClick,
}) {
  useScrollReveal(".fade-up");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  const openLightbox = (i: number) => {
    setSelected(i);
    setLightboxOpen(true);
  };

  return (
    <section id={id} className="py-24 scroll-mt-32 bg-background">

      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Carousel Organism */}
        <ViewCarousel items={images} onTileClick={openLightbox} />

      </div>

      {/* Lightbox */}
      <ViewLightbox
        open={lightboxOpen}
        index={selected}
        images={images}
        onClose={() => setLightboxOpen(false)}
      />
      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}
    </section>
  );
});

export default Views_component;
