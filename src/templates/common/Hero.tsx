// src/templates/common/Hero.tsx

import React from "react";
import CTAButtons from "@/components/CTAButtons";
import YouTubePlayer from "@/components/video/YouTubePlayer";

interface HeroProps {
  videoId?: string;
  images?: string[];
  overlayTitle?: string;
  overlaySubtitle?: string;
  ctaEnabled?: boolean;
  quickInfo?: {
    price?: string;
    typology?: string;
    location?: string;
    size?: string;
  };
  onCtaClick?: () => void;
}

export default function HeroStaticAware({
  videoId,
  images = [],
  overlayTitle,
  overlaySubtitle,
  ctaEnabled = true,
  quickInfo,
  onCtaClick,
}: HeroProps) {
  const fallback = images[0] ?? "/images/default-hero-fallback.jpg";

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[520px] bg-black overflow-hidden"
    >
      {/* STATIC LCP IMAGE */}
      <img
        src={fallback}
        alt={overlayTitle ?? "Hero Image"}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* DARK GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

      {/* AUTOPLAY YOUTUBE (only loads when visible) */}
      {videoId && (
	<div className="absolute inset-0">
        <YouTubePlayer
          videoId={videoId}
          mode="autoplay-visible"
          mute={true}
          loop={true}
          controls={false}
          privacyMode={true}
	  forceAutoplay={true}
          className="w-full h-full"
        />
 	</div>
      )}

      {/* OVERLAY TEXT */}
      <div className="absolute top-[18vh] md:top-[24vh] left-1/2 -translate-x-1/2 text-center max-w-3xl text-white px-6">
        {overlayTitle && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl mb-3">
            {overlayTitle}
          </h1>
        )}

        {overlaySubtitle && (
          <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto">
            {overlaySubtitle}
          </p>
        )}

        {ctaEnabled && (
          <div className="mt-8 md:mt-10">
            <CTAButtons onFormOpen={onCtaClick} variant="hero" />
          </div>
        )}
      </div>

      {/* QUICK INFO BAR */}
      {quickInfo && (
        <div className="absolute bottom-0 w-full bg-background/85 backdrop-blur-md border-t border-border py-3 md:py-4">
          <div className="container grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center">
            {quickInfo.price && (
              <QuickField label="Price" value={quickInfo.price} />
            )}
            {quickInfo.typology && (
              <QuickField label="Typology" value={quickInfo.typology} />
            )}
            {quickInfo.location && (
              <QuickField label="Location" value={quickInfo.location} />
            )}
            {quickInfo.size && (
              <QuickField label="Size" value={quickInfo.size} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function QuickField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm md:text-lg font-semibold">{value}</p>
    </div>
  );
}
