import { useEffect } from "react";
import {
  Dialog,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | JSX.Element; // Customizable title
  FormComponent: React.ElementType<{ onSuccess: () => void; trackEvent?: (eventName: string, eventData?: any) => void }>;
  trackEvent?: (eventName: string, eventData?: any) => void; // Optional tracking
}

const LeadFormModal = ({ open, onOpenChange, title, FormComponent, trackEvent }: LeadFormModalProps) => {

  // -------- Fire tracking when modal opens --------
  useEffect(() => {
    if (open && typeof trackEvent === "function") {
      trackEvent("modal_opened", { source: "LeadFormModal" });
    }
  }, [open]);

  // -------- Ensure body scroll unlock on close --------
  useEffect(() => {
    if (!open) {
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
            sm:max-w-[500px]
            w-[92%]
            max-h-[90vh]
            overflow-y-auto
            p-6
            rounded-xl
            bg-background
            shadow-xl
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
              {title || <>Get in <span className="text-primary">Touch</span></>}
            </DialogTitle>
          </DialogHeader>

          {/* Render passed form component */}
          <FormComponent
            trackEvent={trackEvent}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default LeadFormModal;
