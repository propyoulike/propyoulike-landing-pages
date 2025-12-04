// src/components/widgets/LoanEligibilityWidget/hooks/useLoanCalculator.ts
import { useMemo } from "react";
import { ApplicantInput, LoanParams, CalculatorResult } from "../types";
import { computeAge, maxTenureByAge } from "../utils/tenure";
import { loanFromEmi } from "../utils/math";

const DEFAULTS = {
  INTEREST: 8,
  FOIR_SALARIED: 0.55,
  FOIR_BUSINESS: 0.45,
};

export function useLoanCalculator(
  primary: ApplicantInput,
  coApplicant: ApplicantInput | null,
  params: LoanParams
): CalculatorResult {
  return useMemo(() => {
    const ageA = computeAge(primary.dob);
    const ageB = coApplicant ? computeAge(coApplicant.dob) : null;

    const foirA = primary.type === "salaried" ? DEFAULTS.FOIR_SALARIED : DEFAULTS.FOIR_BUSINESS;
    const foirB = coApplicant ? (coApplicant.type === "salaried" ? DEFAULTS.FOIR_SALARIED : DEFAULTS.FOIR_BUSINESS) : DEFAULTS.FOIR_SALARIED;

    const maxTenureA = maxTenureByAge(ageA, primary.type);
    const maxTenureB = coApplicant ? maxTenureByAge(ageB, coApplicant.type) : maxTenureA;

    const autoEffectiveTenure = coApplicant ? Math.min(maxTenureA, maxTenureB) : maxTenureA;

    let eff = typeof params.tenureYears === "number" && params.tenureYears > 0 ? Math.min(params.tenureYears, 30) : autoEffectiveTenure;
    eff = Math.max(1, eff);

    const incA = primary.income || 0;
    const incB = coApplicant ? (coApplicant.income || 0) : 0;
    const exA = primary.existingEmis || 0;
    const exB = coApplicant ? (coApplicant.existingEmis || 0) : 0;

    const maxEmiA = Math.max(0, incA * foirA - exA);
    const maxEmiB = coApplicant ? Math.max(0, incB * foirB - exB) : 0;

    const totalMaxEmi = maxEmiA + maxEmiB;
    const loanEligibility = loanFromEmi(totalMaxEmi, params.interestRate || DEFAULTS.INTEREST, eff);

    const propVal = params.propertyValue || 0;
    const requiredDP = propVal > 0 ? Math.max(0, propVal - loanEligibility) : 0;
    const propertyAff = propVal > 0 ? propVal : Math.round(loanEligibility + (incA * 6 || 0));

    return {
      ageA,
      ageB,
      maxTenureA,
      maxTenureB,
      effectiveTenure: eff,
      maxEmiA,
      maxEmiB,
      totalMaxEmi,
      loanEligibility,
      propertyAffordability: propertyAff,
      requiredDownPayment: requiredDP,
      foirA,
      foirB,
    };
  }, [primary, coApplicant, params]);
}
