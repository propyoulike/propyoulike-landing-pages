// src/templates/common/Views.tsx
import { memo, useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import CTAButtons from "@/components/CTAButtons";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ViewImage {
  src: string;
  title?: string;
}

interface ViewsProps {
  id?: string;
  title?: string;
  subtitle?: string;
  images: ViewImage[];
  onCtaClick: () => void;
}

const Views = memo(function Views({
  id = "views",
  title = "Mesmerizing Views",
  subtitle = "",
  images = [],
  onCtaClick,
}: ViewsProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.9 })]
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* -------------------------------
      Fade-up entry effect
  ------------------------------- */
  useEffect(() => {
    const targets = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("show"));
      },
      { threshold: 0.2 }
    );

    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  /* -------------------------------
      Spotlight hover effect
  ------------------------------- */
  const handleSpotlight = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  /* -------------------------------
      Track Section View
  ------------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasTrackedView.current && entries[0].isIntersecting) {
          hasTrackedView.current = true;

          if ((window as any).gtag)
            (window as any).gtag("event", "section_view", {
              event_category: "engagement",
              event_label: "Views Section",
            });

          if ((window as any).fbq)
            (window as any).fbq("trackCustom", "ViewsSectionViewed");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------
      Image click → open Lightbox
  ------------------------------- */
  const openLightbox = (index: number, title?: string) => {
    if ((window as any).gtag)
      (window as any).gtag("event", "image_click", {
        event_category: "engagement",
        event_label: title || "Gallery Image",
      });

    if ((window as any).fbq)
      (window as any).fbq("trackCustom", "ImageClicked", { image: title });

    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  /* -------------------------------
      CTA Tracking
  ------------------------------- */
  const handleCtaClick = () => {
    if ((window as any).gtag)
      (window as any).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "Views Section CTA",
      });

    if ((window as any).fbq)
      (window as any).fbq("trackCustom", "ViewsCTAClicked");

    onCtaClick();
  };

  return (
    <section id={id} ref={sectionRef} className="py-24 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden mb-16" ref={emblaRef}>
          <div
            className="
              flex gap-6 md:gap-8 will-change-transform
              pl-6 pr-6 md:pl-10 md:pr-10
              -ml-6 -mr-6 md:-ml-10 md:-mr-10
            "
          >
            {images.map((view, index) => (
              <div
                key={index}
                className="
                  flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_40%]
                  px-2 fade-up
                "
              >
                <div
                  className="
                    relative rounded-3xl overflow-hidden 
                    tilt-card view-spotlight 
                    hover:-translate-y-2 hover:shadow-2xl
                    transition-all duration-700 cursor-pointer
                  "
                  onMouseMove={handleSpotlight}
                  onClick={() => openLightbox(index, view.title)}
                  style={{ boxShadow: "var(--shadow-strong)" }}
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={view.src}
                      alt={view.title || "Project View"}
                      className="
                        w-full h-full object-cover 
                        transition-transform duration-700 
                        hover:scale-110
                      "
                    />
                  </div>

                  {/* Cinematic Overlay */}
                  {view.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                      <p className="text-white font-semibold text-lg drop-shadow-xl">
                        {view.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center fade-up">
          <CTAButtons onFormOpen={handleCtaClick} variant="compact" />
        </div>
      </div>

      {/* LIGHTBOX VIEWER */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={images.map((i) => ({ src: i.src, title: i.title }))}
        plugins={[Captions, Thumbnails]}
        captions={{ showToggle: true }}
      />
    </section>
  );
});

export default Views;
