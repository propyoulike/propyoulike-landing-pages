import CTAButtons from "@/components/CTAButtons";
import PricingBlockList from "./PricingBlockList";
import PaymentScheduleTimeline from "./PaymentScheduleTimeline";

export default function PaymentPlans_component({
  sectionId = "payment-plans",
  sectionTitle = "Pricing & Payment Plans",
  sectionSubtitle = "",
  pricingTitle = "Pricing Computation",
  pricingComputation = [],
  scheduleTitle = "Construction Payment Schedule",
  paymentSchedule = [],
  ctaText = "Get detailed pricing and payment breakdown",
  onCtaClick,
}) {
  return (
    <section id={sectionId} className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-6xl font-extrabold mb-5">
            {sectionTitle}
          </h2>

          {sectionSubtitle && (
            <p className="text-muted-foreground text-lg">{sectionSubtitle}</p>
          )}
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-14">

          {/* LEFT — Pricing */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{pricingTitle}</h3>
            <PricingBlockList blocks={pricingComputation} />
          </div>

          {/* RIGHT — Payment Schedule */}
          <div>
            <h3 className="text-2xl font-bold mb-6">{scheduleTitle}</h3>
            <PaymentScheduleTimeline stages={paymentSchedule} />
          </div>

        </div>

      {/* ------------ CTA (Global Component) ------------ */}
      {onCtaClick && (
        <div className="container max-w-4xl mt-10">
          <CTAButtons onPrimaryClick={onCtaClick} />
        </div>
      )}

      </div>
    </section>
  );
}
