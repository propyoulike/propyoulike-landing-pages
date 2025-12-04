// src/components/widgets/LoanEligibilityWidget/components/ApplicantCard.tsx
import React from "react";
import { ApplicantInput } from "../types";
import { retirementProgressPercent } from "../utils/tenure";
import { formatINR } from "../utils/format";

export default function ApplicantCard({
  title = "Applicant",
  applicant,
  onChange,
}: {
  title?: string;
  applicant: ApplicantInput;
  onChange: (patch: Partial<ApplicantInput>) => void;
}) {
  const age = applicant.dob ? (new Date().getFullYear() - new Date(applicant.dob).getFullYear()) : null;
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="text-sm text-muted-foreground">Primary</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <div className="text-sm font-medium">Applicant Type</div>
          <select value={applicant.type} onChange={(e) => onChange({ type: e.target.value as any })} className="input">
            <option value="salaried">Salaried</option>
            <option value="business">Business / Self-employed</option>
          </select>
        </label>

        <label className="space-y-1">
          <div className="text-sm font-medium">Date of Birth</div>
          <input type="date" value={applicant.dob || ""} onChange={(e) => onChange({ dob: e.target.value })} className="input" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <label className="space-y-1">
          <div className="text-sm font-medium">Monthly Net Income (₹)</div>
          <input type="number" value={applicant.income ?? ""} onChange={(e) => onChange({ income: e.target.value ? Number(e.target.value) : undefined })} className="input" />
        </label>

        <label className="space-y-1">
          <div className="text-sm font-medium">Existing EMIs (₹)</div>
          <input type="number" value={applicant.existingEmis ?? ""} onChange={(e) => onChange({ existingEmis: e.target.value ? Number(e.target.value) : undefined })} className="input" />
        </label>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">Retirement progress</div>
          <div className="text-sm font-medium">{age ?? "-" } yrs</div>
        </div>
        <div className="w-full bg-muted/10 rounded-full h-3 overflow-hidden">
          <div className="h-3 bg-primary rounded-full" style={{ width: `${retirementProgressPercent(age, applicant.type)}%` }} />
        </div>
      </div>
    </div>
  );
}
