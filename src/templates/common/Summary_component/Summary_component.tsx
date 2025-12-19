// src/templates/common/Summary_component/Summary_component.tsx

import SummaryList from "./SummaryList";
import VideoScroller from "@/components/ui/propyoulike/VideoScroller";
import VideoTile from "@/components/video/VideoTile";
import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface SummaryProps {
  id?: string;

  /** Canonical section meta (REQUIRED for visible sections) */
  meta?: SectionMeta;

  /** Supporting description (1–2 short paragraphs max) */
  description?: string;

  /** Key bullet highlights */
  highlights?: string[];

  /** Optional walkthrough / model flat videos */
  modelFlats?: {
    youtubeId?: string;
    title?: string;
  }[];
}

export default function Summary_component({
  id = "overview",

  meta = {
    title: "Project Overview",
    subtitle: "Everything you should know before you visit",
  },

  description,
  highlights = [],
  modelFlats = [],
}: SummaryProps) {
  const hasPrimaryContent =
    meta?.title ||
    meta?.subtitle ||
    description ||
    highlights.length > 0;

  if (!hasPrimaryContent && modelFlats.length === 0) return null;

  return (
    <section
      id={id}
      className="py-12 md:py-16 bg-background"
    >
      {/* ─────────────────────────────
         PRIMARY CONTENT
      ───────────────────────────── */}
      <div className="container max-w-4xl">
        {meta?.title && (
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
          />
        )}

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

      {/* ─────────────────────────────
         SECONDARY: WALKTHROUGH VIDEOS
      ───────────────────────────── */}
      {modelFlats.length > 0 && (
        <div className="mt-12">
          <div className="container mb-3">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Model Flat Walkthroughs
            </p>
          </div>

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
    </section>
  );
}
