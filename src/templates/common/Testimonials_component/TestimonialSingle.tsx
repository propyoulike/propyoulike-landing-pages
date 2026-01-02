import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";
import TestimonialCard from "./TestimonialCard";

interface Testimonial {
  name: string;
  quote?: string;
  rating?: number;
  videoId?: string;
  thumbUrl?: string;
}

export default function TestimonialSingle({ t }: { t: Testimonial }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const { openCTA } = useLeadCTAContext();

  // Reset video if testimonial changes
  useEffect(() => {
    setActiveVideo(null);
  }, [t]);

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
            openCTA(
              "testimonial_single_book_site_visit",
              "I want to book a site visit after watching a testimonial."
            )
          }
        >
          Book Site Visit
        </Button>
      </div>
    </div>
  );
}
