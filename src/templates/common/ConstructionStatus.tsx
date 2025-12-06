import {
  Building2,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import CTAButtons from "@/components/CTAButtons";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState, useRef } from "react";

interface ConstructionTower {
  name: string;
  image: string;
  status?: string[];
  achieved?: string[];
  upcoming?: string[];
}

interface ConstructionStatusProps {
  id?: string;
  title?: string;
  subtitle?: string;
  updates: ConstructionTower[];
  onCtaClick: () => void;
}

export default function ConstructionStatus({
  id = "construction",
  title = "Construction Progress",
  subtitle = "Stay updated with the work happening on-site.",
  updates = [],
  onCtaClick,
}: ConstructionStatusProps) {
  if (!updates.length) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.5 })]
  );

  const [expanded, setExpanded] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* Track Section View */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasTrackedView.current && entries[0].isIntersecting) {
          hasTrackedView.current = true;
          window?.dataLayer?.push({
            event: "section_view",
            section: id,
          });
          window?.fbq?.("trackCustom", "ConstructionStatusViewed");
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Toggle Panel */
  const handleToggle = (i: number, name: string) => {
    const newExpanded = expanded === i ? null : i;
    setExpanded(newExpanded);

    // Recalculate embla layout so height expands correctly
    setTimeout(() => {
      emblaApi?.reInit();
    }, 50);

    window?.dataLayer?.push({
      event: "tower_expand",
      tower: name,
    });

    window?.fbq?.("trackCustom", "TowerExpanded", { tower: name });
  };

  return (
    <section id={id} ref={sectionRef} className="py-20 lg:py-28 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Carousel */}
        <div className="mb-12 overflow-visible" ref={emblaRef}>
          <div className="flex gap-6 overflow-visible">
            {updates.map((tower, i) => {
              const isOpen = expanded === i;

              return (
                <div
                  key={i}
                  className="flex-[0_0_90%] md:flex-[0_0_55%] lg:flex-[0_0_40%] self-start"
                >
                  <div
                    className="bg-card rounded-2xl"
                    style={{ boxShadow: "var(--shadow-strong)" }}
                  >
                    <div className="aspect-video bg-muted">
                      <img
                        src={tower.image}
                        alt={tower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-primary w-7 h-7" />
                          <h3 className="text-xl font-bold">{tower.name}</h3>
                        </div>

                        <button
                          onClick={() => handleToggle(i, tower.name)}
                          className="p-2 rounded-full hover:bg-muted"
                        >
                          {isOpen ? (
                            <ChevronUp className="text-primary" />
                          ) : (
                            <ChevronDown className="text-primary" />
                          )}
                        </button>
                      </div>

                      {/* Panel */}
                      {isOpen && (
                        <div className="space-y-6 animate-accordion-down">

                          {/* Status */}
                          {tower.status && tower.status.length > 0 && (
                            <div>
                              <h4 className="text-sm text-muted-foreground uppercase mb-2">
                                Current Status
                              </h4>
                              <ul className="space-y-1">
                                {tower.status.map((s, idx) => (
                                  <li key={idx} className="text-sm">
                                    • {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Achieved */}
                          {tower.achieved && tower.achieved.length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="text-green-600 w-4 h-4" />
                                <h4 className="text-xs uppercase text-muted-foreground">
                                  Achieved Milestones
                                </h4>
                              </div>
                              <ul className="space-y-1">
                                {tower.achieved.map((a, idx) => (
                                  <li key={idx} className="text-sm">
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Upcoming */}
                          {tower.upcoming && tower.upcoming.length > 0 && (
                            <div className="border-t pt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="text-orange-600 w-4 h-4" />
                                <h4 className="text-xs uppercase text-muted-foreground">
                                  Upcoming Milestones
                                </h4>
                              </div>
                              <ul className="space-y-1">
                                {tower.upcoming.map((u, idx) => (
                                  <li key={idx} className="text-sm">
                                    {u}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>
      </div>
    </section>
  );
}
