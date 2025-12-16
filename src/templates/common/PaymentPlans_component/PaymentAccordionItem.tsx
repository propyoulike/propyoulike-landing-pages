import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

export default function PaymentAccordionItem({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
      <button
        className="w-full flex justify-between items-center"
        onClick={onToggle}
      >
        <span className="font-semibold text-lg">{title}</span>
        {open ? (
          <ChevronUp className="text-primary" />
        ) : (
          <ChevronDown className="text-primary" />
        )}
      </button>

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
