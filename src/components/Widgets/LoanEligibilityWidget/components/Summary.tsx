// src/components/widgets/LoanEligibilityWidget/components/Summary.tsx
import React from "react";
import { CalculatorResult } from "../types";
import { formatINR } from "../utils/format";

export default function Summary({
  computed,
  interestRate,
  hasCoApplicant,
  onCta,
}: {
  computed: CalculatorResult;
  interestRate: number;
  hasCoApplicant: boolean;
  onCta: () => void;
}) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-bold">Affordability Summary</h3>
        <div className="text-sm text-muted-foreground">Real-time estimate</div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/5 rounded-xl">
            <div className="text-sm text-muted-foreground">Max EMI you can pay</div>
            <div className="text-2xl font-semibold mt-2">{formatINR(Math.round(computed.totalMaxEmi))}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Primary: {formatINR(Math.round(computed.maxEmiA))} {hasCoApplicant && <>• Co: {formatINR(Math.round(computed.maxEmiB))}</>}
            </div>
          </div>

          <div className="p-4 bg-muted/5 rounded-xl">
            <div className="text-sm text-muted-foreground">Loan Eligibility</div>
            <div className="text-2xl font-semibold mt-2">{formatINR(Math.round(computed.loanEligibility))}</div>
            <div className="text-xs text-muted-foreground mt-1">@ {interestRate}% for {computed.effectiveTenure} yrs</div>
          </div>
        </div>

        <div className="p-4 bg-muted/5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Property Affordability</div>
              <div className="text-xl font-semibold mt-1">{formatINR(Math.round(computed.propertyAffordability))}</div>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Suggested down payment: <strong>20% recommended</strong>
            </div>
          </div>

          {computed.requiredDownPayment > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="text-sm text-muted-foreground">Required Down Payment</div>
              <div className="font-medium">{formatINR(Math.round(computed.requiredDownPayment))}</div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-muted-foreground">
              Enter a property price to compute exact down payment required. Otherwise we assume you could target property worth up to the loan + ~6 months income fallback.
            </div>
          )}
        </div>

        <div className="p-4 border rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-primary w-5 h-5 mt-1">✔</div>
            <div>
              <div className="text-sm text-muted-foreground">FOIR used</div>
              <div className="font-medium">
                Primary: {(computed.foirA * 100).toFixed(0)}% {hasCoApplicant && <>• Co-applicant: {(computed.foirB * 100).toFixed(0)}%</>}
              </div>
              <div className="text-xs text-muted-foreground mt-2">These are conservative defaults — banks may vary based on credit score & policy.</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Recommended next step</div>
              <div className="font-semibold">Get detailed assessment & pre-approval</div>
            </div>
            <button className="btn btn-primary" onClick={onCta}>Check Full Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
