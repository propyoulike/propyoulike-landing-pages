import React from "react";
import Card from "./Card";
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
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Co-applicant</h3>

        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={present}
            onChange={onToggle}
            className="toggle"
          />
          Add co-applicant
        </label>
      </div>

      {present ? (
        <ApplicantCard
          title="Co-applicant Details"
          applicant={applicant}
          onChange={onChange}
        />
      ) : (
        <p className="text-sm text-muted-foreground">No co-applicant added.</p>
      )}
    </Card>
  );
}
