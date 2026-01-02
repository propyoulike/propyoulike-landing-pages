import { Play } from "lucide-react";
import StarRating from "./StarRating";
import TestimonialVideoPlayer from "./TestimonialVideoPlayer";

interface Testimonial {
  name: string;
  quote?: string;
  rating?: number;
  videoId?: string;
  thumbUrl?: string;
}

interface TestimonialCardProps {
  t: Testimonial;
  activeVideo: string | null;
  setActiveVideo: (v: string | null) => void;
  isLarge?: boolean;
  onPlay?: () => void;
}

export default function TestimonialCard({
  t,
  activeVideo,
  setActiveVideo,
  isLarge = false,
  onPlay,
}: TestimonialCardProps) {
  const hasVideo = Boolean(t.videoId);
  const playing = hasVideo && activeVideo === t.videoId;

  const thumbnail =
    t.thumbUrl ||
    (hasVideo
      ? `https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`
      : undefined);

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-md">
      {/* ---------- VIDEO / THUMBNAIL ---------- */}
      {hasVideo && (
        <div className="relative aspect-video bg-muted">
          {playing ? (
            <TestimonialVideoPlayer
              videoId={t.videoId!}
              onExit={() => setActiveVideo(null)}
            />
          ) : (
            <>
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={`Testimonial from ${t.name}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  Video testimonial
                </div>
              )}

              <button
                aria-label={`Play testimonial video by ${t.name}`}
                onClick={() => {
                  setActiveVideo(null);
                  requestAnimationFrame(() => {
                    setActiveVideo(t.videoId!);
                    onPlay?.();
                  });
                }}
                className="absolute inset-0 flex items-center justify-center 
                           bg-black/20 hover:bg-black/30 transition"
              >
                <div
                  className={[
                    "rounded-full bg-primary/90 shadow-xl flex items-center justify-center",
                    "transition-transform ease-out",
                    isLarge
                      ? "w-20 h-20 md:w-24 md:h-24 hover:scale-110"
                      : "w-14 h-14 md:w-16 md:h-16 hover:scale-105",
                  ].join(" ")}
                >
                  <Play
                    className={[
                      "text-white ml-1",
                      isLarge ? "w-10 h-10" : "w-7 h-7",
                    ].join(" ")}
                  />
                </div>
              </button>
            </>
          )}
        </div>
      )}

      {/* ---------- TEXT CONTENT ---------- */}
      <div className={isLarge ? "p-8 text-center" : "p-5"}>
        {t.rating && (
          <div className="mb-3 flex justify-center">
            <StarRating rating={t.rating} />
          </div>
        )}

        {t.quote && (
          <p
            className={[
              "italic text-muted-foreground leading-relaxed",
              isLarge
                ? "text-lg md:text-xl mb-4"
                : "text-base mb-3",
            ].join(" ")}
          >
            “{t.quote}”
          </p>
        )}

        <p className="font-semibold text-foreground">
          — {t.name}
        </p>
      </div>
    </div>
  );
}
