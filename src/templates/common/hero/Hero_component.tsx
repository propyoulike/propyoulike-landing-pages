// src/templates/common/Hero/Hero_component.tsx

/**
 * ============================================================
 * Hero_component
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Renders the hero section for a project
 * - Owns normalization of hero-specific data
 *
 * WHAT THIS COMPONENT DOES
 * ------------------------------------------------------------
 * - Resolves media vs text layout
 * - Applies hero-only semantics (not generic SectionMeta)
 * - Delegates rendering to subcomponents
 *
 * WHAT THIS COMPONENT DOES NOT DO
 * ------------------------------------------------------------
 * - No data fetching
 * - No routing or identity logic
 * - No schema validation
 * - No browser-only side effects
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. LOCAL NORMALIZATION
 *    → Hero owns interpretation of hero payload
 *
 * 2. INTENT-BASED RENDERING
 *    → Content shown only when meaningful
 *
 * 3. PURE RENDER
 *    → Same props = same output
 *
 * ============================================================
 */

import HeroMedia from "./HeroMedia";
import HeroContent from "./HeroContent";
import HeroQuickInfo from "./HeroQuickInfo";

/* ---------------------------------------------------------------------
   SECTION SHAPE (INTENTIONALLY TOLERANT)
------------------------------------------------------------------------*/
/**
 * NOTE:
 * This is NOT strict schema typing.
 * Hero is a marketing surface — tolerant by design.
 */
interface HeroSection {
  videoId?: string;
  images?: string[];

  meta?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    tagline?: string;
    [key: string]: unknown;
  };

  ctaEnabled?: boolean;

  quickInfo?: {
    price?: string;
    typology?: string;
    location?: string;
    size?: string;
  };

  [key: string]: unknown;
}

interface HeroProps {
  hero?: HeroSection;
  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function Hero_component({
  hero,
  onCtaClick,
}: HeroProps) {
  /* ------------------------------------------------------------
     HARD GUARD — NO HERO DATA
  ------------------------------------------------------------ */
  if (!hero) {
    if (import.meta.env.DEV) {
      console.warn("🦸 Hero skipped: hero prop missing");
    }
    return null;
  }

  /* ------------------------------------------------------------
     NORMALIZATION (HERO OWNS THIS)
  ------------------------------------------------------------ */
  const {
    videoId,
    images = [],
    meta = {},
    quickInfo,
    ctaEnabled = true,
  } = hero;

  const { eyebrow, title, subtitle, tagline } = meta;

  /* ------------------------------------------------------------
     MEDIA RESOLUTION
  ------------------------------------------------------------ */
  const hasVideo = Boolean(videoId);
  const hasImages = !hasVideo && images.length > 0;
  const hasMedia = hasVideo || hasImages;

  /* ------------------------------------------------------------
     CONTENT INTENT CHECK
  ------------------------------------------------------------ */
  const hasText = Boolean(eyebrow || title || subtitle || tagline);

  if (!hasMedia && !hasText) {
    if (import.meta.env.DEV) {
      console.warn("🦸 Hero skipped: no media and no text");
    }
    return null;
  }

  /* ------------------------------------------------------------
     RENDER
  ------------------------------------------------------------ */
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
        eyebrow={eyebrow}
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
