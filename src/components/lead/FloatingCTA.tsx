// src/components/lead/FloatingCTA.tsx
import { memo } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingCTAProps {
  onEnquire: () => void;
  whatsappNumber: string;
}

const FloatingCTA = memo(function FloatingCTA({
  onEnquire,
  whatsappNumber,
}: FloatingCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border shadow-lg flex gap-2 p-3 z-[99999] lg:hidden safe-area-bottom">
      {/* WhatsApp Button */}
      <Button
        asChild
        className="flex-1 bg-success text-success-foreground hover:bg-success/90 h-12 rounded-xl font-semibold active:scale-[0.98] transition-transform"
      >
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </a>
      </Button>

      {/* Enquiry Button */}
      <Button
        onClick={onEnquire}
        className="flex-1 bg-accent text-accent-foreground hover:bg-accent-dark h-12 rounded-xl font-semibold active:scale-[0.98] transition-transform"
      >
        <Send size={16} className="mr-2" />
        <span>Enquire Now</span>
      </Button>
    </div>
  );
});

export default FloatingCTA;
