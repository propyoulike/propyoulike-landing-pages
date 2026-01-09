// src/components/lead/LeadFormModal.tsx

import LeadForm from "./LeadForm";
import type { LeadIntent } from "./types/LeadIntent";
import {
  Dialog,
  DialogContent,
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
        <DialogClose className="absolute right-4 top-4">
          ✕
        </DialogClose>

        {/* 
          🔑 IMPORTANT:
          - No static title here
          - LeadForm owns ALL copy (title, helper, CTA)
          - builderId is mandatory for CRM & analytics
        */}
        <LeadForm
          projectName={projectName}
          projectId={projectId}
          builderId={intent?.builderId ?? "UNKNOWN"}
          whatsappNumber={whatsappNumber}
          intent={intent}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
