import AmenityTile from "./AmenityTile";
import { useEmblaAutoCarousel } from "@/hooks/useEmblaAutoCarousel";
import { useSpotlight } from "@/hooks/useSpotlight";

export default function AmenityCarousel({ items = [] }) {
  if (!items.length) return null;

  const { emblaRef, stop, play } = useEmblaAutoCarousel({
    delay: 4000,
  });

  const handleSpotlight = useSpotlight();

  return (
    <div
      className="overflow-hidden mb-20"
      ref={emblaRef}
      onMouseEnter={stop}
      onMouseLeave={play}
      onTouchStart={stop}
      onTouchEnd={play}
    >
      <div className="flex gap-6 md:gap-8 will-change-transform pl-6 pr-6 md:pl-10 md:pr-10 -ml-6 -mr-6 md:-ml-10 md:-mr-10">

        {items.map((amenity, index) => (
          <div
            key={index}
            className="flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-[0_0_45%] lg:flex-[0_0_32%] px-2 fade-up"
          >
            <AmenityTile
              {...amenity}
              onSpotlightMove={handleSpotlight}
            />
          </div>
        ))}

      </div>
    </div>
  );
}
