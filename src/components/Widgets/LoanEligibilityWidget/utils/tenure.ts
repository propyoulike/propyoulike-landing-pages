// src/components/widgets/LoanEligibilityWidget/utils/tenure.ts
import { ApplicantType } from "../types";

export const retirementAgeFor = (type: ApplicantType) => (type === "salaried" ? 60 : 65);

export const computeAge = (dobStr?: string | null) => {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export const maxTenureByAge = (age: number | null, type: ApplicantType) => {
  if (age === null) return 30;
  const retirementAge = retirementAgeFor(type);
  const remainingYears = Math.max(0, retirementAge - age);
  return Math.min(Math.max(5, Math.floor(remainingYears)), 30);
};

export const retirementProgressPercent = (age: number | null, type: ApplicantType) => {
  if (age === null) return 0;
  const retire = retirementAgeFor(type);
  const pct = Math.min(100, Math.max(0, (age / retire) * 100));
  return Math.round(pct);
};
