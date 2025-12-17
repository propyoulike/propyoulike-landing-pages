import { memo, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import ViewCarousel from "./ViewCarousel";
import ViewLightbox from "./ViewLightbox";

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
  title?: string;
  subtitle?: string;
  images?: ViewImage[];
}

const Views_component = memo(function Views({
  id = "views",
  title,
  subtitle,
  images = [],
}: ViewsProps) {
  useScrollReveal(".fade-up");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /** Only active images */
  const activeImages = images
    .filter(img => img.is_active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (!activeImages.length) return null;

  return (
    <section
      id={id}
      className="py-24 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* ✅ HEADER — WILL NOW ALWAYS RENDER */}
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Carousel */}
        <ViewCarousel
          items={activeImages}
          onTileClick={(index) => {
            setSelectedIndex(index);
            setLightboxOpen(true);
          }}
        />
      </div>

      {/* Lightbox */}
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
