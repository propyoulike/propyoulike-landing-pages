// src/components/Widgets/LoanEligibilityWidget/components/SummaryCard.tsx
import { Button } from "@/components/ui/button";
import { Calculator, Building2, CreditCard } from "lucide-react";

interface SummaryCardProps {
  computed: {
    totalMaxEmi: number;
    loanEligibility: number;
  };
  interestRate: number;
  coActive: boolean;
  onCta?: () => void;
  banks?: string[];
}

export default function SummaryCard({ computed, interestRate, coActive, onCta, banks = [] }: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">

      <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        Affordability Summary
      </h3>

      <div className="space-y-4">

        {/* EMI */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Max EMI you can pay</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{Math.round(computed.totalMaxEmi).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            at {interestRate}% interest rate
          </div>
        </div>

        {/* LOAN */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Loan Eligibility</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            ₹{Math.round(computed.loanEligibility).toLocaleString()}
          </div>
          {coActive && (
            <div className="text-xs text-muted-foreground mt-1">
              Combined with co-applicant
            </div>
          )}
        </div>

        {/* BANKS */}
        {banks.length > 0 && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-sm font-medium mb-3 text-foreground">Banks Supporting This Project</div>
            <div className="flex flex-wrap gap-2">
              {banks.map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={onCta}
          className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent-dark rounded-xl shadow-md font-semibold"
        >
          Check Full Report
        </Button>
      </div>
    </div>
  );
}
