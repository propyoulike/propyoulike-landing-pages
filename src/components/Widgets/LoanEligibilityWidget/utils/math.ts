// src/components/widgets/LoanEligibilityWidget/utils/math.ts
export const monthlyRate = (annualRatePercent: number) => annualRatePercent / 100 / 12;

export const loanFromEmi = (emi: number, annualRatePercent: number, years: number) => {
  if (emi <= 0) return 0;
  const r = monthlyRate(annualRatePercent);
  const n = years * 12;
  if (r === 0) return emi * n;
  return emi * (1 - Math.pow(1 + r, -n)) / r;
};

export const round = (v: number) => Math.round(v);
