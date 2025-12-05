// src/components/widgets/LoanEligibilityWidget/components/StickySummary.tsx
import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";

export default function StickySummary({ computed, interestRate, hasCoApplicant, onCta }) {
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const toggle = () => setSticky(window.scrollY > 300);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  return (
    <div
      className={`hidden lg:block transition-all duration-300
        ${isSticky ? "fixed top-20 right-8 w-[350px]" : "relative"} `}
    >
      <SummaryCard
        computed={computed}
        interestRate={interestRate}
        hasCoApplicant={hasCoApplicant}
        onCta={onCta}
      />
    </div>
  );
}
