// src/components/widgets/LoanEligibilityWidget/components/BankStrip.tsx
const banks = [
  "/banks/sbi.png",
  "/banks/hdfc.png",
  "/banks/icici.png",
  "/banks/axis.png",
];

export default function BankStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6 opacity-80">
      {banks.map((src, i) => (
        <img key={i} src={src} className="h-10 w-auto" />
      ))}
    </div>
  );
}
