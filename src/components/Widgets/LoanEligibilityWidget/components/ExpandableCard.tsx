// src/components/Widgets/LoanEligibilityWidget/components/ExpandableCard.tsx
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";

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

  const isExpanded = toggleable ? toggled : open;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div
        onClick={() => !toggleable && setOpen(!open)}
        className={`w-full px-5 py-4 flex justify-between items-center text-left transition-colors ${
          !toggleable ? "cursor-pointer hover:bg-muted/50" : ""
        }`}
        role={!toggleable ? "button" : undefined}
        tabIndex={!toggleable ? 0 : undefined}
        onKeyDown={!toggleable ? (e) => e.key === "Enter" && setOpen(!open) : undefined}
      >
        <div>
          <span className="font-semibold text-foreground">{title}</span>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {toggleable ? (
          <Switch checked={toggled} onCheckedChange={onToggle} />
        ) : (
          <ChevronDown 
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}
