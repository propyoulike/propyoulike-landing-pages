// src/templates/common/Summary_component/Summary_component.tsx

import SummaryList from "./SummaryList";
import VideoScroller from "@/components/ui/propyoulike/VideoScroller";
import VideoTile from "@/components/video/VideoTile";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface SummaryProps {
  id?: string;
  meta?: SectionMeta | null;
  description?: string;
  highlights?: string[];
  modelFlats?: {
    youtubeId?: string;
    title?: string;
  }[];
}

/* ---------------------------------------------------------------------
   DEFAULT META
------------------------------------------------------------------------*/
const DEFAULT_META: SectionMeta = {
  eyebrow: "OVERVIEW",
  title: "Project Overview",
  subtitle: "Everything you should know before you visit",
  tagline: "A quick snapshot before you explore further",
};

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function Summary_component({
  id = "overview",
  meta,
  description,
  highlights = [],
  modelFlats = [],
}: SummaryProps) {

  const resolvedMeta =
    meta === null
      ? null
      : { ...DEFAULT_META, ...meta };

  const hasPrimaryContent =
    !!resolvedMeta?.title ||
    !!resolvedMeta?.subtitle ||
    !!description ||
    highlights.length > 0;

  if (!hasPrimaryContent && modelFlats.length === 0) {
    return null;
  }

  return (
    <BaseSection
      id={id}
      meta={resolvedMeta}
      padding="md"
      align="center"
    >
      {/* PRIMARY CONTENT */}
      <div className="max-w-4xl">
        {description && (
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="mt-6">
            <SummaryList items={highlights} />
          </div>
        )}
      </div>

      {/* SECONDARY: WALKTHROUGH VIDEOS */}
      {modelFlats.length > 0 && (
        <div className="mt-14">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Model Flat Walkthroughs
          </p>

          <VideoScroller
            items={modelFlats}
            renderItem={(flat) =>
              flat.youtubeId ? (
                <div className="aspect-video">
                  <VideoTile
                    videoId={flat.youtubeId}
                    title={flat.title}
                  />
                </div>
              ) : null
            }
          />
        </div>
      )}
    </BaseSection>
  );
}
