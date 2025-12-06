// src/components/Widgets/LoanEligibilityWidget/components/ExpandableCard.tsx
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface ExpandableCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  toggleable?: boolean;
  toggled?: boolean;
  onToggle?: () => void;
}

export default function ExpandableCard({
  title,
  description,
  children,
  defaultOpen = true,
  toggleable = false,
  toggled = false,
  onToggle,
}: ExpandableCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-card border rounded-xl shadow-sm mb-4">
      <div
        onClick={() => !toggleable && setOpen(!open)}
        className={`w-full px-4 py-3 flex justify-between items-center text-left ${!toggleable ? 'cursor-pointer' : ''}`}
        role={!toggleable ? "button" : undefined}
        tabIndex={!toggleable ? 0 : undefined}
        onKeyDown={!toggleable ? (e) => e.key === 'Enter' && setOpen(!open) : undefined}
      >
        <div>
          <span className="font-medium">{title}</span>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {toggleable ? (
          <Switch checked={toggled} onCheckedChange={onToggle} />
        ) : (
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ▼
          </span>
        )}
      </div>

      {(toggleable ? toggled : open) && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
