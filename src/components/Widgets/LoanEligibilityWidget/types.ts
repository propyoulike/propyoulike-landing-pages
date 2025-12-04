// src/components/widgets/LoanEligibilityWidget/types.ts
export type ApplicantType = "salaried" | "business";

export type ApplicantInput = {
  type: ApplicantType;
  dob?: string; // ISO date string
  income?: number; // monthly net
  existingEmis?: number; // monthly
};

export type LoanParams = {
  interestRate: number; // annual %
  tenureYears?: number; // preferred tenure (can be undefined to auto-calc)
  propertyValue?: number;
  hasCoApplicant?: boolean;
};

export type CalculatorResult = {
  ageA: number | null;
  ageB: number | null;
  maxTenureA: number;
  maxTenureB: number;
  effectiveTenure: number;
  maxEmiA: number;
  maxEmiB: number;
  totalMaxEmi: number;
  loanEligibility: number;
  propertyAffordability: number;
  requiredDownPayment: number;
  foirA: number;
  foirB: number;
};
