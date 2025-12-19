// src/templates/common/Hero/Hero_component.tsx

import HeroMedia from "./HeroMedia";
import HeroContent from "./HeroContent";
import HeroQuickInfo from "./HeroQuickInfo";

interface HeroMeta {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

interface HeroProps {
  /** Media */
  videoId?: string;
  images?: string[];

  /** Copy (meta-like, enforced) */
  meta?: HeroMeta;

  /** CTA */
  ctaEnabled?: boolean;
  onCtaClick?: () => void;

  /** Reassurance strip */
  quickInfo?: {
    price?: string;
    typology?: string;
    location?: string;
    size?: string;
  };
}

export default function Hero_component(props: HeroProps) {
  const {
    videoId,
    images = [],
    meta,
    quickInfo,
  } = props;

  const title = meta?.title;
  const subtitle = meta?.subtitle;
  const tagline = meta?.tagline;

  /* ─────────────────────────────
     SINGLE DOMINANT VISUAL
  ───────────────────────────── */
  const hasVideo = Boolean(videoId);
  const hasImages = !hasVideo && images.length > 0;
  const hasMedia = hasVideo || hasImages;
  const hasText = Boolean(title || subtitle || tagline);

  /* ─────────────────────────────
     RENDER GUARD
  ───────────────────────────── */
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
      {/* Visual */}
      {hasMedia && (
        <HeroMedia
          videoId={hasVideo ? videoId : undefined}
          images={hasImages ? images : []}
        />
      )}

      {/* Copy + CTA */}
      <HeroContent
        title={title}
        subtitle={subtitle}
        tagline={tagline}
        hasMedia={hasMedia}
        ctaEnabled={props.ctaEnabled}
        onCtaClick={props.onCtaClick}
        ctaSource="hero_primary"
      />

      {/* Reassurance strip */}
      {hasMedia && quickInfo && (
        <HeroQuickInfo quickInfo={quickInfo} />
      )}
    </section>
  );
}
