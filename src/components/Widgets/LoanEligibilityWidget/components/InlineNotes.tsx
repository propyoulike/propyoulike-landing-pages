// src/components/widgets/LoanEligibilityWidget/components/InlineNotes.tsx
import React from "react";

export default function InlineNotes() {
  return (
    <div className="relative mt-8 pl-8">
      <div className="absolute top-0 left-2 w-1 bg-primary/20 rounded-full timeline-line-small" />
      <div className="space-y-6">
        <div className="fade-stage">
          <div className="text-sm font-medium">How we computed</div>
          <div className="text-xs text-muted-foreground">
            We calculate allowable EMI from FOIR (based on profile), subtract existing EMIs, then convert EMI capacity into loan amount using the selected interest rate & tenure.
          </div>
        </div>
        <div className="fade-stage">
          <div className="text-sm font-medium">Co-applicant impact</div>
          <div className="text-xs text-muted-foreground">
            Adding a co-applicant sums EMI capacity often significantly increasing loan eligibility. Tenure will be limited by the younger applicant's permissible tenure.
          </div>
        </div>
      </div>
    </div>
  );
}
