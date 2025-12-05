export default function SummaryCard({ computed, interestRate, coActive, onCta, banks = [] }) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-lg sticky top-10">

      <h3 className="text-xl font-bold mb-4">Affordability Summary</h3>

      <div className="space-y-4">

        {/* EMI */}
        <div className="p-3 rounded-md bg-muted/20">
          <div className="text-sm text-muted-foreground">Max EMI you can pay</div>
          <div className="text-xl font-semibold">
            ₹{Math.round(computed.totalMaxEmi).toLocaleString()}
          </div>
        </div>

        {/* LOAN */}
        <div className="p-3 rounded-md bg-muted/20">
          <div className="text-sm text-muted-foreground">Loan Eligibility</div>
          <div className="text-xl font-semibold">
            ₹{Math.round(computed.loanEligibility).toLocaleString()}
          </div>
        </div>

        {/* BANKS */}
        {banks.length > 0 && (
          <div className="p-3 rounded-md bg-primary/5">
            <div className="text-sm font-medium mb-2">Banks Supporting This Project</div>
            <div className="flex flex-wrap gap-2">
              {banks.map((b) => (
                <span
                  key={b}
                  className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onCta}
          className="w-full bg-primary text-white py-3 rounded-lg shadow-md hover:shadow-lg transition"
        >
          Check Full Report
        </button>
      </div>
    </div>
  );
}
