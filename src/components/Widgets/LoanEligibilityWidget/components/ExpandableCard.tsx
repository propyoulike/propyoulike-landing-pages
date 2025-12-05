// src/components/Widgets/LoanEligibilityWidget/components/ExpandableCard.tsx
import React, { useState } from "react";

export default function ExpandableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border rounded-xl shadow-sm mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex justify-between items-center text-left font-medium"
      >
        <span>{title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
