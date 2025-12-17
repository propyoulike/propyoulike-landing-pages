// src/templates/common/AboutBuilder_component/AboutBuilder_component.tsx

import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

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
  name?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  descriptionExpanded?: string;
  stats?: StatItem[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function AboutBuilder_component({
  id = "about-builder",
  name,
  title,
  subtitle,
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

          window?.gtag?.("event", "builder_about_view");
          window?.fbq?.("trackCustom", "BuilderAboutViewed");
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------------- Expand ---------------- */
  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next) {
      window?.gtag?.("event", "builder_about_expand");
      window?.fbq?.("trackCustom", "BuilderAboutExpanded");

      setTimeout(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  };

  const resolveIcon = (icon?: string) =>
    (Icons as any)[icon || ""] || Icons.Circle;

  if (!title && !description && !descriptionExpanded && !stats.length) {
    return null;
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-16 lg:py-24 scroll-mt-24 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          {name && (
            <p className="text-xs tracking-[0.15em] uppercase text-primary">
              {name}
            </p>
          )}

          {title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Short description */}
        {description && (
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10">
            {description}
          </p>
        )}

        {/* Expanded */}
        <div
          ref={expandedRef}
          className={`transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden ${
            expanded ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          {descriptionExpanded && (
            <div className="text-lg text-muted-foreground whitespace-pre-line max-w-4xl mx-auto mb-12">
              {descriptionExpanded}
            </div>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-12">
              {stats.map((s, i) => {
                const Icon = resolveIcon(s.icon);
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-card border border-border text-center shadow-sm"
                  >
                    <Icon className="w-10 h-10 text-primary mb-3 mx-auto" />
                    <div className="text-2xl font-semibold">{s.value}</div>
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
          <div className="text-center mt-6">
            <Button variant="outline" size="lg" onClick={toggleExpand}>
              {expanded ? "Show Less" : "Read More"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
