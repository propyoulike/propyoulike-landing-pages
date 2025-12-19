// src/templates/common/LoanAssistance.tsx

import { CheckCircle } from "lucide-react";
import SectionHeader from "@/templates/common/SectionHeader";
import type { SectionMeta } from "@/content/types/sectionMeta";

interface LoanAssistanceProps {
  id?: string;

  meta?: SectionMeta;

  loanSupport?: {
    enabled?: boolean;
    banks?: { name: string }[];
    highlights?: string[];
    disclaimer?: string;
  };
}

export default function LoanAssistance({
  id = "loan-assistance",

  meta = {
    eyebrow: "FINANCING SUPPORT",
    title: "Home loan assistance available",
    subtitle:
      "Get guidance on loans, approvals, and documentation — without any obligation",
    tagline:
      "We help you understand your options so you can decide confidently",
  },

  loanSupport,
}: LoanAssistanceProps) {
  if (!loanSupport?.enabled) return null;

  const {
    banks = [],
    highlights = [
      "No obligation support",
      "Guidance during site visit",
      "Help with documentation & approvals",
    ],
    disclaimer,
  } = loanSupport;

  return (
    <section
      id={id}
      className="py-12 md:py-16 bg-muted/30 scroll-mt-32"
    >
      <div className="container max-w-4xl">

        {/* ─────────────────────────────
           SECTION HEADER (SYSTEMIC)
        ───────────────────────────── */}
        <div className="mb-10">
          <SectionHeader
            eyebrow={meta.eyebrow}
            title={meta.title}
            subtitle={meta.subtitle}
            tagline={meta.tagline}
            align="center"
          />
        </div>

        {/* ─────────────────────────────
           CONTENT CARD
        ───────────────────────────── */}
        <div className="rounded-2xl border bg-card p-8 md:p-10 text-center shadow-sm space-y-6">

          {/* Banks */}
          {banks.length > 0 && (
            <div className="flex justify-center gap-3 flex-wrap">
              {banks.map((bank) => (
                <span
                  key={bank.name}
                  className="px-4 py-1.5 rounded-full border bg-background text-sm font-medium text-muted-foreground"
                >
                  {bank.name}
                </span>
              ))}
            </div>
          )}

          {/* Highlights */}
          <ul className="space-y-3 max-w-md mx-auto text-left">
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
