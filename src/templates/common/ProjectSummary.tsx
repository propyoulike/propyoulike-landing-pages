import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import CTAButtons from "./CTAButtons";

interface Highlight {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
}

interface ProjectSummaryProps {
  title: string;
  highlightedName?: string; // optional highlighted part of title
  description: string;
  highlights: Highlight[];
  onCtaClick: () => void;
}

const ProjectSummary = ({
  title,
  highlightedName,
  description,
  highlights,
  onCtaClick,
}: ProjectSummaryProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  // ---------- GA / Meta Tracking ----------
  const trackView = () => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;

      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "section_view", {
          event_category: "engagement",
          event_label: "ProjectSummary Section",
        });
      }
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("trackCustom", "ProjectSummaryViewed");
      }
    }
  };

  const handleCtaClick = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "cta_click_projectsummary", { section: "ProjectSummary" });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead");
    }
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

  return (
    <section id="projectsummary" ref={sectionRef} className="py-20 lg:py-28 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
              {title} {highlightedName && <span className="text-primary">{highlightedName}</span>}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {highlights.map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-foreground mb-2">{item.label}</h3>
                <p className="text-muted-foreground text-sm">{item.value}</p>
              </Card>
            ))}
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-center lg:text-left">{description}</p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 text-center">
            <CTAButtons onFormOpen={handleCtaClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectSummary;
