import {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";

interface ModelFlat {
  title: string;
  id: string;
}

interface ModelVideosProps {
  modelFlats: ModelFlat[];
}

const GAP = 24;

const ModelVideos = memo(({ modelFlats }: ModelVideosProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);

  /* ------------------ Precompute thumbnails ------------------ */
  const videos = useMemo(
    () =>
      modelFlats.map((v) => ({
        ...v,
        thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
        embed: `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`,
      })),
    [modelFlats]
  );

  /* ------------------ Scroll to index ------------------ */
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(".model-card") as HTMLElement;
    const cardWidth = card?.clientWidth || 0;

    scrollRef.current.scrollTo({
      left: index * (cardWidth + GAP),
      behavior: "smooth",
    });

    setActiveIndex(index);
  }, []);

  /* ------------------ Swipe gestures for fullscreen close ------------------ */
  const handleTouchStart = (e: React.TouchEvent) =>
    setDragStart(e.touches[0].clientY);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart === null) return;
    const diff = e.touches[0].clientY - dragStart;
    setDragY(diff);
  };

  const handleTouchEnd = () => {
    if (dragY > 120) {
      setFullscreenIndex(null); // close if swiped down
    }
    setDragStart(null);
    setDragY(0);
  };

  /* ------------------ Track active index ------------------ */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const card = el.querySelector(".model-card") as HTMLElement;
      const cardWidth = card?.clientWidth || 0;

      const newIndex = Math.round(el.scrollLeft / (cardWidth + GAP));
      setActiveIndex(Math.min(newIndex, videos.length - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [videos.length]);

  /* ------------------ ESC close ------------------ */
  useEffect(() => {
    const esc = (e: KeyboardEvent) =>
      e.key === "Escape" && setFullscreenIndex(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* ------------------ 3D Tilt on Hover (desktop) ------------------ */
  const handleTilt = (e: any) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(900px)
      rotateY(${x / 30}deg)
      rotateX(${-y / 30}deg)
      scale(1.03)`;
  };

  const resetTilt = (e: any) => {
    const card = e.currentTarget;
    card.style.transform = "";
  };

  if (!videos.length) return null;

  return (
    <section className="relative py-12">
      {/* Title */}
      <h3 className="text-3xl font-bold text-center mb-2">
        Model Flat Videos
      </h3>
      <p className="text-center text-muted-foreground mb-8">
        Experience the interiors like you're already there
      </p>

      {/* NAV BUTTONS (desktop) */}
      {videos.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl items-center justify-center hover:bg-white/30 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === videos.length - 1}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl items-center justify-center hover:bg-white/30 transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* ------------------ CAROUSEL ------------------ */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 pb-4"
      >
        {videos.map((vid, i) => (
          <div
            key={i}
            className="model-card flex-shrink-0 w-[85vw] md:w-[550px] lg:w-[700px] snap-center"
          >
            <div
              onClick={() => setFullscreenIndex(i)}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className={`
                relative rounded-2xl overflow-hidden border border-white/20
                shadow-2xl bg-black/30 backdrop-blur-lg
                cursor-pointer transition-all duration-500 group
                ${
                  activeIndex === i
                    ? "scale-100 ring-2 ring-primary/80 shadow-primary/40"
                    : "scale-95 opacity-70"
                }
              `}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />

                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition"></div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg border border-white/40 shadow-xl flex items-center justify-center group-hover:scale-110 transition">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-lg font-semibold">
              {vid.title}
            </p>
          </div>
        ))}
      </div>

      {/* ------------------ DOTS ------------------ */}
      <div className="flex justify-center gap-2 mt-6">
        {videos.map((_, i) => (
          <div
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full cursor-pointer transition-all
              ${
                activeIndex === i
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted hover:bg-muted-foreground/50"
              }`}
          />
        ))}
      </div>

      {/* ------------------ FULLSCREEN MODAL (ULTRA PREMIUM) ------------------ */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setFullscreenIndex(null)}
        >
          {/* Floating close button */}
          <button
            className="
              absolute bottom-8 right-8 lg:right-12 w-16 h-16
              rounded-full bg-white/10 border border-white/20 shadow-2xl
              backdrop-blur-xl flex items-center justify-center
              hover:bg-white/20 transition z-[1000]
            "
            onClick={() => setFullscreenIndex(null)}
          >
            <X className="w-7 h-7 text-white" />
          </button>

          {/* Video */}
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateY(${dragY}px)`,
              transition: dragStart ? "none" : "transform 0.25s ease",
            }}
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={videos[fullscreenIndex].embed}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Title */}
            <p className="text-white text-center text-lg mt-4">
              {videos[fullscreenIndex].title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
});

ModelVideos.displayName = "ModelVideos";
export default ModelVideos;
