// src/components/widgets/LoanEligibilityWidget/components/LoanParameters.tsx
import React from "react";
import { LoanParams } from "../types";

export default function LoanParameters({
  params,
  sliderMin,
  sliderMax,
  onChange,
}: {
  params: LoanParams;
  sliderMin: number;
  sliderMax: number;
  onChange: (patch: Partial<LoanParams>) => void;
}) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Loan Parameters</h3>
        <div className="text-sm text-muted-foreground">Default interest: {params.interestRate}%</div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <div className="text-sm font-medium">Interest Rate (%)</div>
            <input type="number" value={params.interestRate} onChange={(e) => onChange({ interestRate: Number(e.target.value) })} className="input" />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Preferred Tenure (yrs)</div>
            <div className="flex gap-3 items-center">
              <input type="number" min={sliderMin} max={sliderMax} value={params.tenureYears ?? ""} onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : undefined;
                onChange({ tenureYears: v });
              }} className="input" style={{ width: "6.5rem" }} />
              <input type="range" min={sliderMin} max={sliderMax} step={1} value={params.tenureYears ?? sliderMax} onChange={(e) => onChange({ tenureYears: Number(e.target.value) })} className="w-full" />
            </div>

            <div className="text-xs text-muted-foreground mt-2 leading-relaxed bg-muted/20 p-3 rounded-lg">
              <strong>Maximum permissible tenure:</strong> <strong>{sliderMax}</strong> years.
              <br />
              <strong>Why:</strong> Tenure limited by retirement rules and lender caps. Defaults to maximum; you can reduce using the slider or number input.
            </div>
          </label>
        </div>

        <label className="space-y-1">
          <div className="text-sm font-medium">Property Value (₹) — optional</div>
          <input type="number" placeholder="Enter target property price" value={params.propertyValue ?? ""} onChange={(e) => onChange({ propertyValue: e.target.value ? Number(e.target.value) : undefined })} className="input" />
        </label>
      </div>
    </div>
  );
}
