// src/components/widgets/LoanEligibilityWidget/components/CoApplicantCard.tsx
import React from "react";
import ApplicantCard from "./ApplicantCard";
import { ApplicantInput } from "../types";

export default function CoApplicantCard({
  present,
  applicant,
  onToggle,
  onChange,
}: {
  present: boolean;
  applicant: ApplicantInput;
  onToggle: () => void;
  onChange: (patch: Partial<ApplicantInput>) => void;
}) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">Co-applicant</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm">Add co-applicant</label>
          <input type="checkbox" className="toggle" checked={present} onChange={onToggle} />
        </div>
      </div>

      {present ? (
        <ApplicantCard title="Co-applicant" applicant={applicant} onChange={onChange} />
      ) : (
        <div className="text-sm text-muted-foreground">No co-applicant added.</div>
      )}
    </div>
  );
}
