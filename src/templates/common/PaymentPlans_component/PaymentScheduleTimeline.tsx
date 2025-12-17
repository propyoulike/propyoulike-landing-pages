// src/templates/common/PaymentPlans_component/PaymentScheduleTimeline.tsx

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

interface Stage {
  title: string;
  percentage: string;
  items?: string[];
}

export default function PaymentScheduleTimeline({ stages = [] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {stages.map((stage, i) => {
        const open = openIndex === i;

        return (
          <div
            key={i}
            className={`rounded-2xl border transition-all ${
              open ? "border-primary/40 shadow-md" : "border-border"
            }`}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <div className="flex items-center gap-4">
                {/* Softer dot */}
                <span
                  className={`w-3 h-3 rounded-full ${
                    open ? "bg-primary" : "border border-muted-foreground"
                  }`}
                />
                <span className="font-semibold">{stage.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-primary">
                  {stage.percentage}
                </span>
                {open ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>

            {open && stage.items?.length > 0 && (
              <div className="px-5 pb-5 text-sm text-muted-foreground space-y-2">
                {stage.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Trust footer */}
      <div className="pt-4 text-sm text-muted-foreground flex gap-2">
        <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
        Total payment across all stages equals <strong>100%</strong>. Payments are linked to verified construction milestones.
      </div>
    </div>
  );
}
