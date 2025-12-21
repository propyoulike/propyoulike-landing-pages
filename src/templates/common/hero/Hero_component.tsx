// src/templates/common/Hero/Hero_component.tsx

import HeroMedia from "./HeroMedia";
import HeroContent from "./HeroContent";
import HeroQuickInfo from "./HeroQuickInfo";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface HeroMeta {
  title?: string;
  subtitle?: string;
  tagline?: string;
}

interface HeroProps {
  /* Media */
  videoId?: string;
  images?: string[];

  /* Copy (hero-only, NOT SectionMeta) */
  meta?: HeroMeta;

  /* CTA */
  ctaEnabled?: boolean;
  onCtaClick?: () => void;

  /* Reassurance strip */
  quickInfo?: {
    price?: string;
    typology?: string;
    location?: string;
    size?: string;
  };
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function Hero_component({
  videoId,
  images = [],
  meta,
  ctaEnabled,
  onCtaClick,
  quickInfo,
}: HeroProps) {
  const title = meta?.title;
  const subtitle = meta?.subtitle;
  const tagline = meta?.tagline;

  /* -------------------------------------------------
     MEDIA RESOLUTION
  ------------------------------------------------- */
  const hasVideo = Boolean(videoId);
  const hasImages = !hasVideo && images.length > 0;
  const hasMedia = hasVideo || hasImages;

  /* -------------------------------------------------
     CONTENT GUARD
  ------------------------------------------------- */
  const hasText = Boolean(title || subtitle || tagline);

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
      {/* ─────────────────────────────
         MEDIA LAYER
      ───────────────────────────── */}
      {hasMedia && (
        <HeroMedia
          videoId={hasVideo ? videoId : undefined}
          images={hasImages ? images : []}
        />
      )}

      {/* ─────────────────────────────
         COPY + PRIMARY CTA
      ───────────────────────────── */}
      <HeroContent
        title={title}
        subtitle={subtitle}
        tagline={tagline}
        hasMedia={hasMedia}
        ctaEnabled={ctaEnabled}
        onCtaClick={onCtaClick}
        ctaSource="hero_primary"
      />

      {/* ─────────────────────────────
         REASSURANCE STRIP
      ───────────────────────────── */}
      {hasMedia && quickInfo && (
        <HeroQuickInfo quickInfo={quickInfo} />
      )}
    </section>
  );
}
