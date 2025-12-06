import {
  Building2,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CTAButtons from "@/components/CTAButtons";
import { useState, useRef, useEffect } from "react";

interface ConstructionTower {
  name: string;
  image: string;
  status?: string[];
  achieved?: string[];
  upcoming?: string[];
}

interface Props {
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
}: Props) {

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id={id} className="py-20 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Accordion List */}
        <div className="space-y-6">
          {updates.map((tower, i) => {
            const isOpen = expanded === i;

            return (
              <div
                key={i}
                className="bg-card rounded-2xl shadow p-6 transition-all"
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="flex w-full items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Building2 className="text-primary w-7 h-7" />
                    <h3 className="text-xl font-bold">{tower.name}</h3>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="text-primary" />
                  ) : (
                    <ChevronDown className="text-primary" />
                  )}
                </button>

                {/* Content */}
                {isOpen && (
                  <div className="mt-6 space-y-6 animate-accordion-down">

                    {/* Image */}
                    <div className="aspect-video">
                      <img
                        src={tower.image}
                        alt={tower.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Status */}
                    {tower.status?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Current Status</h4>
                        <ul className="list-disc pl-6 space-y-1">
                          {tower.status.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achieved */}
                    {tower.achieved?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="text-green-500 w-4 h-4" />
                          Achieved Milestones
                        </h4>
                        <ul className="list-disc pl-6 space-y-1">
                          {tower.achieved.map((a, idx) => (
                            <li key={idx}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Upcoming */}
                    {tower.upcoming?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Clock className="text-orange-500 w-4 h-4" />
                          Upcoming Milestones
                        </h4>
                        <ul className="list-disc pl-6 space-y-1">
                          {tower.upcoming.map((u, idx) => (
                            <li key={idx}>{u}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>
      </div>
    </section>
  );
}
