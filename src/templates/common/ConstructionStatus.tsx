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
import { useState } from "react";

interface ConstructionTower {
  name: string;
  image: string;
  status?: string[];
  achieved?: string[];
  upcoming?: string[];
}

interface ConstructionStatusProps {
  updates: ConstructionTower[];
  onCtaClick: () => void;
}

export default function ConstructionStatus({
  updates = [],
  onCtaClick,
}: ConstructionStatusProps) {
  if (!updates.length) return null;

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.5 })]
  );

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-20 bg-background scroll-mt-32">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Construction Progress
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the work happening on-site.
          </p>
        </div>

        {/* CAROUSEL */}
        <div className="overflow-visible mb-12" ref={emblaRef}>
          <div className="flex gap-6 overflow-visible">
            {updates.map((tower, i) => {
              const isOpen = expanded === i;

              return (
                <div
                  key={i}
                  className="flex-[0_0_90%] md:flex-[0_0_55%] lg:flex-[0_0_40%] self-start"
                >
                  <div
                    className="bg-card rounded-2xl shadow overflow-hidden"
                    style={{ boxShadow: "var(--shadow-strong)" }}
                  >
                    {/* IMAGE */}
                    <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                      <img
                        src={tower.image}
                        alt={tower.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="p-6">
                      {/* Header Row */}
                      <button
                        onClick={() => setExpanded(isOpen ? null : i)}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="text-primary w-7 h-7" />
                          <h3 className="text-xl font-bold">{tower.name}</h3>
                        </div>

                        {isOpen ? (
                          <ChevronUp className="text-primary" />
                        ) : (
                          <ChevronDown className="text-primary" />
                        )}
                      </button>

                      {/* PANEL */}
                      {isOpen && (
                        <div className="mt-6 space-y-6 text-sm">

                          {/* STATUS */}
                          {tower.status?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-1">
                                Current Status
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {tower.status.map((s, idx) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* ACHIEVED */}
                          {tower.achieved?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-1 flex items-center gap-2">
                                <CheckCircle2 className="text-green-500 w-4 h-4" />
                                Achieved Milestones
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {tower.achieved.map((a, idx) => (
                                  <li key={idx}>{a}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* UPCOMING */}
                          {tower.upcoming?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-1 flex items-center gap-2">
                                <Clock className="text-orange-500 w-4 h-4" />
                                Upcoming Milestones
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
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
