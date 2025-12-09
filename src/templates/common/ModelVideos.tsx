import { useState, useRef, useEffect, useCallback } from "react";

interface ModelVideosProps {
  modelFlats: {
    title: string;
    videoUrl: string;
  }[];
}

const ModelVideos = ({ modelFlats }: ModelVideosProps) => {
  const modelScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  /* ---------- YouTube ID ---------- */
  const getYoutubeId = useCallback((url: string) => {
    try {
      const u = new URL(url);
      return u.searchParams.get("v") || u.pathname.split("/").pop() || "";
    } catch {
      return url.split("/").pop() || "";
    }
  }, []);

  const convertToEmbed = (url: string) =>
    `https://www.youtube.com/embed/${getYoutubeId(url)}`;

  /* ---------- Track Active Slide ---------- */
  useEffect(() => {
    const handler = () => {
      if (!modelScrollRef.current) return;
      const w = modelScrollRef.current.clientWidth * 0.9;
      const index = Math.round(modelScrollRef.current.scrollLeft / w);
      setActiveVideo(index);
    };
    const ref = modelScrollRef.current;
    ref?.addEventListener("scroll", handler, { passive: true });
    return () => ref?.removeEventListener("scroll", handler);
  }, []);

  /* ---------- OTT Snap ---------- */
  useEffect(() => {
    const el = modelScrollRef.current;
    if (!el) return;

    let timeout: any;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const w = el.clientWidth * 0.9;
        const index = Math.round(el.scrollLeft / w);
        el.scrollTo({
          left: index * w,
          behavior: "smooth",
        });
      }, 80);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="relative max-w-7xl mx-auto mb-16">

      {/* Left Gradient */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />

      {/* Right Gradient */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />

      {/* Carousel */}
      <div
        ref={modelScrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-8 justify-center"
        style={{ padding: "0 5vw" }}
      >
        {modelFlats.map((video, i) => (
          <div
            key={i}
            style={{ scrollSnapAlign: "center" }}
            className="w-[90%] md:w-[860px] max-w-[860px] mx-auto flex-shrink-0 snap-center"
          >
            <div
              className={`
                rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-black 
                transition-all duration-500 cursor-pointer
                ${activeVideo === i ? "scale-[1.01] brightness-100" : "scale-95 brightness-75"}
              `}
              onClick={() => setFullscreenIndex(i)}
            >
              <div className="aspect-video">
                <iframe
                  src={
                    activeVideo === i
                      ? convertToEmbed(video.videoUrl) + "?autoplay=1"
                      : convertToEmbed(video.videoUrl)
                  }
                  allow="accelerometer; autoplay; encrypted-media; gyroscope"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>
            </div>

            <p className="text-center text-base md:text-lg mt-4 font-semibold text-foreground">
              {video.title}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-3">
        {modelFlats.map((_, i) => (
          <div
            key={i}
            className={`
              h-2 w-2 rounded-full transition-all 
              ${activeVideo === i ? "bg-primary scale-125" : "bg-muted"}
            `}
          />
        ))}
      </div>

      {/* -------- Fullscreen -------- */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setFullscreenIndex(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl font-bold z-50"
            onClick={() => setFullscreenIndex(null)}
          >
            ×
          </button>

          <iframe
            src={convertToEmbed(modelFlats[fullscreenIndex].videoUrl) + "?autoplay=1"}
            allow="accelerometer; autoplay; encrypted-media; gyroscope"
            allowFullScreen
            className="w-[92vw] h-[50vh] md:w-[70vw] md:h-[75vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default ModelVideos;
