// src/templates/common/Testimonials_component/TestimonialSingle.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialSingle({ t }: { t: any }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { openCTA } = useLeadCTAContext();

  return (
    <div className="max-w-3xl mx-auto">

      {/* Testimonial */}
      <TestimonialCard
        t={t}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        isLarge
      />

      {/* ✅ Soft, trust-follow-up CTA */}
      <div className="flex justify-center mt-12">
        <Button
          size="lg"
          variant="secondary"
          className="rounded-xl px-10"
          onClick={() =>
            openCTA({
              source: "testimonials",
              label: "Single Testimonial – Book Site Visit",
            })
          }
        >
          Book Site Visit
        </Button>
      </div>

    </div>
  );
}
