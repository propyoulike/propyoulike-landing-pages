import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import PricingBlockList from "./PricingBlockList";
import PaymentScheduleTimeline from "./PaymentScheduleTimeline";

export default function PaymentPlans_component({
  sectionId = "payment-plans",
  sectionTitle = "Pricing & Payment Plans",
  sectionSubtitle,
  pricingTitle = "Pricing Computation",
  pricingComputation = [],
  scheduleTitle = "Construction Payment Schedule",
  paymentSchedule = [],
}) {
  const { openCTA } = useLeadCTAContext();

  if (!pricingComputation.length && !paymentSchedule.length) return null;

  return (
    <section
      id={sectionId}
      className="py-20 lg:py-28 bg-background scroll-mt-32"
    >
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            {sectionTitle}
          </h2>

          {sectionSubtitle && (
            <p className="text-muted-foreground text-lg">
              {sectionSubtitle}
            </p>
          )}
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Pricing */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              {pricingTitle}
            </h3>
            <PricingBlockList blocks={pricingComputation} />
          </div>

          {/* Payment Schedule */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              {scheduleTitle}
            </h3>
            <PaymentScheduleTimeline stages={paymentSchedule} />
          </div>

        </div>

        {/* SINGLE, TRUST-LED CTA */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="rounded-xl px-10 font-semibold"
            onClick={() =>
              openCTA({
                source: "section",
                label: "Pricing – Get Detailed Breakdown",
              })
            }
          >
            Get Detailed Pricing & Payment Breakup
          </Button>
        </div>

      </div>
    </section>
  );
}
