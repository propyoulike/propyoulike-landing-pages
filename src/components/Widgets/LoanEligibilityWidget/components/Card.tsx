// src/components/widgets/LoanEligibilityWidget/components/Card.tsx
import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {children}
    </div>
  );
}
