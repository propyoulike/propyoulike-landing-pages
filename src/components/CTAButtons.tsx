import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { trackCTAClick, trackWhatsAppClick } from "@/hooks/useScrollTracking";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import React, { memo, useCallback } from "react";

export interface CTAButtonsProps {
  variant?: "default" | "compact" | "hero";
  onFormOpen?: () => void;
  label?: string;
}

const CTAButtons = memo(({ variant = "default", onFormOpen, label }: CTAButtonsProps) => {
  const { openCTA } = useLeadCTAContext();

  const handleFormClick = useCallback(
    (buttonLabel: string) => {
      trackCTAClick(buttonLabel);
      if (onFormOpen) {
        onFormOpen();
      } else {
        openCTA(buttonLabel);
      }
    },
    [openCTA, onFormOpen]
  );

  const handleWhatsAppClick = useCallback(() => {
    trackWhatsAppClick();
    window.open(
      "https://wa.me/919379822010?text=Hi,%20I'd%20like%20more%20details.",
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  // Compact/Hero variant - just buttons inline
  if (variant === "compact" || variant === "hero") {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          size="lg"
          className="min-w-[160px] rounded-full font-semibold bg-accent text-accent-foreground hover:bg-accent-dark shadow-lg"
          onClick={() => handleFormClick(label || "Site Visit")}
        >
          <Calendar className="mr-2 h-5 w-5" />
          {label || "Book Site Visit"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="min-w-[160px] rounded-full font-semibold border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
          onClick={handleWhatsAppClick}
        >
          <Phone className="mr-2 h-5 w-5" />
          WhatsApp
        </Button>
      </div>
    );
  }

  // Default variant - full section with heading
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Own Your Dream Home?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Contact us today for exclusive offers and personalized assistance
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="min-w-[180px] rounded-full font-semibold bg-accent text-accent-foreground hover:bg-accent-dark shadow-lg"
              onClick={() => handleFormClick(label || "Site Visit")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {label || "Book Site Visit"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px] rounded-full font-semibold border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={handleWhatsAppClick}
            >
              <Phone className="mr-2 h-5 w-5" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

CTAButtons.displayName = "CTAButtons";

export default CTAButtons;
