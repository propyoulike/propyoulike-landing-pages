import React, { useState, useEffect } from "react";
import SummaryCard from "./components/SummaryCard";
import ExpandableCard from "./components/ExpandableCard";
import ApplicantCard from "./components/ApplicantCard";
import CoApplicantCard from "./components/CoApplicantCard";
import LoanParameters from "./components/LoanParameters";
import InfoNotes from "./components/InfoNotes";
import { useLoanCalculator } from "./hooks/useLoanCalculator";
import { ApplicantInput } from "./types";
import CTAButtons from "@/components/CTAButtons";

export default function LoanEligibilityWidget({ onCtaClick, banks = [] }: { onCtaClick?: () => void; banks?: any[] }) {

  // ---------------- STATE ----------------
  const [primary, setPrimary] = useState<ApplicantInput>({ type: "salaried" });
  const [co, setCo] = useState<ApplicantInput>({ type: "salaried" });
  const [coActive, setCoActive] = useState(false);

  const [params, setParams] = useState({
    interestRate: 8,
    tenureYears: undefined as number | undefined,
    propertyValue: undefined as number | undefined,
  });

  // ---------------- RESTORE FROM LOCAL STORAGE ----------------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("loan-progress") || "{}");

      if (saved.primary) setPrimary(saved.primary);
      if (saved.co) setCo(saved.co);
      if (typeof saved.coActive === "boolean") setCoActive(saved.coActive);
      if (saved.params) setParams(saved.params);
    } catch {
      console.warn("⚠ Failed loading loan-progress from localStorage");
    }
  }, []);

  // ---------------- SAVE TO LOCAL STORAGE ----------------
  useEffect(() => {
    localStorage.setItem(
      "loan-progress",
      JSON.stringify({
        primary,
        co,
        coActive,
        params,
      })
    );
  }, [primary, co, coActive, params]);

  // ---------------- COMPUTE ----------------
  const computed = useLoanCalculator(primary, coActive ? co : null, params);

  const sliderMax = coActive
    ? Math.min(computed.maxTenureA, computed.maxTenureB)
    : computed.maxTenureA;

  // ---------------- RENDER ----------------
  return (
    <section id="loan-eligibility" className="py-20 lg:py-28 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            Loan Eligibility Calculator
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Check your home loan eligibility based on your income and existing commitments.
          </p>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDE INPUT PANEL */}
          <div className="flex-1 space-y-4">

            <ExpandableCard title="Applicant Details" defaultOpen>
              <ApplicantCard
                title="Primary Applicant"
                applicant={primary}
                onChange={(v) => setPrimary({ ...primary, ...v })}
              />
            </ExpandableCard>

            <ExpandableCard
              title="Co-applicant"
              description="Boost eligibility by adding spouse/family"
              toggleable
              toggled={coActive}
              onToggle={() => setCoActive(!coActive)}
            >
              {coActive && (
                <CoApplicantCard
                  present={coActive}
                  applicant={co}
                  onToggle={() => setCoActive(!coActive)}
                  onChange={(v) => setCo({ ...co, ...v })}
                />
              )}
            </ExpandableCard>

            <ExpandableCard title="Loan Settings">
              <LoanParameters
                params={params}
                sliderMin={5}
                sliderMax={sliderMax}
                onChange={(v) => setParams({ ...params, ...v })}
              />
            </ExpandableCard>

            <ExpandableCard title="Why these calculations?" defaultOpen={false}>
              <InfoNotes />
            </ExpandableCard>

            {/* CTA (Mobile Only) */}
            <div className="text-center lg:hidden pt-4">
              <CTAButtons onFormOpen={onCtaClick} variant="compact" />
            </div>
          </div>


          {/* RIGHT SUMMARY + BANKS */}
          <div className="hidden lg:block w-[350px] sticky top-24 self-start">
            <SummaryCard
              computed={computed}
              interestRate={params.interestRate}
              coActive={coActive}
              onCta={onCtaClick}
              banks={banks}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
