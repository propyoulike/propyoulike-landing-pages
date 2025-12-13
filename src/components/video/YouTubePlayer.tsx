// src/components/video/YouTubePlayer.tsx
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface YouTubePlayerProps {
  videoId: string;

  mode?: "click" | "autoplay-visible" | "inline-autoplay";

  className?: string;
  rounded?: boolean;

  controls?: boolean;
  loop?: boolean;
  mute?: boolean;
  privacyMode?: boolean;

  /** Hero override */
  forceAutoplay?: boolean;
}

export default function YouTubePlayer({
  videoId,
  mode = "click",
  className = "",
  rounded = true,
  controls = true,
  loop = false,
  mute = false,
  privacyMode = true,
  forceAutoplay = false,
}: YouTubePlayerProps) {
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  /* -----------------------------------------
     Base URL
  ----------------------------------------- */
  const baseSrc = privacyMode
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : `https://www.youtube.com/embed/${videoId}`;

  /* -----------------------------------------
     FIXED Autoplay Rules
  ----------------------------------------- */
  const shouldAutoplay =
    forceAutoplay ||
    clicked ||
    mode === "inline-autoplay" ||
    (mode === "autoplay-visible" && visible);

  const params = new URLSearchParams({
    autoplay: shouldAutoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    controls: controls ? "1" : "0",
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
  });

  if (loop) {
    params.append("loop", "1");
    params.append("playlist", videoId);
  }

  const iframeSrc = `${baseSrc}?${params.toString()}`;

  /* -----------------------------------------
     Visibility Autoplay Trigger
  ----------------------------------------- */
  useEffect(() => {
    if (mode !== "autoplay-visible") return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [mode]);

  /* -----------------------------------------
     iOS Safari Autoplay Fallback
  ----------------------------------------- */
  useEffect(() => {
    if (!forceAutoplay) return;

    const t = setTimeout(() => {
      setVisible(true);
    }, 650);

    return () => clearTimeout(t);
  }, [forceAutoplay]);

  /* -----------------------------------------
     Compute playback state
  ----------------------------------------- */
  const showIframe = shouldAutoplay || clicked;

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-black w-full h-full",
        rounded && "rounded-2xl",
        className
      )}
    >
      {/* Thumbnail */}
      {!showIframe && (
        <img
          src={thumbnail}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {/* Click Overlay (including fallback for failed autoplay) */}
      {!showIframe && (
        <button
          onClick={() => setClicked(true)}
          className="
            absolute inset-0 z-20 flex items-center justify-center
            bg-black/40 hover:bg-black/50 transition
          "
        >
          <div
            className="
              w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20
              border border-white/40 backdrop-blur-md flex items-center justify-center
              hover:scale-110 transition-transform shadow-xl
            "
          >
            <svg width="38" height="38" fill="white" viewBox="0 0 24 24">
              <path d='M8 5v14l11-7z' />
            </svg>
          </div>
        </button>
      )}

      {/* The actual video */}
      {showIframe && (
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="eager"
        />
      )}

      {/* Smooth overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}
