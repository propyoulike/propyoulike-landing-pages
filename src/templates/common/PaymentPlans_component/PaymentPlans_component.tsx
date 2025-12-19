// src/templates/common/PaymentPlans/PaymentPlans_component.tsx

import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

import PricingBlockList from "./PricingBlockList";
import PaymentScheduleTimeline from "./PaymentScheduleTimeline";

import SectionHeader from "../SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface PaymentPlansProps {
  id?: string;

  /** Canonical section meta */
  meta?: SectionMeta;

  /** Pricing computation */
  pricingTitle?: string;
  pricingComputation?: any[];

  /** Payment schedule */
  scheduleTitle?: string;
  paymentSchedule?: any[];
}

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function PaymentPlans_component({
  id = "payment-plans",

  meta = {
    eyebrow: "PRICING",
    title: "Pricing & payment plans",
    subtitle:
      "Understand total cost, stage-wise payments, and what you pay when",
    tagline:
      "No surprises — full clarity before you decide",
  },

  pricingTitle = "Pricing computation",
  pricingComputation = [],

  scheduleTitle = "Construction-linked payment schedule",
  paymentSchedule = [],
}: PaymentPlansProps) {
  const { openCTA } = useLeadCTAContext();

  if (
    !pricingComputation.length &&
    !paymentSchedule.length
  ) {
    return null;
  }

  return (
    <section
      id={id}
      className="py-12 md:py-16 bg-background scroll-mt-32"
    >
      <div className="container max-w-6xl">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        <div className="mb-12">
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
            align="center"
          />
        </div>

        {/* ─────────────────────────────
           CONTENT GRID
        ───────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Pricing computation */}
          {pricingComputation.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">
                {pricingTitle}
              </h3>
              <PricingBlockList
                blocks={pricingComputation}
              />
            </div>
          )}

          {/* Payment schedule */}
          {paymentSchedule.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-6">
                {scheduleTitle}
              </h3>
              <PaymentScheduleTimeline
                stages={paymentSchedule}
              />
            </div>
          )}
        </div>

        {/* ─────────────────────────────
           SINGLE, TRUST-LED CTA
        ───────────────────────────── */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="rounded-xl px-10 font-semibold"
            onClick={() =>
              openCTA({
                source: "section",
                label: "payment_plans_detailed_pricing",
              })
            }
          >
            Get detailed pricing & payment breakup
          </Button>
        </div>
      </div>
    </section>
  );
}
