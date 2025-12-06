// src/components/lead/LeadFormDrawer.tsx

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import LeadForm from "./LeadForm";

export interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectName: string;
  projectId?: string;
  whatsappNumber: string;
}

export default function LeadFormDrawer({
  open,
  onOpenChange,

  projectName,
  projectId,
  whatsappNumber,
}: LeadDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto shadow-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-center">
            Get Best Units & Pricing
          </SheetTitle>
        </SheetHeader>

        <LeadForm
          projectName={projectName}
          projectId={projectId}
          whatsappNumber={whatsappNumber}
          onSuccess={() => onOpenChange(false)}
        />

        <SheetClose />
      </SheetContent>
    </Sheet>
  );
}
