// src/templates/common/Hero/HeroContent.tsx

import CTAButtons from "@/components/CTAButtons";

interface HeroContentProps {
  overlayTitle?: string;
  overlaySubtitle?: string;
  ctaEnabled?: boolean;
  hasMedia: boolean;
  onCtaClick?: () => void;
}

export default function HeroContent({
  overlayTitle,
  overlaySubtitle,
  ctaEnabled = true,
  onCtaClick,
  hasMedia,
}: HeroContentProps) {
  return (
    <div
      className={[
        "relative z-10 max-w-3xl mx-auto px-6 text-center",
        hasMedia
          ? "pt-[18vh] md:pt-[24vh] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
          : "py-20 text-foreground",
      ].join(" ")}
    >
      {overlayTitle && (
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          {overlayTitle}
        </h1>
      )}

      {overlaySubtitle && (
        <p className="text-base md:text-lg max-w-xl mx-auto text-white/90">
          {overlaySubtitle}
        </p>
      )}

      {ctaEnabled && (
        <div className="mt-8 md:mt-10">
          <CTAButtons onFormOpen={onCtaClick} variant="hero" />
        </div>
      )}
    </div>
  );
}
