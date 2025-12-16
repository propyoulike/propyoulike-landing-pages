// src/templates/common/Hero/HeroContent.tsx

import CTAButtons from "@/components/CTAButtons";

export default function HeroContent({
  overlayTitle,
  overlaySubtitle,
  ctaEnabled = true,
  onCtaClick,
  hasMedia,
}: {
  overlayTitle?: string;
  overlaySubtitle?: string;
  ctaEnabled?: boolean;
  hasMedia: boolean;
  onCtaClick?: () => void;
}) {
  return (
    <div
      className={[
        "relative z-10 text-center max-w-3xl mx-auto px-6",
        hasMedia ? "top-[18vh] md:top-[24vh] text-white" : "text-foreground",
      ].join(" ")}
    >
      {overlayTitle && (
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3">
          {overlayTitle}
        </h1>
      )}

      {overlaySubtitle && (
        <p className="text-base md:text-lg max-w-xl mx-auto opacity-90">
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
