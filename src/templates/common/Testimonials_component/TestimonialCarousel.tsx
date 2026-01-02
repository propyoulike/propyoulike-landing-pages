import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import TestimonialCard from "./TestimonialCard";
import { useEffect, useRef, useState } from "react";

interface Testimonial {
  name: string;
  videoId?: string;
  [key: string]: any;
}

export default function TestimonialCarousel({
  testimonials,
  autoScrollSpeed = 0.6,
  onPlay,
}: {
  testimonials: Testimonial[];
  autoScrollSpeed?: number;
  onPlay?: (name: string) => void;
}) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const resumeTimeout = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    isMobile
      ? []
      : [
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
    if (!auto) return;

    if (activeVideo) {
      auto.stop();
      if (resumeTimeout.current) {
        window.clearTimeout(resumeTimeout.current);
      }
    } else {
      resumeTimeout.current = window.setTimeout(() => {
        auto.play();
      }, 1500);
    }

    return () => {
      if (resumeTimeout.current) {
        window.clearTimeout(resumeTimeout.current);
      }
    };
  }, [activeVideo, emblaApi]);

  /* Pause on hover (desktop only) */
  useEffect(() => {
    if (!emblaApi || isMobile) return;
    const auto = emblaApi.plugins()?.autoScroll;
    if (!auto) return;

    const node = emblaApi.rootNode();
    const stop = () => auto.stop();
    const play = () => auto.play();

    node.addEventListener("mouseenter", stop);
    node.addEventListener("mouseleave", play);

    return () => {
      node.removeEventListener("mouseenter", stop);
      node.removeEventListener("mouseleave", play);
    };
  }, [emblaApi, isMobile]);

  return (
    <div
      ref={emblaRef}
      className="overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className="flex gap-4 md:gap-6 will-change-transform">
        {testimonials.map((t, i) => (
          <div
            key={t.videoId || t.name || i}
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
