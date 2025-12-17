// src/templates/common/Hero/Hero_component.tsx

import HeroMedia from "./HeroMedia";
import HeroContent from "./HeroContent";
import HeroQuickInfo from "./HeroQuickInfo";

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

export default function Hero_component(props: HeroProps) {
  const {
    videoId,
    images = [],
    overlayTitle,
    overlaySubtitle,
    quickInfo,
  } = props;

  // 🔐 ENFORCE SINGLE DOMINANT VISUAL
  const hasVideo = Boolean(videoId);
  const hasImages = !hasVideo && images.length > 0;
  const hasMedia = hasVideo || hasImages;
  const hasText = Boolean(overlayTitle || overlaySubtitle);

  // 🔐 render guard
  if (!hasMedia && !hasText) return null;

  return (
    <section
      id="hero"
      className={[
        "relative w-full overflow-hidden",
        hasMedia
          ? "h-[100svh] min-h-[520px] bg-black"
          : "py-20 bg-background",
      ].join(" ")}
    >
      {hasMedia && (
        <HeroMedia
          videoId={hasVideo ? videoId : undefined}
          images={hasImages ? images : []}
        />
      )}

      <HeroContent
        {...props}
        hasMedia={hasMedia}
      />

      {hasMedia && quickInfo && (
        <HeroQuickInfo quickInfo={quickInfo} />
      )}
    </section>
  );
}
