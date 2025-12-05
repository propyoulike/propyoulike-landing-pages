import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import CTAButtons from "@/components/CTAButtons";

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
  onCtaClick?: () => void;
}

const BuilderAbout = ({
  id = "about-builder",
  name,
  title,
  subtitle,
  description,
  descriptionExpanded,
  stats = [],
  onCtaClick,
}: BuilderAboutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* ---------------- Tracking ---------------- */
  const trackView = () => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;

      window.gtag?.("event", "section_view", {
        event_category: "engagement",
        event_label: "BuilderAbout",
      });

      window.fbq?.("trackCustom", "BuilderAboutViewed");
    }
  };

  const trackExpand = () => {
    window.gtag?.("event", "builder_about_expand");
    window.fbq?.("trackCustom", "BuilderAboutExpanded");
  };

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
    if (!isExpanded) trackExpand();
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

  /* ---------------- Render ---------------- */

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background scroll-mt-32"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">

          {title && (
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {description && (
          <p className="text-muted-foreground text-lg leading-relaxed text-center lg:text-left max-w-4xl mx-auto mb-10">
            {description}
          </p>
        )}

        {/* Expanded Content */}
        {isExpanded && descriptionExpanded && (
          <div className="animate-in fade-in duration-300 max-w-4xl mx-auto mb-10">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {descriptionExpanded}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
              {stats.map((s, i) => {
                const Icon =
                  Icons[s.icon as keyof typeof Icons] ?? Icons.Circle;

                return (
                  <div
                    key={i}
                    className="text-center p-6 bg-muted/50 rounded-xl"
                  >
                    <Icon className="w-10 h-10 mx-auto text-primary mb-3" />
                    <div className="text-2xl font-semibold text-foreground">
                      {s.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expand Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleExpandToggle}
            className="rounded-full"
          >
            {isExpanded ? (
              <>
                <Icons.ChevronUp className="mr-2 h-5 w-5" /> Show Less
              </>
            ) : (
              <>
                <Icons.ChevronDown className="mr-2 h-5 w-5" /> Read More
              </>
            )}
          </Button>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <CTAButtons onFormOpen={onCtaClick} />
        </div>
      </div>
    </section>
  );
};

export default BuilderAbout;
