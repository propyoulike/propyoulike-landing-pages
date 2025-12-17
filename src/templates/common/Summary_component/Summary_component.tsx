// src/templates/common/Summary_component/Summary_component.tsx

import SummaryList from "./SummaryList";
import VideoScroller from "@/components/ui/propyoulike/VideoScroller";
import VideoTile from "@/components/video/VideoTile";

interface SummaryProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  modelFlats?: { youtubeId?: string; title?: string }[];
}

export default function Summary_component({
  title,
  subtitle,
  description,
  highlights = [],
  modelFlats = [],
}: SummaryProps) {
  const hasContent =
    title ||
    subtitle ||
    description ||
    highlights.length > 0 ||
    modelFlats.length > 0;

  if (!hasContent) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
      {/* ------------ TOP TEXT CONTENT ------------ */}
      <div className="container max-w-4xl">
        {title && (
          <h2 className="text-3xl font-semibold mb-3">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-lg text-muted-foreground mb-4">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
        )}

        {highlights.length > 0 && (
          <SummaryList items={highlights} />
        )}
      </div>

      {/* ------------ WALKTHROUGH VIDEOS (SECONDARY) ------------ */}
      {modelFlats.length > 0 && (
        <div className="mt-10">
          <div className="container mb-3">
            <p className="text-sm font-medium text-muted-foreground">
              Walkthrough Videos
            </p>
          </div>

          <VideoScroller
            items={modelFlats}
            renderItem={(flat) => (
              <div className="aspect-video">
                <VideoTile
                  videoId={flat.youtubeId}
                  title={flat.title}
                />
              </div>
            )}
          />
        </div>
      )}
    </section>
  );
}
