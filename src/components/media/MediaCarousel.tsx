// src/components/media/MediaCarousel.tsx
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export default function MediaCarousel({ items, children }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "center" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.6 })]
  );

  return (
    <div className="overflow-hidden mb-12" ref={emblaRef}>
      <div className="flex gap-4 md:gap-6 will-change-transform">
        {items.map((item, index) => (
          <div key={item?.id ?? `media-${index}`}>
            {children(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
