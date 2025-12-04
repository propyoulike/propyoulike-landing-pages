// src/components/widgets/LoanEligibilityWidget/utils/format.ts
export const formatINR = (n: number) =>
  n <= 0 ? "₹0" : `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
