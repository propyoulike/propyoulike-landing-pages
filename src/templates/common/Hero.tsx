/**
 * HYDRATION-OPTIMIZED HERO
 * - Pure static HTML for text
 * - CTA and iframe use tiny hydration
 * - No React diffing of DOM
 */

import React, { useEffect, useRef, useState } from "react";
import CTAButtons from "@/components/CTAButtons";

export default function HeroStaticAware({
  videoUrl,
  images = [],
  overlayTitle,
  overlaySubtitle,
  ctaEnabled = true,
  quickInfo,
  onCtaClick,
}) {
  const [iframeVisible, setIframeVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fallback is first image
  const fallback = images[0] ?? "/images/default-hero-fallback.jpg";

  // Activate iframe 0.8 seconds after load
  useEffect(() => {
    if (!videoUrl) return;

    const t = setTimeout(() => {
      setIframeVisible(true);
    }, 800);

    return () => clearTimeout(t);
  }, [videoUrl]);

  // YouTube embed safe-privacy link
  const videoId = extractId(videoUrl);
  const embedSrc = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}`
    : null;

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[520px] bg-black overflow-hidden"
    >
      {/* Static LCP image */}
      <img
        src={fallback}
        alt={overlayTitle ?? "Hero"}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      {/* Title + subtitle STATIC */}
      <div className="absolute top-[24vh] left-1/2 -translate-x-1/2 text-center max-w-3xl text-white px-6">
        {overlayTitle && (
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-xl mb-3">
            {overlayTitle}
          </h1>
        )}
        {overlaySubtitle && (
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            {overlaySubtitle}
          </p>
        )}
      </div>

      {/* CTA (hydrated) */}
      {ctaEnabled && (
        <div className="absolute left-1/2 bottom-[24vh] -translate-x-1/2">
          <CTAButtons onFormOpen={onCtaClick} variant="hero" />
        </div>
      )}

      {/* Quick-info (STATIC) */}
      {quickInfo && (
        <div className="absolute bottom-0 w-full bg-background/85 backdrop-blur-md border-t border-border py-4">
          <div className="container grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {quickInfo.price && (
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">{quickInfo.price}</p>
              </div>
            )}
            {quickInfo.typology && (
              <div>
                <p className="text-xs text-muted-foreground">Typology</p>
                <p className="text-lg font-semibold">{quickInfo.typology}</p>
              </div>
            )}
            {quickInfo.location && (
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-lg font-semibold">{quickInfo.location}</p>
              </div>
            )}
            {quickInfo.size && (
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="text-lg font-semibold">{quickInfo.size}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* IFRAME (hydrated, lazy) */}
      {iframeVisible && embedSrc && (
        <iframe
          ref={iframeRef}
          src={embedSrc}
          className="absolute inset-0 w-full h-full object-cover"
          allow="autoplay; encrypted-media"
          title="project hero video"
        />
      )}
    </section>
  );
}

/** Extract YouTube ID safely */
function extractId(url?: string) {
  if (!url) return null;
  const m =
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/embed\/([^?]+)/);
  return m ? m[1] : null;
}
