import { useState, useRef, useEffect, memo } from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";

interface ModelFlat {
  title: string;
  id: string; // YouTube video ID only
}

interface ModelVideosProps {
  modelFlats: ModelFlat[];
}

const ModelVideos = memo(({ modelFlats }: ModelVideosProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  /* ---------- YouTube helpers using ID directly ---------- */
  const getThumbnail = (id: string) =>
    `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  const getEmbedUrl = (id: string) =>
    `https://www.youtube.com/embed/${id}`;

  /* ---------- Navigation ---------- */
  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('.model-card')?.clientWidth || 0;
    const gap = 24;
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < modelFlats.length - 1) scrollToIndex(activeIndex + 1);
  };

  /* ---------- Scroll tracking ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cardWidth = el.querySelector('.model-card')?.clientWidth || 0;
      const gap = 24;
      const index = Math.round(el.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, modelFlats.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [modelFlats.length]);

  /* ---------- ESC close ---------- */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenIndex(null);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  if (!modelFlats || modelFlats.length === 0) return null;

  return (
    <div className="relative py-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Model Flat Videos
        </h3>
        <p className="text-muted-foreground">
          Take a virtual tour of our beautifully designed model flats
        </p>
      </div>

      {/* Navigation Buttons */}
      {modelFlats.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === modelFlats.length - 1}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-background/90 border border-border shadow-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-accent transition-colors"
            aria-label="Next video"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
          </button>
        </>
      )}

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 lg:px-12 pb-4"
      >
        {modelFlats.map((video, i) => (
          <div
            key={i}
            className="model-card flex-shrink-0 w-[85vw] md:w-[600px] lg:w-[720px] snap-center"
          >
            <div
              className={`
                relative rounded-2xl overflow-hidden shadow-xl bg-card border border-border
                transition-all duration-500 cursor-pointer group
                ${activeIndex === i ? "ring-2 ring-primary scale-100" : "scale-95 opacity-70"}
              `}
              onClick={() => setFullscreenIndex(i)}
            >
              {/* Thumbnail with Play Button */}
              <div className="aspect-video relative">
                <img
                  src={getThumbnail(video.id)}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-base lg:text-lg mt-4 font-semibold text-foreground">
              {video.title}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {modelFlats.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {modelFlats.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${activeIndex === i ? "w-8 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50"}
              `}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            className="absolute top-4 right-4 lg:top-6 lg:right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-50"
            onClick={() => setFullscreenIndex(null)}
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src={getEmbedUrl(modelFlats[fullscreenIndex].id) + "?autoplay=1&rel=0"}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-center text-white text-lg mt-4 font-medium">
              {modelFlats[fullscreenIndex].title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

ModelVideos.displayName = "ModelVideos";

export default ModelVideos;
