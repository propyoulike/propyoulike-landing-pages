import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

export interface PriceComponent {
  title: string;
  points: string[];
}

export interface PaymentStage {
  title: string;
  percentage: string;
  expandable?: boolean;
  items?: string[];
}

export interface PaymentPlansProps {
  onCtaClick: () => void;
  priceComponents: PriceComponent[];
  paymentSchedule: PaymentStage[];
  heading?: string;
  subheading?: string;
  sectionId?: string;
}

/* ----------------------------------------------------
   TRACKING HELPERS
---------------------------------------------------- */
const trackGA = (event: string, label: string) => {
  if (typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, {
      event_category: "engagement",
      event_label: label,
    });
  }
};

const trackMeta = (event: string, label: string) => {
  if (typeof (window as any).fbq === "function") {
    (window as any).fbq("trackCustom", event, { label });
  }
};

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function PaymentPlans({
  onCtaClick,
  priceComponents,
  paymentSchedule,
  heading = "Pricing & Payment Plans",
  subheading = "Transparent costing • Milestone-based • RERA compliant",
  sectionId = "payment-plans",
}: PaymentPlansProps) {
  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  // Animate vertical timeline
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.classList.add("timeline-grow");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  // Track section view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          trackGA("section_view", `${sectionId} Section`);
          trackMeta(`${sectionId}Viewed`, `${sectionId} Section`);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionId]);

  return (
    <section id={sectionId} ref={sectionRef} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-5">
            {heading.split(" ").map((word, i) =>
              i === heading.split(" ").length - 1 ? (
                <span key={i} className="text-primary">{word}</span>
              ) : word + " "
            )}
          </h2>
          <p className="text-muted-foreground text-lg">{subheading}</p>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="grid lg:grid-cols-2 gap-14">

          {/* LEFT COLUMN — PRICING */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Pricing Computation</h3>
            <div className="space-y-4">
              {priceComponents.map((item, i) => {
                const open = openPrice === i;
                return (
                  <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                    <button
                      className="w-full flex justify-between"
                      onClick={() => setOpenPrice(open ? null : i)}
                    >
                      <span className="font-semibold text-lg">{item.title}</span>
                      {open ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-primary" />}
                    </button>

                    {open && (
                      <ul className="mt-4 space-y-2 text-muted-foreground">
                        {item.points.map((p, idx) => (
                          <li key={idx} className="flex gap-2">
                            <CheckCircle className="text-primary w-4 h-4 mt-1" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN — PAYMENT SCHEDULE */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Construction Payment Schedule</h3>

            <div className="relative pl-8">
              {/* Vertical animated line */}
              <div ref={lineRef} className="absolute top-0 left-2 w-1 bg-primary/20 rounded-full timeline-line"></div>

              <div className="space-y-10">
                {paymentSchedule.map((stage, i) => {
                  const open = openStage === i;
                  return (
                    <div key={i} className="relative fade-stage">
                      <button
                        className="w-full flex items-center justify-between"
                        onClick={() => stage.expandable ? setOpenStage(open ? null : i) : null}
                      >
                        <span className="text-lg font-semibold">{stage.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">{stage.percentage}</span>
                          {stage.expandable &&
                            (open ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-primary" />)}
                        </div>
                      </button>

                      {open && stage.items && (
                        <ul className="mt-4 space-y-2 text-muted-foreground ml-1">
                          {stage.items.map((p, idx) => (
                            <li key={idx} className="flex gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-1" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <CTAButtons onFormOpen={onCtaClick} />
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .timeline-line {
          height: 0%;
          transition: height 1.4s ease-out;
        }
        .timeline-grow {
          height: 100%;
        }
        .fade-stage {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUpStage 0.6s forwards ease-out;
        }
        @keyframes fadeUpStage {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
