// src/templates/common/PaymentPlans_component/PricingBlockList.tsx

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import PaymentAccordionItem from "./PaymentAccordionItem";

interface PricingBlock {
  title: string;
  points: string[];
}

export default function PricingBlockList({
  blocks = [],
}: {
  blocks: PricingBlock[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // ✅ open first by default

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const open = openIndex === i;

        return (
          <PaymentAccordionItem
            key={i}
            title={block.title}
            open={open}
            onToggle={() => setOpenIndex(open ? null : i)}
          >
            <ul className="space-y-3 text-sm text-muted-foreground">
              {block.points.map((p, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle className="text-primary w-4 h-4 mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </PaymentAccordionItem>
        );
      })}
    </div>
  );
}
