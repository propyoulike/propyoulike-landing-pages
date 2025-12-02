import { Building2, Users, Award, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CTAButtons from "@/components/CTAButtons";

export interface StatItem {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface AboutSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  expandedContent?: string[];
  stats?: StatItem[];
  additionalInfo?: {
    heading: string;
    content: string;
  };
  onCtaClick?: () => void;
}

const AboutSection = ({
  title,
  subtitle,
  description,
  expandedContent = [],
  stats = [],
  additionalInfo,
  onCtaClick,
}: AboutSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  // ---------- Tracking ----------
  const trackView = () => {
    if (!hasTrackedView.current) {
      hasTrackedView.current = true;
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "section_view", {
          event_category: "engagement",
          event_label: "AboutSection",
        });
      }
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("trackCustom", "AboutSectionViewed");
      }
    }
  };

  const trackExpand = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "section_expand", {
        event_category: "engagement",
        event_label: "AboutSectionExpanded",
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "AboutSectionExpanded");
    }
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

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) trackExpand();
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
              {title} {subtitle && <span className="text-primary">{subtitle}</span>}
            </h2>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>

          {isExpanded && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                {expandedContent.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-muted/50 rounded-xl">
                      <stat.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {additionalInfo && (
                <div className="p-8 bg-muted/50 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {additionalInfo.heading}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{additionalInfo.content}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={handleExpandClick}
              className="rounded-full font-semibold"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-5 w-5" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-5 w-5" />
                  Read More
                </>
              )}
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 text-center">
            <CTAButtons onFormOpen={onCtaClick} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
