// src/templates/common/AboutBuilder_component/AboutBuilder_component.tsx

import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface StatItem {
  icon?: string;
  label?: string;
  value?: string;
}

interface BuilderAboutProps {
  id?: string;
  meta?: SectionMeta;
  name?: string;
  description?: string;
  descriptionExpanded?: string;
  stats?: StatItem[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function AboutBuilder_component({
  id = "about-builder",

  meta = {
    eyebrow: "BUILDER",
    title: "About the developer",
    subtitle:
      "Track record, values, and experience behind this project",
  },

  name,
  description,
  descriptionExpanded,
  stats = [],
}: BuilderAboutProps) {
  const [expanded, setExpanded] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);
  const viewedOnce = useRef(false);

  /* ---------------- View tracking ---------------- */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewedOnce.current) {
          viewedOnce.current = true;

          window?.gtag?.("event", "builder_about_view", {
            builder: name,
          });

          window?.fbq?.("trackCustom", "BuilderAboutViewed");
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [name]);

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next) {
      window?.gtag?.("event", "builder_about_expand", {
        builder: name,
      });

      window?.fbq?.("trackCustom", "BuilderAboutExpanded");

      setTimeout(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  };

  const resolveIcon = (icon?: string) =>
    (Icons as any)[icon || ""] || Icons.Circle;

  const hasContent =
    description || descriptionExpanded || stats.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      <div ref={sectionRef}>

        {/* Short description */}
        {description && (
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8">
            {description}
          </p>
        )}

        {/* Expanded content */}
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

        {/* Toggle */}
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
