// ApplicantCard.tsx
import React from "react";
import Card from "./Card";
import Field from "./Field";
import { ApplicantInput } from "../types";
import { retirementProgressPercent } from "../utils/tenure";

export default function ApplicantCard({
  title,
  applicant,
  onChange,
}: {
  title: string;
  applicant: ApplicantInput;
  onChange: (patch: Partial<ApplicantInput>) => void;
}) {
  const age = applicant.dob
    ? new Date().getFullYear() - new Date(applicant.dob).getFullYear()
    : null;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Applicant Type">
          <select
            value={applicant.type}
            onChange={(e) => onChange({ type: e.target.value as any })}
            className="input"
          >
            <option value="salaried">Salaried</option>
            <option value="business">Business / Self-employed</option>
          </select>
        </Field>

        <Field label="Date of Birth">
          <input
            type="date"
            value={applicant.dob ?? ""}
            onChange={(e) => onChange({ dob: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Monthly Net Income (₹)">
          <input
            type="number"
            value={applicant.income ?? ""}
            onChange={(e) =>
              onChange({
                income: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="input"
          />
        </Field>

        <Field label="Existing EMIs (₹)">
          <input
            type="number"
            value={applicant.existingEmis ?? ""}
            onChange={(e) =>
              onChange({
                existingEmis: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="input"
          />
        </Field>
      </div>

      {/* Retirement Progress */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
          <span>Retirement Progress</span>
          <span>{age ?? "--"} yrs</span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className="h-3 bg-primary rounded-full"
            style={{
              width: `${retirementProgressPercent(age, applicant.type)}%`,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
