import React from "react";
import Card from "./Card";
import Field from "./Field";

export default function LoanParameters({
  params,
  sliderMin,
  sliderMax,
  onChange,
}: any) {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Loan Parameters</h3>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Interest Rate (%)">
          <input
            type="number"
            value={params.interestRate}
            onChange={(e) => onChange({ interestRate: Number(e.target.value) })}
            className="input"
          />
        </Field>

        <Field label="Preferred Tenure (yrs)">
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min={sliderMin}
              max={sliderMax}
              value={params.tenureYears ?? sliderMax}
              onChange={(e) => onChange({ tenureYears: Number(e.target.value) })}
              className="input w-20"
            />

            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={params.tenureYears ?? sliderMax}
              onChange={(e) =>
                onChange({ tenureYears: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </Field>
      </div>

      <Field label="Property Value (₹) — optional">
        <input
          type="number"
          placeholder="Enter target property price"
          value={params.propertyValue ?? ""}
          onChange={(e) =>
            onChange({
              propertyValue: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="input"
        />
      </Field>
    </Card>
  );
}
