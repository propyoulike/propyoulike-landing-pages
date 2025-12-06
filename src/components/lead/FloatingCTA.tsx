// src/components/lead/FloatingCTA.tsx

import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingCTAProps {
  onEnquire: () => void;
  whatsappNumber: string;
}

export default function FloatingCTA({
  onEnquire,
  whatsappNumber,
}: FloatingCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg flex gap-3 p-3 z-[99999] md:hidden">
      {/* WhatsApp Button */}
      <Button
        asChild
        className="flex-1 bg-success text-success-foreground hover:bg-success/90 py-6 rounded-lg"
      >
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          WhatsApp
        </a>
      </Button>

      {/* Enquiry Button */}
      <Button
        onClick={onEnquire}
        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-lg"
      >
        <Send size={18} className="mr-2" />
        Enquire
      </Button>
    </div>
  );
}
