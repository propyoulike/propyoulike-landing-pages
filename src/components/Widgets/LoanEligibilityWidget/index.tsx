// src/components/widgets/LoanEligibilityWidget/index.tsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import ApplicantCard from "./components/ApplicantCard";
import CoApplicantCard from "./components/CoApplicantCard";
import LoanParameters from "./components/LoanParameters";
import Summary from "./components/Summary";
import InlineNotes from "./components/InlineNotes";
import { useLoanCalculator } from "./hooks/useLoanCalculator";
import { initAnalyticsConfig, trackGA, trackMeta } from "./utils/tracking";
import { formatINR } from "./utils/format";
import CTAButtons from "@/components/CTAButtons"; // your existing CTA
import { useLeadCTA } from "@/components/lead/LeadCTAProvider";
import "./styles.css";

import type { ApplicantInput, LoanParams } from "./types";

type Props = {
  onCtaClick?: () => void;
  analytics?: {
    gaMeasurementId?: string;
    gaTagId?: string;
    gaConversionId?: string;
    gaConversionTagId?: string;
    fbPixelId?: string;
    fbDomainVerification?: string;
    fbAppId?: string;
  };
};

export default function LoanEligibilityWidget({ onCtaClick, analytics }: Props) {
  // initialize analytics config for internal tracking utils (optional)
  useEffect(() => {
    if (analytics) initAnalyticsConfig(analytics);
  }, [analytics]);

  const [primary, setPrimary] = useState<ApplicantInput>({ type: "salaried" });
  const [coApplicant, setCoApplicant] = useState<ApplicantInput>({ type: "salaried" });
  const [hasCoApplicant, setHasCoApplicant] = useState(false);

  const [params, setParams] = useState<LoanParams>({ interestRate: 8, tenureYears: undefined, propertyValue: undefined });

  const computed = useLoanCalculator(primary, hasCoApplicant ? coApplicant : null, { interestRate: params.interestRate, tenureYears: params.tenureYears, propertyValue: params.propertyValue });

  // slider bounds
  const sliderMax = hasCoApplicant ? Math.min(computed.maxTenureA, computed.maxTenureB) : computed.maxTenureA;
  const sliderMin = 5;

  useEffect(() => {
    // ensure tenure defaulting logic: if params.tenureYears not set or out-of-range, set to sliderMax
    if (params.tenureYears === undefined || (params.tenureYears < sliderMin || params.tenureYears > sliderMax)) {
      setParams((p) => ({ ...p, tenureYears: sliderMax }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderMax]);

  /* tracking helpers (thin) */
  const onInputChange = (field: string, value: any) => {
    trackGA("loan_input_change", field, { value });
    trackMeta("loan_input_change", field, { value });
  };

const handleCTA = () => {
  trackGA("loan_cta_click", "check_full_report", {
    loanEligibility: Math.round(computed.loanEligibility),
    maxEmi: Math.round(computed.totalMaxEmi),
  });

  trackMeta("loan_cta_click", "check_full_report", {
    loanEligibility: Math.round(computed.loanEligibility),
    maxEmi: Math.round(computed.totalMaxEmi),
  });

  // Safe fallback logic
  if (typeof onCtaClick === "function") {
    onCtaClick();
  } else {
    openLeadForm(); // fallback
  }
};

  return (
    <section id="loan-eligibility" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Loan Eligibility & <span className="text-primary">Affordability</span>
          </h2>
          <p className="text-muted-foreground text-lg">Enter a few details and we’ll estimate maximum loan, EMI capability and down payment required.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="space-y-6">
            <ApplicantCard applicant={primary} onChange={(patch) => { setPrimary((p) => ({ ...p, ...patch })); onInputChange("primary", patch); }} />
            <CoApplicantCard present={hasCoApplicant} applicant={coApplicant} onToggle={() => { setHasCoApplicant(s => !s); onInputChange("toggle_coapp", !hasCoApplicant); }} onChange={(patch) => { setCoApplicant((p) => ({ ...p, ...patch })); onInputChange("coApplicant", patch); }} />
            <LoanParameters params={params} sliderMin={sliderMin} sliderMax={sliderMax} onChange={(patch) => { setParams((p) => ({ ...p, ...patch })); onInputChange("loanParams", patch); }} />
            <div className="text-center mt-4">
              <CTAButtons onFormOpen={handleCTA} />
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <Summary computed={computed as any} interestRate={params.interestRate} hasCoApplicant={hasCoApplicant} onCta={handleCTA} />
            <InlineNotes />
          </div>
        </div>
      </div>
    </section>
  );
}
