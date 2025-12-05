// src/components/widgets/LoanEligibilityWidget/components/BankOffers.tsx
import React from "react";

const offers = [
  { bank: "HDFC", rate: 8.5, fee: "Zero Processing", logo: "/banks/hdfc.png" },
  { bank: "SBI", rate: 8.4, fee: "Quick Approval", logo: "/banks/sbi.png" },
  { bank: "ICICI", rate: 8.6, fee: "Lowest EMI", logo: "/banks/icici.png" },
  { bank: "Axis", rate: 8.55, fee: "Fast Paperwork", logo: "/banks/axis.png" },
];

export default function BankOffers() {
  return (
    <div className="bg-card rounded-2xl p-4 mt-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Best Bank Offers</h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {offers.map((o, i) => (
          <div
            key={i}
            className="min-w-[160px] bg-white border rounded-xl p-3 shadow-sm hover:shadow-md"
          >
            <img src={o.logo} className="h-6 mb-2" />
            <div className="font-medium">{o.bank}</div>
            <div className="text-sm text-primary">{o.rate}% onwards</div>
            <div className="text-xs text-muted-foreground">{o.fee}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
