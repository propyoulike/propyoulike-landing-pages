import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import TestimonialCard from "./TestimonialCard";
import { useEffect, useState } from "react";

export default function TestimonialCarousel({
  testimonials,
  autoScrollSpeed = 0.6,
  onPlay,
}: {
  testimonials: any[];
  autoScrollSpeed?: number;
  onPlay?: (name: string) => void;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [
      AutoScroll({
        playOnInit: true,
        speed: autoScrollSpeed,
        stopOnInteraction: true,
      }),
    ]
  );

  /* Pause autoplay when video is active */
  useEffect(() => {
    if (!emblaApi) return;
    const auto = emblaApi.plugins()?.autoScroll;
    activeVideo ? auto?.stop() : auto?.play();
  }, [activeVideo, emblaApi]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 md:gap-6 will-change-transform">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_55%] lg:flex-[0_0_45%]"
          >
            <TestimonialCard
              t={t}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              onPlay={() => onPlay?.(t.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
