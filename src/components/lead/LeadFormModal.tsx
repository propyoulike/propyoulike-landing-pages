// src/components/lead/LeadFormModal.tsx
import { useEffect } from "react";
import {
  Dialog,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import LeadForm from "./LeadForm";

export interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectName: string;
  projectId?: string;
  whatsappNumber: string;
}

export default function LeadFormModal({
  open,
  onOpenChange,

  projectName,
  projectId,
  whatsappNumber,
}: LeadFormModalProps) {
  
  /** -------------------------------------------------
   * Prevent & restore body scroll (mobile fix)
   * ------------------------------------------------ */
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent
          className="
            fixed 
            top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2

            w-[92%]
            sm:max-w-[500px]

            max-h-[90vh]
            overflow-y-auto
            p-6
            rounded-xl

            bg-background shadow-xl
            z-[999999]
          "
        >
          {/* Close Button */}
          <DialogClose asChild>
            <button
              className="
                absolute right-4 top-4
                text-gray-500 hover:text-gray-800
                transition-colors
                text-2xl
                z-[10000000]
              "
              aria-label="Close"
            >
              ✕
            </button>
          </DialogClose>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Find Your <span className="text-primary">Best Options</span>
            </DialogTitle>
          </DialogHeader>

          {/* Lead Form */}
          <LeadForm
            projectName={projectName}
            projectId={projectId}
            whatsappNumber={whatsappNumber}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
