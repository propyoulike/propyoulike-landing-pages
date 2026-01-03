import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";

import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import type { LeadIntent } from "@/components/lead/types/LeadIntent";

import { useTracking } from "@/lib/tracking/TrackingContext";
import { EventName } from "@/lib/analytics/events";
import { CTAType } from "@/lib/analytics/ctaTypes";

/* ---------------------------------------------
   Types
---------------------------------------------- */
export interface CTAButtonsProps {
  variant?: "default" | "compact" | "hero";
  label?: string;

  /** REQUIRED for attribution */
  sourceSection: string;   // hero | summary | pricing | amenities | footer
  builderId: string;       // project.builder from JSON
}

/* ---------------------------------------------
   Component
---------------------------------------------- */
const CTAButtons = memo(function CTAButtons({
  variant = "default",
  label = "Book Site Visit",
  sourceSection,
  builderId,
}: CTAButtonsProps) {
  const { openCTA } = useLeadCTAContext();
  const { track } = useTracking();

  /* ---------------------------------------------
     Form CTA
  ---------------------------------------------- */
  const handleFormClick = useCallback(() => {
    // 🔹 Analytics: click intent
    track(EventName.CTAClick, {
      cta_type: CTAType.ContactForm,
      source_section: sourceSection,
      source_item: label,
    });

    // 🔹 Canonical intent passed forward
    const intent: LeadIntent = {
      sourceSection,
      sourceItem: label,
      builderId,
      label,
    };

    openCTA(intent);
  }, [track, openCTA, sourceSection, label, builderId]);

  /* ---------------------------------------------
     WhatsApp CTA
  ---------------------------------------------- */
  const handleWhatsAppClick = useCallback(() => {
    track(EventName.CTAClick, {
      cta_type: CTAType.ContactWhatsApp,
      source_section: sourceSection,
      source_item: "whatsapp",
    });

    const intent: LeadIntent = {
      sourceSection,
      sourceItem: "whatsapp",
      builderId,
      label: "WhatsApp",
    };

    openCTA(intent);
  }, [track, openCTA, sourceSection, builderId]);

  /* ---------------------------------------------
     Compact / Hero Variant
  ---------------------------------------------- */
  if (variant === "compact" || variant === "hero") {
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          size="lg"
          className="min-w-[160px] rounded-full font-semibold bg-accent text-accent-foreground hover:bg-accent-dark shadow-lg"
          onClick={handleFormClick}
        >
          <Calendar className="mr-2 h-5 w-5" />
          {label}
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

  /* ---------------------------------------------
     Default (Full CTA Section)
  ---------------------------------------------- */
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Own Your Dream Home?
          </h2>

          <p className="text-primary-foreground/80 text-lg mb-8">
            Talk to an expert for verified pricing, availability & site visits
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="min-w-[180px] rounded-full font-semibold bg-accent text-accent-foreground hover:bg-accent-dark shadow-lg"
              onClick={handleFormClick}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {label}
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
