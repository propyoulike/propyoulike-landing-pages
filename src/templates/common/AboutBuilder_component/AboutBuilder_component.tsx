// src/templates/common/AboutBuilder_component/AboutBuilder_component.tsx

/**
 * ============================================================
 * AboutBuilder Section
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Displays builder overview information
 * - Optional expandable content with stats
 *
 * ARCHITECTURAL GUARANTEES
 * ------------------------------------------------------------
 * - Render-safe during prerender + hydration
 * - NO required globals
 * - Analytics are OPTIONAL and lazy
 * - No router or navigation side-effects
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. PURE RENDER FIRST
 *    UI must render safely even if JS is partially unavailable
 *
 * 2. OPTIONAL SIDE-EFFECTS
 *    Analytics and observers must never crash rendering
 *
 * 3. ISOLATED RESPONSIBILITY
 *    This component never affects routing or layout
 *
 * ============================================================
 */

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
   SAFE GLOBAL HELPERS
------------------------------------------------------------------------*/
const isBrowser = typeof window !== "undefined";

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

  /* ------------------------------------------------------------
     View tracking (SAFE, OPTIONAL)
  ------------------------------------------------------------ */
  useEffect(() => {
    if (!isBrowser) return;
    if (!sectionRef.current) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewedOnce.current) return;
        viewedOnce.current = true;

        // Analytics must NEVER throw
        try {
          window.gtag?.("event", "builder_about_view", {
            builder: name,
          });
          window.fbq?.("trackCustom", "BuilderAboutViewed");
        } catch {
          // Silent fail — analytics must not break UI
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [name]);

  /* ------------------------------------------------------------
     Expand toggle
  ------------------------------------------------------------ */
  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next && isBrowser) {
      try {
        window.gtag?.("event", "builder_about_expand", {
          builder: name,
        });
        window.fbq?.("trackCustom", "BuilderAboutExpanded");
      } catch {}

      // Scroll only if DOM is ready
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

  const hasContent =
    !!description || !!descriptionExpanded || stats.length > 0;

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
