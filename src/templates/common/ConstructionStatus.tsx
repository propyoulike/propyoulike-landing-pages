import { Building2, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import CTAButtons from "./CTAButtons";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState, useRef } from "react";

export interface TowerItem {
  name: string;
  image: string;
  status: string[];
  achieved: string[];
  upcoming: string[];
}

export interface ConstructionStatusProps {
  onCtaClick: () => void;
  towers: TowerItem[];
  heading?: string;
  subheading?: string;
  sectionId?: string;
  phaseLabel?: string;
}

export default function ConstructionStatus({
  onCtaClick,
  towers,
  heading = "Here’s How Your Future Home is Shaping Up",
  subheading = "Track the real-time progress of construction. Transparency you can trust.",
  sectionId = "constructionstatus",
  phaseLabel = "PHASE IV",
}: ConstructionStatusProps) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.5 })]
  );

  const [expandedTower, setExpandedTower] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  // Track section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "section_view", {
              event_category: "engagement",
              event_label: `${sectionId} Section`,
            });
          }
          if (typeof (window as any).fbq === "function") {
            (window as any).fbq("trackCustom", `${sectionId}Viewed`);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionId]);

  const handleTowerClick = (name: string) => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "tower_click", {
        event_category: "engagement",
        event_label: name,
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "TowerExpanded", { tower: name });
    }
  };

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {phaseLabel && (
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {phaseLabel}
            </div>
          )}
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {heading.split(" ").map((word, i) =>
              i === heading.split(" ").length - 1 ? (
                <span key={i} className="text-primary">{word}</span>
              ) : word + " "
            )}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{subheading}</p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {towers.map((tower, index) => {
              const isExpanded = expandedTower === index;
              return (
                <div key={index} className="flex-[0_0_90%] md:flex-[0_0_60%] lg:flex-[0_0_45%]">
                  <div className="bg-card rounded-2xl overflow-hidden h-full" style={{ boxShadow: "var(--shadow-strong)" }}>
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={tower.image}
                        alt={`${tower.name} Construction Progress`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-8 h-8 text-primary" />
                          <h3 className="text-xl font-bold text-foreground">{tower.name}</h3>
                        </div>

                        <button
                          onClick={() => {
                            setExpandedTower(isExpanded ? null : index);
                            handleTowerClick(tower.name);
                          }}
                          aria-expanded={isExpanded}
                          className="p-2 hover:bg-muted rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="animate-accordion-down space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Tower Status</h4>
                            <ul className="space-y-2">
                              {tower.status.map((item, i) => (
                                <li key={i} className="text-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span className="text-sm">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-border pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Milestones Achieved</h4>
                            </div>
                            <ul className="space-y-1">
                              {tower.achieved.map((item, i) => (
                                <li key={i} className="text-sm text-foreground">{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t border-border pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Upcoming Milestones</h4>
                            </div>
                            <ul className="space-y-1">
                              {tower.upcoming.map((item, i) => (
                                <li key={i} className="text-sm text-foreground">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CTAButtons onFormOpen={onCtaClick} />
      </div>
    </section>
  );
}
