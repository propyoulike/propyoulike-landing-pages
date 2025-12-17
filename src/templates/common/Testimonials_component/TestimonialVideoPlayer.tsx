// src/templates/common/Testimonials_component/TestimonialVideoPlayer.tsx

import YouTubePlayer from "@/components/video/YouTubePlayer";

export default function TestimonialVideoPlayer({
  videoId,
  onExit,
}: {
  videoId: string;
  onExit?: () => void;
}) {
  if (!videoId) return null;

  return (
    <div
      className="relative w-full h-full"
      role="region"
      aria-label="Testimonial video player"
    >
      {/* YouTube Player */}
      <YouTubePlayer
        videoId={videoId}
        mode="click"
        autoPlay
        playsInline            // ✅ mobile-safe
        className="w-full h-full"
        onExit={onExit}
      />

      {/* Soft exit hint (non-blocking) */}
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          aria-label="Close video"
          className="
            absolute top-3 right-3 z-10
            rounded-full bg-black/60 text-white
            px-3 py-1 text-xs
            opacity-70 hover:opacity-100
            transition
          "
        >
          Close
        </button>
      )}
    </div>
  );
}
