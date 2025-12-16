import { useState } from "react";
import { CheckCircle } from "lucide-react";
import PaymentAccordionItem from "./PaymentAccordionItem";

export default function PricingBlockList({ blocks = [] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const open = openIndex === i;

        return (
          <PaymentAccordionItem
            key={i}
            title={block.title}
            open={open}
            onToggle={() => setOpenIndex(open ? null : i)}
          >
            <ul className="space-y-2 text-muted-foreground">
              {block.points.map((p, idx) => (
                <li key={idx} className="flex gap-2">
                  <CheckCircle className="text-primary w-4 h-4 mt-1" />
                  {p}
                </li>
              ))}
            </ul>
          </PaymentAccordionItem>
        );
      })}
    </div>
  );
}
