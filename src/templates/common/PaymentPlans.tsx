import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

interface PaymentPlansProps {
  sectionId?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;

  pricingTitle?: string;
  pricingComputation?: {
    title: string;
    points: string[];
  }[];

  scheduleTitle?: string;
  paymentSchedule?: {
    title: string;
    percentage: string;
    items?: string[];
  }[];

  ctaText?: string;

  onCtaClick: () => void;
}

const PaymentPlans = ({
  sectionId = "payment-plans",
  sectionTitle = "Pricing & Payment Plans",
  sectionSubtitle = "",
  pricingTitle = "Pricing Computation",
  pricingComputation = [],
  scheduleTitle = "Construction Payment Schedule",
  paymentSchedule = [],
  ctaText = "Get detailed pricing and payment breakdown",
  onCtaClick,
}: PaymentPlansProps) => {

  const [openPrice, setOpenPrice] = useState<number | null>(null);
  const [openStage, setOpenStage] = useState<number | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);

  // Animate vertical timeline
  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.setAttribute("data-visible", "true");
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={sectionId} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-5">
            {sectionTitle.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-primary">
              {sectionTitle.split(" ").slice(-2).join(" ")}
            </span>
          </h2>

          {sectionSubtitle && (
            <p className="text-muted-foreground text-lg">{sectionSubtitle}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* LEFT — Pricing */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{pricingTitle}</h3>

            <div className="space-y-4">
              {pricingComputation.map((item, i) => {
                const open = openPrice === i;
                return (
                  <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
                    <button
                      className="w-full flex justify-between"
                      onClick={() => setOpenPrice(open ? null : i)}
                    >
                      <span className="font-semibold text-lg">{item.title}</span>
                      {open ? (
                        <ChevronUp className="text-primary" />
                      ) : (
                        <ChevronDown className="text-primary" />
                      )}
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

          {/* RIGHT — Payment Schedule */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{scheduleTitle}</h3>

            <div className="relative pl-8">

              <div
                ref={lineRef}
                className="absolute top-0 left-2 w-1 bg-primary/20 rounded-full h-0 transition-all duration-1000 ease-out data-[visible=true]:h-full"
              />

              <div className="space-y-10">
                {paymentSchedule.map((stage, i) => {
                  const open = openStage === i;
                  const expandable = !!stage.items;
                  return (
                    <div key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                      <button
                        className="w-full flex items-center justify-between"
                        onClick={() => expandable ? setOpenStage(open ? null : i) : null}
                      >
                        <span className="text-lg font-semibold">{stage.title}</span>

                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">{stage.percentage}</span>
                          {expandable &&
                            (open ? (
                              <ChevronUp className="text-primary" />
                            ) : (
                              <ChevronDown className="text-primary" />
                            ))}
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
        <div className="mt-16 flex justify-center">
          <CTAButtons
            onFormOpen={onCtaClick}
            variant="compact"
            label={ctaText}
          />
        </div>
      </div>

    </section>
  );
};

export default PaymentPlans;
