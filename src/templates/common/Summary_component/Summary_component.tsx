// src/templates/common/Summary_component/Summary_component.tsx

import SummaryList from "./SummaryList";
import VideoScroller from "@/components/ui/propyoulike/VideoScroller";
import VideoTile from "@/components/video/VideoTile";
import CTAButtons from "@/components/CTAButtons";

export default function Summary_component({
  title,
  subtitle,
  description,
  highlights = [],
  modelFlats = [],
  onCtaClick,
}) {
  return (
    <section className="py-12 md:py-16">

      {/* ------------ TOP TEXT CONTENT ------------ */}
      <div className="container max-w-4xl">
        {title && <h2 className="text-2xl md:text-3xl font-semibold mb-3">{title}</h2>}
        {subtitle && <p className="text-lg text-muted-foreground mb-4">{subtitle}</p>}
        {description && <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>}
        {highlights.length > 0 && <SummaryList items={highlights} />}
      </div>

      {/* ------------ VIDEOS (LAYOUT BREAKOUT) ------------ */}
      {modelFlats.length > 0 && (
        <div className="mt-10">
          <VideoScroller
            items={modelFlats}
            renderItem={(flat) => (
              <VideoTile videoId={flat.youtubeId} title={flat.title} />
            )}
          />
        </div>
      )}

      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}

    </section>
  );
}
