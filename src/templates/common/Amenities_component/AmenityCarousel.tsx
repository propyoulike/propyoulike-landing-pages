// src/templates/common/Amenities/AmenityCarousel.tsx

import AmenityTile from "./AmenityTile";
import { useEmblaAutoCarousel } from "@/hooks/useEmblaAutoCarousel";
import { useSpotlight } from "@/hooks/useSpotlight";

/* ------------------------------------------------------------
   Types
------------------------------------------------------------ */
interface AmenityItem {
  id?: string;
  title: string;
  icon?: string;
  image?: string;
  description?: string;
}

interface AmenityCarouselProps {
  items?: AmenityItem[];
}

/**
 * AmenityCarousel
 * ------------------------------------------------------------
 * PERFORMANCE GUARANTEES:
 * - Non-blocking (not LCP)
 * - No layout shift
 * - GPU-friendly transforms
 * - Autoplay pauses on interaction
 * - Touch + mouse safe
 */
export default function AmenityCarousel({
  items = [],
}: AmenityCarouselProps) {
  if (!items.length) return null;

  const { emblaRef, stop, play } = useEmblaAutoCarousel({
    delay: 4000,
  });

  const handleSpotlight = useSpotlight();

  return (
    <section
      className="overflow-hidden mb-20"
      ref={emblaRef}
      onMouseEnter={stop}
      onMouseLeave={play}
      onTouchStart={stop}
      onTouchEnd={play}
      aria-label="Project amenities carousel"
    >
      {/* --------------------------------------------------
         TRACK
      --------------------------------------------------- */}
      <div
        className="
          flex gap-6 md:gap-8
          pl-6 pr-6 md:pl-10 md:pr-10
          -ml-6 -mr-6 md:-ml-10 md:-mr-10
          will-change-transform
        "
      >
        {items.map((amenity, index) => (
          <div
            key={amenity.id ?? index}
            className="
              flex-[0_0_80%]
              sm:flex-[0_0_55%]
              md:flex-[0_0_45%]
              lg:flex-[0_0_32%]
              px-2
            "
          >
            <AmenityTile
              {...amenity}
              onSpotlightMove={handleSpotlight}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
