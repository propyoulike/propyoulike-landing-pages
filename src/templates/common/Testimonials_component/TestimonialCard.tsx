import { Play } from "lucide-react";
import StarRating from "./StarRating";
import TestimonialVideoPlayer from "./TestimonialVideoPlayer";

export default function TestimonialCard({
  t,
  activeVideo,
  setActiveVideo,
  isLarge,
  onPlay,
}: {
  t: any;
  activeVideo: string | null;
  setActiveVideo: (v: string | null) => void;
  isLarge?: boolean;
  onPlay?: () => void;
}) {
  const hasVideo = !!t.videoId;

  const thumbnail =
    t.thumbUrl || (hasVideo && `https://img.youtube.com/vi/${t.videoId}/maxresdefault.jpg`);

  const playing = activeVideo === t.videoId;

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
      {/* VIDEO OR THUMBNAIL */}
      {hasVideo && (
        <div className="relative aspect-video">
          {playing ? (
            <TestimonialVideoPlayer
              videoId={t.videoId}
              onExit={() => setActiveVideo(null)}
            />
          ) : (
            <>
              <img src={thumbnail} alt={t.name} className="w-full h-full object-cover" />

              <button
                onClick={() => {
                  setActiveVideo(t.videoId);
                  onPlay?.();
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition"
              >
                <div
                  className={`rounded-full bg-primary shadow-xl flex items-center justify-center transition-transform ${
                    isLarge
                      ? "w-20 h-20 md:w-24 md:h-24 hover:scale-110"
                      : "w-14 h-14 md:w-16 md:h-16 hover:scale-105"
                  }`}
                >
                  <Play
                    className={`text-white ml-1 ${
                      isLarge ? "w-10 h-10" : "w-7 h-7"
                    }`}
                  />
                </div>
              </button>
            </>
          )}
        </div>
      )}

      {/* TEXT CONTENT */}
      <div className={`${isLarge ? "p-8" : "p-5"}`}>
        {t.rating && (
          <div className="mb-3">
            <StarRating rating={t.rating} />
          </div>
        )}

        {t.quote && (
          <p
            className={`italic text-muted-foreground ${
              isLarge ? "text-lg md:text-xl mb-4 text-center" : "text-base mb-3"
            }`}
          >
            "{t.quote}"
          </p>
        )}

        <p
          className={`font-semibold text-foreground ${
            isLarge ? "text-lg text-center" : ""
          }`}
        >
          — {t.name}
        </p>
      </div>
    </div>
  );
}
