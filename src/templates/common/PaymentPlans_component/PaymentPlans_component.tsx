// src/templates/common/PaymentPlans_component/PaymentPlans_component.tsx

import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

import PricingBlockList from "./PricingBlockList";
import PaymentScheduleTimeline from "./PaymentScheduleTimeline";

import BaseSection from "../BaseSection";
import type { SectionMeta } from "@/content/types/sectionMeta";

/* ---------------------------------------------------------------------
   TYPES
------------------------------------------------------------------------*/
interface PaymentPlansProps {
  id?: string;
  meta?: SectionMeta | null;

  pricingTitle?: string;
  pricingComputation?: any[];

  scheduleTitle?: string;
  paymentSchedule?: any[];
}

/* ---------------------------------------------------------------------
   DEFAULT META
------------------------------------------------------------------------*/
const DEFAULT_META: SectionMeta = {
  eyebrow: "PRICING",
  title: "Pricing & payment plans",
  subtitle:
    "Understand total cost, stage-wise payments, and what you pay when",
  tagline: "No surprises — full clarity before you decide",
};

/* ---------------------------------------------------------------------
   COMPONENT
------------------------------------------------------------------------*/
export default function PaymentPlans_component({
  id = "payment-plans",
  meta = DEFAULT_META,

  pricingTitle = "Pricing computation",
  pricingComputation = [],

  scheduleTitle = "Construction-linked payment schedule",
  paymentSchedule = [],
}: PaymentPlansProps) {
  const { openCTA } = useLeadCTAContext();

  const hasContent =
    pricingComputation.length > 0 ||
    paymentSchedule.length > 0;

  if (!hasContent) return null;

  return (
    <BaseSection
      id={id}
      meta={meta}
      align="center"
      padding="md"
    >
      {/* ─────────────────────────────
         PRICING + PAYMENT GRID
      ───────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-14">

        {/* PRICING BREAKUP */}
        {pricingComputation.length > 0 && (
          <div>
            <h3 className="subsection-title">
              {pricingTitle}
            </h3>

            <PricingBlockList
              blocks={pricingComputation}
            />
          </div>
        )}

        {/* PAYMENT SCHEDULE */}
        {paymentSchedule.length > 0 && (
          <div>
            <h3 className="subsection-title">
              {scheduleTitle}
            </h3>

            <PaymentScheduleTimeline
              stages={paymentSchedule}
            />
          </div>
        )}
      </div>

      {/* ─────────────────────────────
         PRIMARY CTA
      ───────────────────────────── */}
      <div className="mt-16 text-center">
        <Button
          size="lg"
          className="rounded-xl px-10 font-semibold"
          onClick={() =>
            openCTA({
              source: "section",
              label:
                "payment_plans_detailed_pricing",
            })
          }
        >
          Get detailed pricing & payment breakup
        </Button>
      </div>
    </BaseSection>
  );
}
