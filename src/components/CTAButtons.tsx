import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { trackCTAClick, trackWhatsAppClick } from "@/hooks/useScrollTracking";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import React, { memo, useCallback } from "react";

const CTAButtons = memo(({ variant = "default" }: { variant?: "default" | "compact" }) => {
  const { openCTA } = useLeadCTAContext();

  const handleFormClick = useCallback(
    (label: string) => {
      trackCTAClick(label, "CTAButtons");
      openCTA(label);
    },
    [openCTA]
  );

  const handleWhatsAppClick = useCallback(() => {
    trackWhatsAppClick("CTAButtons");
    window.open(
      "https://wa.me/919379822010?text=Hi,%20I'd%20like%20more%20details.",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <Button
        size="lg"
        variant="outline"
        className="flex-1 min-w-[180px] rounded-full font-semibold"
        onClick={() => handleFormClick("Site Visit")}
      >
        Site Visit
      </Button>

      <Button
        size="lg"
        variant="secondary"
        className="flex-1 min-w-[180px] rounded-full font-semibold flex items-center justify-center"
        onClick={handleWhatsAppClick}
      >
        <Phone className="mr-2 h-5 w-5" />
        WhatsApp
      </Button>
    </div>
  );
});

export default CTAButtons;
