// src/templates/common/ConstructionStatus.tsx
import { memo, useEffect, useState, useRef } from "react";
import { Building2, X } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

interface ConstructionTower {
  name: string;
  image: string;
  status?: string[];
  achieved?: string[];
  upcoming?: string[];
}

interface ConstructionStatusProps {
  id?: string;
  title?: string;
  subtitle?: string;
  updates?: ConstructionTower[];
  onCtaClick: () => void;
}

const ConstructionStatus = memo(function ConstructionStatus({
  id = "construction",
  title = "Construction Progress",
  subtitle = "Stay updated with the work happening on-site.",
  updates = [],
  onCtaClick,
}: ConstructionStatusProps) {
  if (!Array.isArray(updates) || updates.length === 0) return null;

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.4 })]
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* Track Section View (unchanged) */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasTrackedView.current && entries[0].isIntersecting) {
          hasTrackedView.current = true;
          window?.dataLayer?.push({
            event: "section_view",
            section: id,
          });
          window?.fbq?.("trackCustom", "ConstructionStatusViewed");
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [id]);

  /* Close on ESC when modal open */
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  const openImage = (i: number, tower: ConstructionTower) => {
    setActiveIndex(i);

    window?.dataLayer?.push({
      event: "tower_image_open",
      tower: tower.name,
    });

    window?.fbq?.("trackCustom", "TowerImageOpened", { tower: tower.name });
  };

  const closeImage = () => {
    setActiveIndex(null);
  };

  const activeTower =
    activeIndex !== null && updates[activeIndex]
      ? updates[activeIndex]
      : null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background scroll-mt-32"
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* CAROUSEL */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6 will-change-transform">
            {updates.map((tower, i) => (
              <div
                key={i}
                className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%] transform-gpu"
              >
                <button
                  type="button"
                  onClick={() => openImage(i, tower)}
                  className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={tower.image}
                      alt={tower.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />

                    {/* Name overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white/90" />
                        <span className="text-white font-semibold text-sm md:text-base">
                          {tower.name}
                        </span>
                      </div>
                      <span className="text-xs text-white/80 hidden sm:inline">
                        Tap to view
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>

        {/* IMAGE MODAL */}
        {activeTower && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <div
              className="bg-background rounded-xl md:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm md:text-base text-foreground">
                    {activeTower.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeImage}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image */}
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeTower.image}
                  alt={activeTower.name}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={closeImage}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default ConstructionStatus;
