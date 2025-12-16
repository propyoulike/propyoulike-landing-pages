// src/templates/common/Hero/HeroMedia.tsx

import YouTubePlayer from "@/components/video/YouTubePlayer";

export default function HeroMedia({
  videoId,
  images = [],
}: {
  videoId?: string;
  images?: string[];
}) {
  const fallback = images[0];

  return (
    <>
      {fallback && (
        <img
          src={fallback}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      {videoId && (
        <div className="absolute inset-0">
          <YouTubePlayer
            videoId={videoId}
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
    </>
  );
}
