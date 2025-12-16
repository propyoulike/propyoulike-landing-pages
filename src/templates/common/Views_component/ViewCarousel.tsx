// src/templates/common/Views_component/ViewCarousel.tsx

import ViewTile from "./ViewTile";
import { useEmblaAutoCarousel } from "@/hooks/useEmblaAutoCarousel";
import { useSpotlight } from "@/hooks/useSpotlight";

export default function ViewCarousel({ items, onTileClick }) {
  const { emblaRef } = useEmblaAutoCarousel(0.9);
  const handleSpotlight = useSpotlight();

  return (
    <div className="overflow-hidden mb-16" ref={emblaRef}>
      <div className="flex gap-6 md:gap-8 pl-6 pr-6 md:pl-10 md:pr-10 -ml-6 -mr-6 md:-ml-10 md:-mr-10">

        {items.map((item, index) => (
          <div
            key={index}
            className="flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_40%] px-2 fade-up"
          >
            <ViewTile
              src={item.src}
              title={item.title}
              onSpotlightMove={handleSpotlight}
              onClick={() => onTileClick(index)}
            />
          </div>
        ))}

      </div>
    </div>
  );
}
