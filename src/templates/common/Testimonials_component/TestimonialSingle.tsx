import TestimonialCard from "./TestimonialCard";
import CTAButtons from "@/components/CTAButtons";
import { useState } from "react";

export default function TestimonialSingle({
  t,
  title,
  subtitle,
  onCtaClick,
}: any) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        {title && (
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">{title}</h2>
        )}
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <TestimonialCard
        t={t}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        isLarge
      />

      <div className="flex justify-center mt-12">
        <CTAButtons onFormOpen={onCtaClick} variant="compact" />
      </div>
    </div>
  );
}
