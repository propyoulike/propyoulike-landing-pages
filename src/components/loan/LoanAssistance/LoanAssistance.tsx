// src/templates/common/LoanAssistance.tsx

import { CheckCircle } from "lucide-react";

interface LoanAssistanceProps {
  loanSupport?: {
    enabled?: boolean;
    headline?: string;
    subtext?: string;
    banks?: { name: string }[];
    highlights?: string[];
    disclaimer?: string;
  };
}

export default function LoanAssistance({ loanSupport }: LoanAssistanceProps) {
  if (!loanSupport?.enabled) return null;

  const {
    headline = "Home Loan Assistance Available",
    subtext = "Guidance on home loans, approvals, and documentation — with no obligation.",
    banks = [],
    highlights = [
      "No obligation support",
      "Guidance during site visit",
      "Help with documents & approvals",
    ],
    disclaimer,
  } = loanSupport;

  return (
    <section className="py-14 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border bg-card p-8 md:p-10 text-center shadow-sm space-y-6">

          {/* Section Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            {headline}
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtext}
          </p>

          {/* Bank Logos / Names */}
          {banks.length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap pt-2">
              {banks.map((bank) => (
                <span
                  key={bank.name}
                  className="
                    px-4 py-1.5 rounded-full 
                    border bg-background 
                    text-sm font-medium text-muted-foreground
                  "
                >
                  {bank.name}
                </span>
              ))}
            </div>
          )}

          {/* Highlights */}
          <ul className="space-y-3 max-w-md mx-auto text-left pt-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex gap-2 items-start text-sm text-muted-foreground"
              >
                <CheckCircle className="w-4 h-4 text-primary mt-[3px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Disclaimer */}
          {disclaimer && (
            <p className="text-xs text-muted-foreground pt-2">
              {disclaimer}
            </p>
          )}

        </div>
      </div>
    </section>
  );
}
