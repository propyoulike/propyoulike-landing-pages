// src/templates/common/PaymentPlans_component/PaymentAccordionItem.tsx

import { ChevronDown, ChevronUp } from "lucide-react";

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
    <div
      className={`
        rounded-2xl border transition-all duration-300
        ${open ? "border-primary/40 shadow-lg" : "border-border shadow-sm"}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <h4 className="text-base font-semibold">{title}</h4>

        {open ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );
}
