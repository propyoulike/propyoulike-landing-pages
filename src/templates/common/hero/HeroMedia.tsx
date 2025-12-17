// src/templates/common/Hero/HeroMedia.tsx

import YouTubePlayer from "@/components/video/YouTubePlayer";

interface HeroMediaProps {
  videoId?: string;
  images?: string[];
}

export default function HeroMedia({
  videoId,
  images = [],
}: HeroMediaProps) {
  const image = images[0];
  const hasVideo = Boolean(videoId);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* --- VIDEO (dominant, if present) --- */}
      {hasVideo && (
        <div className="absolute inset-0">
          <YouTubePlayer
            videoId={videoId!}
            mode="autoplay-visible"
            mute
            loop
            controls={false}
            privacyMode
            forceAutoplay
            className="w-full h-full"
          />
        </div>
      )}

      {/* --- IMAGE (only if no video) --- */}
      {!hasVideo && image && (
        <img
          src={image}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* --- GRADIENT OVERLAY (always intentional) --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
    </div>
  );
}
