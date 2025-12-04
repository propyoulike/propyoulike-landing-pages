// src/components/lead/LeadDrawer.tsx

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import LeadForm from "./LeadForm";

interface LeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectName: string;
  projectId?: string;
  whatsappNumber: string;

  trackEvent?: (name: string, data?: any) => void;
}

export default function LeadDrawer({
  open,
  onOpenChange,

  projectName,
  projectId,
  whatsappNumber,

  trackEvent,
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
          trackEvent={trackEvent}
          onSuccess={() => onOpenChange(false)}
        />

        <SheetClose />
      </SheetContent>
    </Sheet>
  );
}
