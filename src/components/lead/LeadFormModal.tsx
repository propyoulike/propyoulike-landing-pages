// src/components/lead/LeadFormModal.tsx
import LeadForm from "./LeadForm";
import type { LeadIntent } from "./types/LeadIntent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectId?: string;
  whatsappNumber: string;
  intent?: LeadIntent;
}

export default function LeadFormModal({
  open,
  onOpenChange,
  projectName,
  projectId,
  whatsappNumber,
  intent,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] p-6">
        <DialogClose className="absolute right-4 top-4">✕</DialogClose>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Get the Best Options
          </DialogTitle>
        </DialogHeader>

        <LeadForm
          projectName={projectName}
          projectId={projectId}
          whatsappNumber={whatsappNumber}
          intent={intent}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
