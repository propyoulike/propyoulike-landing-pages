import {
  useState,
  useRef,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import YouTubePlayer from "@/components/video/YouTubePlayer";

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

  /* ------------------ Precompute thumbnails ------------------ */
  const videos = useMemo(
    () =>
      modelFlats.map((v) => ({
        ...v,
        thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
      })),
    [modelFlats]
  );

  if (!videos.length) return null;

  /* ------------------ Scroll to index ------------------ */
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;

    const card = scrollRef.current.querySelector(
      ".model-card"
    ) as HTMLElement;
    if (!card) return;

    const cardWidth = card.clientWidth;

    scrollRef.current.scrollTo({
      left: index * (cardWidth + GAP),
      behavior: "smooth",
    });

    setActiveIndex(index);
  }, []);

  /* ------------------ Track active index (optimized) ------------------ */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastIndex = activeIndex;

    const onScroll = () => {
      const card = el.querySelector(".model-card") as HTMLElement;
      if (!card) return;

      const cardWidth = card.clientWidth;
      const newIndex = Math.round(el.scrollLeft / (cardWidth + GAP));
      const clamped = Math.min(newIndex, videos.length - 1);

      if (clamped !== lastIndex) {
        lastIndex = clamped;
        setActiveIndex(clamped);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [videos.length]);

  /* ------------------ ESC close ------------------ */
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenIndex(null);
    };

    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [fullscreenIndex]);

  /* ------------------ Focus lock (accessibility) ------------------ */
  useEffect(() => {
    if (fullscreenIndex === null) return;

    const prev = document.activeElement as HTMLElement | null;
    const modal = document.querySelector(
      "[data-model-video-modal]"
    ) as HTMLElement | null;

    modal?.focus();

    return () => {
      prev?.focus();
    };
  }, [fullscreenIndex]);

  /* ------------------ Tilt (desktop, active card only) ------------------ */
  const handleTilt = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `
      perspective(900px)
      rotateY(${x / 30}deg)
      rotateX(${-y / 30}deg)
      scale(1.03)
    `;
  };

  const resetTilt = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = "";
  };

  /* ------------------ Modal swipe state (scoped) ------------------ */
  const dragRef = useRef<{ start: number | null; y: number }>({
    start: null,
    y: 0,
  });

  const [, force] = useState(0); // local repaint trigger

  const onTouchStart = (e: React.TouchEvent) => {
    dragRef.current.start = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dragRef.current.start === null) return;
    dragRef.current.y = e.touches[0].clientY - dragRef.current.start;
    force((n) => n + 1);
  };

  const onTouchEnd = () => {
    if (dragRef.current.y > 120) {
      setFullscreenIndex(null);
    }
    dragRef.current.start = null;
    dragRef.current.y = 0;
    force((n) => n + 1);
  };

  /* ------------------ RENDER ------------------ */
  return (
    <section className="relative py-12">
      {/* Header */}
      <h3 className="text-3xl font-bold text-center mb-2">
        Model Flat Videos
      </h3>
      <p className="text-center text-muted-foreground mb-8">
        Experience the interiors like you're already there
      </p>

      {/* NAV BUTTONS */}
      {videos.length > 1 && (
        <>
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30
              shadow-xl items-center justify-center hover:bg-white/30 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === videos.length - 1}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30
              shadow-xl items-center justify-center hover:bg-white/30 transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* CAROUSEL */}
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
              onMouseMove={activeIndex === i ? handleTilt : undefined}
              onMouseLeave={activeIndex === i ? resetTilt : undefined}
              className={`
                relative rounded-2xl overflow-hidden
                border border-white/20 shadow-2xl
                bg-black/30 backdrop-blur-lg cursor-pointer
                transition-all duration-500 group
                ${
                  activeIndex === i
                    ? "scale-100 ring-2 ring-primary/80 shadow-primary/40"
                    : "scale-95 opacity-70"
                }
              `}
            >
              <div className="aspect-video relative">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-90 transition" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg
                    border border-white/40 shadow-xl flex items-center justify-center
                    group-hover:scale-110 transition">
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

      {/* DOTS */}
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

      {/* FULLSCREEN MODAL */}
      {fullscreenIndex !== null && (
        <div
          data-model-video-modal
          tabIndex={-1}
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-xl
            flex items-center justify-center p-4 focus:outline-none"
          onClick={() => setFullscreenIndex(null)}
        >
          {/* Close */}
          <button
            className="absolute bottom-8 right-8 lg:right-12 w-16 h-16
              rounded-full bg-white/10 border border-white/20 shadow-2xl
              backdrop-blur-xl flex items-center justify-center
              hover:bg-white/20 transition z-[1000]"
            onClick={() => setFullscreenIndex(null)}
          >
            <X className="w-7 h-7 text-white" />
          </button>

          {/* Video */}
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `translateY(${dragRef.current.y}px)`,
              transition: dragRef.current.start
                ? "none"
                : "transform 0.25s ease",
            }}
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
              <YouTubePlayer
                videoId={videos[fullscreenIndex].id}
                mode="click"
                autoPlay
              />
            </div>

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
