import { useEffect, useRef, useMemo } from "react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";
import ModelVideos from "./ModelVideos";

interface HighlightItem {
  icon?: string;
  label?: string;
  value?: string;
}

interface ProjectSummaryProps {
  title?: string;
  subtitle?: string;
  description?: string;
  highlights?: HighlightItem[];
  modelFlats?: { title: string; id: string }[];
  onCtaClick: () => void;
}

export default function ProjectSummary({
  title,
  subtitle,
  description,
  highlights = [],
  modelFlats = [],
  onCtaClick,
}: ProjectSummaryProps) {
  
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* ---------------- TRACK EVENTS (Consolidated + Safe) ---------------- */
  const fireAnalytics = (name: string, payload: Record<string, any> = {}) => {
    window.gtag?.("event", name, payload);
    window.fbq?.("trackCustom", name, payload);
  };

  const trackView = () => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    fireAnalytics("ProjectSummaryViewed", { section: "Project Summary" });
  };

  const handleCtaClick = () => {
    fireAnalytics("ProjectSummaryCTA");
    onCtaClick();
  };

  /* ---------------- INTERSECTION OBSERVER ---------------- */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && (trackView(), observer.disconnect()),
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------------- MEMOIZED HIGHLIGHTS ---------------- */
  const highlightCards = useMemo(() => {
    return highlights.map((item, i) => {
      const IconComponent =
        item.icon && item.icon in Icons
          ? (Icons as any)[item.icon]
          : Icons.Circle;

      return (
        <Card
          key={i}
          className="
            p-6 text-center rounded-2xl 
            border bg-card/60 backdrop-blur 
            hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300
          "
        >
          <div className="flex justify-center mb-4">
            <IconComponent className="w-12 h-12 text-primary opacity-90" />
          </div>

          <h3 className="font-semibold text-foreground text-lg mb-1">
            {item.label}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.value}
          </p>
        </Card>
      );
    });
  }, [highlights]);

  /* ---------------- RENDER ---------------- */
  return (
    <section
      id="project-summary"
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">

          {/* TITLE BLOCK */}
          <header className="text-center mb-16">
            {title && (
              <h2
                className="
                  text-3xl lg:text-5xl font-bold tracking-tight 
                  text-foreground mb-4
                "
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </header>

          {/* HIGHLIGHTS */}
          {highlights.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {highlightCards}
            </div>
          )}

          {/* DESCRIPTION */}
          {description && (
            <article
              className="
                prose prose-lg max-w-none 
                text-muted-foreground mx-auto text-center
              "
            >
              {description}
            </article>
          )}

          {/* MODEL VIDEOS */}
          {modelFlats?.length > 0 && (
            <div className="mt-20 mb-16">
              <ModelVideos modelFlats={modelFlats} />
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 flex justify-center">
            <CTAButtons onFormOpen={handleCtaClick} variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
