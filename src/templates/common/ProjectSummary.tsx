import { useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";

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
  onCtaClick: () => void;
}

const ProjectSummary = ({
  title,
  subtitle,
  description,
  highlights = [],
  onCtaClick,
}: ProjectSummaryProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* ---------------- TRACK EVENTS ---------------- */
  const trackView = () => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    window.gtag?.("event", "section_view", {
      event_category: "engagement",
      event_label: "ProjectSummary Section",
    });

    window.fbq?.("trackCustom", "ProjectSummaryViewed");
  };

  const handleCtaClick = () => {
    window.gtag?.("event", "cta_click_projectsummary");
    window.fbq?.("track", "Lead");
    onCtaClick();
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackView();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  /* ---------------- RENDER ---------------- */

  return (
    <section
      id="project-summary"
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* HIGHLIGHTS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {highlights.map((item, index) => {
              const IconComponent =
                Icons[item.icon as keyof typeof Icons] ?? Icons.Circle;

              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.value}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* DESCRIPTION */}
          {description && (
            <div className="prose prose-lg max-w-none text-muted-foreground text-center lg:text-left">
              {description}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <CTAButtons onFormOpen={handleCtaClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSummary;
