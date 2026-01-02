// src/templates/common/Hero/HeroMedia.tsx

import { useEffect, useState } from "react";
import YouTubePlayer from "@/components/video/YouTubePlayer";

interface HeroMediaProps {
  videoId?: string;
  images?: string[];
}

/**
 * HeroMedia
 * ------------------------------------------------------------
 * LCP STRATEGY (LOCKED):
 * - Always render hero IMAGE first → guaranteed LCP
 * - Defer video until after first paint (idle time)
 * - Explicit dimensions → Chrome prefers image over text/button
 * - Video never blocks FCP / LCP
 */
export default function HeroMedia({
  videoId,
  images = [],
}: HeroMediaProps) {
  const image = images[0];
  const hasVideo = Boolean(videoId);

  // Defer video until browser is idle (LCP-safe)
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!hasVideo) return;

    // requestIdleCallback is not supported everywhere
    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(() => {
        setShowVideo(true);
      });
      return () => (window as any).cancelIdleCallback(id);
    }

    // Fallback: defer one frame
    const t = setTimeout(() => setShowVideo(true), 0);
    return () => clearTimeout(t);
  }, [hasVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* =====================================================
          LCP IMAGE (ALWAYS FIRST)
      ====================================================== */}
      {image && (
        <img
          src={image}
          alt="Project hero background"
          fetchpriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* =====================================================
          VIDEO (DEFERRED — NEVER LCP)
      ====================================================== */}
      {hasVideo && showVideo && (
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

      {/* =====================================================
          GRADIENT OVERLAY (INTENTIONAL)
      ====================================================== */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
    </div>
  );
}
