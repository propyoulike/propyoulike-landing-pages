// src/templates/common/ConstructionStatus.tsx
import { memo, useEffect, useState, useRef, useCallback } from "react";
import { Building2, X, Play } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import YouTubePlayer from "@/components/video/YouTubePlayer"; // ← GLOBAL VIDEO PLAYER

export interface ConstructionTower {
  name: string;
  image?: string;          // normal photo
  videoId?: string;        // YouTube ID
  status?: string[];
  achieved?: string[];
  upcoming?: string[];
}

export interface ConstructionStatusProps {
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
  const hasUpdates = Array.isArray(updates) && updates.length > 0;

  /* -----------------------------------------------
     Embla carousel
  ------------------------------------------------ */
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    hasUpdates
      ? [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.45 })]
      : []
  );

  /* -----------------------------------------------
     Section view tracking
  ------------------------------------------------ */
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTrackedView.current) return;
        hasTrackedView.current = true;

        window?.dataLayer?.push({ event: "section_view", section: id });
        window?.fbq?.("trackCustom", "ConstructionStatusViewed");
      },
      { threshold: 0.3 }
    );

    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [id]);

  /* -----------------------------------------------
     Modal viewer logic (image or video)
  ------------------------------------------------ */
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeTower = activeIndex !== null ? updates[activeIndex] : null;

  const openMedia = useCallback((i: number, tower: ConstructionTower) => {
    setActiveIndex(i);

    window?.dataLayer?.push({
      event: "tower_media_open",
      tower: tower.name
    });

    window?.fbq?.("trackCustom", "TowerMediaOpened", { tower: tower.name });
  }, []);

  const closeMedia = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex === null) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && closeMedia();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [activeIndex, closeMedia]);

  /* -----------------------------------------------
     Main Render
  ------------------------------------------------ */
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

        {/* NO UPDATES */}
        {!hasUpdates && (
          <div className="text-center text-muted-foreground opacity-60">
            No construction updates available.
          </div>
        )}

        {/* CAROUSEL */}
        {hasUpdates && (
          <div className="overflow-hidden mb-12" ref={emblaRef}>
            <div className="flex gap-4 md:gap-6 will-change-transform">
              {updates.map((tower, i) => {
                const isVideo = !!tower.videoId;

                return (
                  <div
                    key={`${i}-${tower.name}`}
                    className="flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_70%] lg:flex-[0_0_60%]"
                  >
                    <button
                      type="button"
                      onClick={() => openMedia(i, tower)}
                      className="w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
                    >
                      {/* Media thumbnail */}
                      <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                        {/* IMAGE THUMBNAIL */}
                        {!isVideo && (
                          <img
                            src={tower.image}
                            alt={tower.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
                          />
                        )}

                        {/* VIDEO THUMBNAIL */}
                        {isVideo && (
                          <img
                            src={`https://img.youtube.com/vi/${tower.videoId}/hqdefault.jpg`}
                            alt={tower.name}
                            className="w-full h-full object-cover group-hover:brightness-110 transition"
                          />
                        )}

                        {/* Video play button overlay */}
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary shadow-2xl flex items-center justify-center opacity-90 group-hover:scale-110 transition">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        )}

                        {/* Name Overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-white/90" />
                            <span className="text-white font-semibold text-sm">
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
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>

        {/* MEDIA MODAL (IMAGE OR VIDEO) */}
        {activeTower && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={closeMedia}
          >
            <div
              className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-base text-foreground">
                    {activeTower.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeMedia}
                  className="p-2 rounded-full hover:bg-muted transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Media Body */}
              <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                {/* VIDEO MODE */}
                {activeTower.videoId && (
                  <div className="w-full h-full max-h-[70vh]">
                    <YouTubePlayer
                      videoId={activeTower.videoId}
                      mode="click" // match platform
                      autoPlay
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* IMAGE MODE */}
                {!activeTower.videoId && (
                  <img
                    src={activeTower.image}
                    alt={activeTower.name}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                )}
              </div>

              <div className="px-4 py-3 border-t border-border flex justify-end">
                <button
                  onClick={closeMedia}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90"
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
