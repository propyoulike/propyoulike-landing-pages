// src/templates/common/Hero.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import CTAButtons from "@/components/CTAButtons";

type QuickInfo = {
  price?: string;
  typology?: string;
  location?: string;
  size?: string;
};

interface HeroProps {
  videoUrl?: string;
  images?: string[]; // [0] used as LCP fallback
  overlayTitle?: string;
  overlaySubtitle?: string;
  ctaEnabled?: boolean;
  quickInfo?: QuickInfo;
  onCtaClick?: () => void;
}

/**
 * Utility: extract YouTube ID from many URL formats
 */
function extractYouTubeId(url?: string) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * Final Production Hero
 * - LCP image (preconnect + fetchpriority)
 * - YouTube nocookie embed (autoplay muted) but respects data-saver / reduced-motion
 * - Fallback image fade-out when iframe loaded
 * - Safari iOS fixes (playsInline + style objectFit)
 * - Accessibility: region label and clear text content
 */
export default function Hero({
  videoUrl,
  images = [],
  overlayTitle,
  overlaySubtitle,
  ctaEnabled = true,
  quickInfo,
  onCtaClick,
}: HeroProps) {
  const [shouldInjectIframe, setShouldInjectIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // LCP fallback image (first provided or default)
  const fallbackImage = images[0] ?? "/images/default-hero-fallback.jpg";

  // Decide if we should autoplay video:
  // - Respect reduced motion
  // - Respect Save-Data or slow connections
  const prefersReducedMotion = useMemo(() => {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }, []);

  const networkOk = useMemo(() => {
    try {
      const nav = (navigator as any);
      // effectiveType could be '4g', '3g', '2g', 'slow-2g'
      const effectiveType = nav.connection?.effectiveType;
      const saveData = nav.connection?.saveData;
      if (saveData) return false;
      if (effectiveType && (effectiveType === "2g" || effectiveType === "slow-2g")) return false;
    } catch {}
    return true;
  }, []);

  // final boolean: if we should attempt injecting iframe
  const canAutoplay = !prefersReducedMotion && networkOk;

  // video id & embed url (use youtube-nocookie for privacy)
  const videoId = extractYouTubeId(videoUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}&modestbranding=1&rel=0`
    : null;

  // Delay injection to avoid blocking LCP; hero is top-of-page so small delay is safe.
  useEffect(() => {
    // if user opts out via prefersReducedMotion or network is poor, do not inject
    if (!embedUrl || !canAutoplay) return;

    const t = window.setTimeout(() => setShouldInjectIframe(true), 500); // short delay
    return () => window.clearTimeout(t);
  }, [embedUrl, canAutoplay]);

  // Preconnect tags (insert early for performance)
  // NOTE: React can render <link> in body; browsers still honor preconnect
  const preconnectNodes = (
    <>
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="" />
      {/* Preload the LCP image for LCP improvements */}
      <link rel="preload" as="image" href={fallbackImage} />
    </>
  );

  return (
    <section
      id="hero"
      role="region"
      aria-label={overlayTitle ? `${overlayTitle} hero` : "project hero"}
      className="relative w-full h-[100svh] min-h-[520px] bg-black overflow-hidden"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {preconnectNodes}

      {/* LCP fallback image (must be first paint) */}
      <img
        src={fallbackImage}
        alt={overlayTitle ?? "Project hero image"}
        // ensure absolutely fills container and is clipped correctly across browsers
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          iframeLoaded ? "opacity-0" : "opacity-100"
        }`}
        // ensure styles for Safari stability
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
        // lowercase attribute per React warnings
        fetchpriority="high"
      />

      {/* Conditionally inject iframe only when allowed */}
      {embedUrl && shouldInjectIframe && (
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={overlayTitle ? `${overlayTitle} video` : "project video"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            iframeLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "100%", height: "100%", border: "none" }}
          allow="autoplay; encrypted-media; fullscreen"
          loading="lazy"
          // playsInline + muted help mobile autoplay
          // 'muted' attribute is purely for HTMLMediaElement; still harmless on iframe
          // onLoad -> mark iframe loaded so we fade-out fallback image
          onLoad={() => setIframeLoaded(true)}
        />
      )}

      {/* If we did NOT inject iframe (save-data, reduced motion, or no video) - keep image visible and optionally show a play button */}
      {!shouldInjectIframe && embedUrl && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          aria-hidden="true"
          // small semi-transparent overlay to indicate video available
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* subtle gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80 z-20" />

      {/* Text overlay */}
      <div className="absolute top-[24vh] left-1/2 -translate-x-1/2 text-center max-w-3xl text-white px-6 z-30">
        {overlayTitle && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl mb-3 leading-tight">
            {overlayTitle}
          </h1>
        )}
        {overlaySubtitle && (
          <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto">{overlaySubtitle}</p>
        )}
      </div>

      {/* Primary CTA block — high-converting placement */}
      {ctaEnabled && (
        <div className="absolute left-1/2 bottom-[24vh] -translate-x-1/2 z-30">
          <CTAButtons onFormOpen={onCtaClick} />
        </div>
      )}

      {/* Quick Info bar */}
      {quickInfo && (
        <div className="absolute bottom-0 w-full bg-background/85 backdrop-blur-md border-t border-border py-4 z-40">
          <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
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
    </section>
  );
}
