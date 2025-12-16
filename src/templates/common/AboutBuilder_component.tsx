// src/templates/common/BuilderAbout.tsx

import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import CTAButtons from "@/components/CTAButtons";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";

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
  builderProjects?: any[];
  onCtaClick?: () => void;
}

/* ---------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------------*/
const BuilderAbout = ({
  id = "about-builder",
  name,
  title,
  subtitle,
  description,
  descriptionExpanded,
  stats = [],
  builderProjects = [],
  onCtaClick,
}: BuilderAboutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* Tracking */
  const trackView = () => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      window.gtag?.("event", "builder_about_view");
      window.fbq?.("trackCustom", "BuilderAboutViewed");
    }
  };

  const trackExpand = () => {
    window.gtag?.("event", "builder_about_expand");
    window.fbq?.("trackCustom", "BuilderAboutExpanded");
  };

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);

    if (next) {
      trackExpand();
      setTimeout(() => {
        expandedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  };

  /* Observer */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Icon resolver */
  const resolveIcon = (iconName?: string) =>
    (Icons as any)[iconName || ""] || Icons.Circle;

  /* ---------------------------------------------------------------------
     RENDER
  ----------------------------------------------------------------------*/
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-16 lg:py-24 scroll-mt-24 relative bg-gradient-to-b from-background via-background to-background/60"
    >
      <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none 
      bg-[radial-gradient(circle_at_top,rgba(0,58,112,0.12),transparent_70%)]" />

      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {name && (
            <p className="text-xs sm:text-sm tracking-[0.15em] font-semibold uppercase text-primary">
              {name}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Short description */}
        {description && (
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-10 animate-in fade-in">
            {description}
          </p>
        )}

        {/* CTA mobile */}
        <div className="mb-10 flex justify-center lg:hidden">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>

        {/* EXPANDED CONTENT */}
        <div
          ref={expandedRef}
          className={`transition-all duration-700 ease-in-out overflow-hidden ${
            isExpanded
              ? "max-h-[5000px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          {/* Full description */}
          {descriptionExpanded && (
            <div className="space-y-8 text-lg leading-relaxed text-muted-foreground whitespace-pre-line animate-in fade-in">
              {descriptionExpanded}
            </div>
          )}

          {/* Stats Grid */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-12 animate-in fade-in">
              {stats.map((s, i) => {
                const Icon = resolveIcon(s.icon);

                return (
                  <div
                    key={i}
                    className="
                      group p-6 rounded-2xl bg-white/60 dark:bg-white/10 
                      border border-gray-200/40 dark:border-white/10 
                      shadow-md backdrop-blur-xl 
                      flex flex-col items-center text-center 
                      transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <Icon className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-2xl font-semibold">{s.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ⭐ ALL PROJECTS BELOW METRICS ⭐ */}
          {isExpanded && builderProjects.length > 0 && (
            <div className="mt-12 animate-in fade-in duration-700">
              <BuilderOtherProjects projects={builderProjects} />
            </div>
          )}
        </div>

        {/* Read more */}
        <div className="text-center mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={toggleExpand}
            className="rounded-full px-8 py-5 font-semibold hover:scale-[1.05] transition"
          >
            {isExpanded ? (
              <>
                <Icons.ChevronUp className="w-5 h-5 mr-2" /> Show Less
              </>
            ) : (
              <>
                <Icons.ChevronDown className="w-5 h-5 mr-2" /> Read More
              </>
            )}
          </Button>
        </div>

        {/* CTA desktop */}
        <div className="mt-14 hidden lg:flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>
      </div>
    </section>
  );
};

export default BuilderAbout;
