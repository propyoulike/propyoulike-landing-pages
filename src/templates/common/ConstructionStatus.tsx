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
  updates?: ConstructionTower[];
  onCtaClick: () => void;
}

export default function ConstructionStatus({
  id = "construction",
  title = "Construction Progress",
  subtitle = "Stay updated with the work happening on-site.",
  updates = [],
  onCtaClick,
}: ConstructionStatusProps) {

  if (!Array.isArray(updates) || updates.length === 0) {
    return null;
  }

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.5 })]
  );

  const [expanded, setExpanded] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 bg-background scroll-mt-32"
    >
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* CAROUSEL */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {updates.map((tower, i) => {
              const isOpen = expanded === i;

              return (
                <div
                  key={i}
                  className="flex-[0_0_90%] md:flex-[0_0_55%] lg:flex-[0_0_40%]"
                >
                  <div
                    className="bg-card rounded-2xl overflow-hidden shadow-lg"
                  >
                    {/* IMAGE */}
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={tower.image}
                        alt={tower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">

                      {/* Title Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="text-primary w-7 h-7" />
                          <h3 className="text-xl font-bold">{tower.name}</h3>
                        </div>

                        <button
                          onClick={() => setExpanded(isOpen ? null : i)}
                          className="p-2 rounded-full hover:bg-muted"
                        >
                          {isOpen ? (
                            <ChevronUp className="text-primary" />
                          ) : (
                            <ChevronDown className="text-primary" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {isOpen && (
                        <div className="mt-4 space-y-6 bg-muted/40 p-4 rounded-xl border border-border">

                          {/* Status */}
                          {!!tower.status?.length && (
                            <div>
                              <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                                Current Status
                              </h4>
                              <ul className="mt-2 space-y-1 text-sm text-foreground/90 list-disc pl-5">
                                {tower.status.map((s, idx) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Achieved */}
                          {!!tower.achieved?.length && (
                            <div className="pt-3 border-t border-border">
                              <h4 className="text-sm font-semibold flex items-center gap-2 text-green-600">
                                Achieved Milestones
                              </h4>
                              <ul className="mt-2 space-y-1 text-sm text-foreground/90 list-disc pl-5">
                                {tower.achieved.map((a, idx) => (
                                  <li key={idx}>{a}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Upcoming */}
                          {!!tower.upcoming?.length && (
                            <div className="pt-3 border-t border-border">
                              <h4 className="text-sm font-semibold flex items-center gap-2 text-orange-500">
                                Upcoming Milestones
                              </h4>
                              <ul className="mt-2 space-y-1 text-sm text-foreground/90 list-disc pl-5">
                                {tower.upcoming.map((u, idx) => (
                                  <li key={idx}>{u}</li>
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
