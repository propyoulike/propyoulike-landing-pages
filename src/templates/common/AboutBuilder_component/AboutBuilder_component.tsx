import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ✅ Analytics */
import { track } from "@/lib/tracking/track";
import { EventName } from "@/lib/analytics/events";
import { SectionId } from "@/lib/analytics/sectionIds";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface StatItem {
  icon?: string;
  label?: string;
  value?: string;
}

interface BuilderAboutProps {
  id?: SectionId;
  meta?: SectionMeta;

  /** Analytics identifiers (flat, injected by ProjectRenderer) */
  builder_id?: string;
  project_id?: string;

  description?: string;
  descriptionExpanded?: string;
  stats?: StatItem[];
}

/* ---------------------------------------------------------------------
   SAFE GLOBAL HELPERS
------------------------------------------------------------------------*/
const isBrowser = typeof window !== "undefined";

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
/**
 * ⚠️ CONTRACT
 * ------------------------------------------------------------
 * - NO ProjectContext
 * - Flat props only
 * - Analytics identifiers are optional & fail-safe
 */
export default function AboutBuilder_component({
  id = SectionId.AboutBuilder,

  meta = {
    eyebrow: "BUILDER",
    title: "About the developer",
    subtitle:
      "Track record, values, and experience behind this project",
  },

  builder_id,
  project_id,

  description,
  descriptionExpanded,
  stats = [],
}: BuilderAboutProps) {
  const [expanded, setExpanded] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);
  const viewedOnce = useRef(false);

  const hasContent =
    !!description || !!descriptionExpanded || stats.length > 0;

  /* ------------------------------------------------------------
     VIEW TRACKING (CANONICAL, FAIL-SAFE)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!isBrowser) return;
    if (!hasContent) return;
    if (!builder_id || !project_id) return;
    if (!sectionRef.current) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewedOnce.current) return;

        viewedOnce.current = true;

        track(EventName.SectionView, {
          section_id: SectionId.AboutBuilder,
          builder_id,
          project_id,
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasContent, builder_id, project_id]);

  /* ------------------------------------------------------------
     Expand toggle (CANONICAL)
  ------------------------------------------------------------ */
  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next && builder_id && project_id) {
      track(EventName.CTAInteraction, {
        section_id: SectionId.AboutBuilder,
        builder_id,
        project_id,
        source_item: "expand_builder_about",
      });

      requestAnimationFrame(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  /* ------------------------------------------------------------
     Icon resolver (SAFE)
  ------------------------------------------------------------ */
  const resolveIcon = (icon?: string) =>
    (Icons as any)[icon || ""] || Icons.Circle;

  if (!hasContent) return null;

  /* ------------------------------------------------------------
     Render
  ------------------------------------------------------------ */
  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      <div ref={sectionRef}>
        {description && (
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            {description}
          </p>
        )}

        <div
          ref={expandedRef}
          className={`transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden ${
            expanded
              ? "max-h-[4000px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          {descriptionExpanded && (
            <div className="text-muted-foreground whitespace-pre-line max-w-4xl mx-auto mb-10">
              {descriptionExpanded}
            </div>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {stats.map((s, i) => {
                const Icon = resolveIcon(s.icon);
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-card border border-border text-center shadow-sm"
                  >
                    <Icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                    <div className="text-xl font-semibold">
                      {s.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(descriptionExpanded || stats.length > 0) && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleExpand}
            >
              {expanded ? "Show less" : "Read more"}
            </Button>
          </div>
        )}
      </div>
    </BaseSection>
  );
}
