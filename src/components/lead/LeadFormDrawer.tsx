// src/components/lead/LeadFormDrawer.tsx
import LeadForm from "./LeadForm";
import type { LeadIntent } from "./types/LeadIntent";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectId?: string;
  whatsappNumber: string;
  intent?: LeadIntent;
}

export default function LeadFormDrawer({
  open,
  onOpenChange,
  projectName,
  projectId,
  whatsappNumber,
  intent,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-6 max-h-[85vh] overflow-y-auto">
        <SheetTitle className="text-center text-xl font-semibold mb-4">
          Get Best Units & Pricing
        </SheetTitle>

        <LeadForm
          projectName={projectName}
          projectId={projectId}
          whatsappNumber={whatsappNumber}
          intent={intent}
          onSuccess={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
