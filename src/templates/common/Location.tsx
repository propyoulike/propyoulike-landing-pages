import { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CTAButtons from "@/components/CTAButtons";
import { ChevronDown } from "lucide-react";

export interface LocationCategory {
  title: string;
  items: string[];
}

interface LocationProps {
  videoUrl: string;
  mapUrl: string;
  categories: LocationCategory[];
  onCtaClick: () => void;
}

export default function Location({
  videoUrl,
  mapUrl,
  categories,
  onCtaClick,
}: LocationProps) {
  const [videoVisible, setVideoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Lazy load behavior
  useEffect(() => {
    const observe = (
      ref: React.RefObject<HTMLDivElement>,
      setVisible: (v: boolean) => void,
      section: string
    ) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true);

            if (typeof (window as any).gtag === "function")
              (window as any).gtag("event", "location_section_view", {
                section,
              });

            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref.current);
    };

    observe(videoRef, setVideoVisible, "video");
    observe(mapRef, setMapVisible, "map");
  }, []);

  return (
    <section id="location" className="py-14 md:py-20 bg-muted/30 w-full">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            The Perfect <span className="text-primary">Setting</span>
          </h2>
          <p className="text-muted-foreground mt-4">
            Everything you need within easy reach.
          </p>
        </div>

        {/* Video + Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto gap-6 mb-12">
          {/* VIDEO */}
          <div ref={videoRef} className="rounded-xl overflow-hidden h-[260px] md:h-[420px]">
            {videoVisible && (
              <iframe
                src={`${videoUrl}?autoplay=1&mute=1&controls=0&loop=1`}
                className="w-full h-full rounded-xl shadow-lg"
                title="Location Video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope"
              />
            )}
          </div>

          {/* MAP */}
          <div ref={mapRef} className="rounded-xl overflow-hidden h-[260px] md:h-[420px]">
            {mapVisible && (
              <iframe
                src={mapUrl}
                className="w-full h-full rounded-xl shadow-lg"
                title="Location Map"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-4">
            {(categories ?? []).map((section, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-border bg-card rounded-xl shadow-sm"
              >
                <AccordionTrigger className="px-4 py-3 text-lg font-semibold">
                  {section.title}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 data-[state=open]:rotate-180" />
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-3">
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    {(section.items ?? []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto">
          <CTAButtons onFormOpen={onCtaClick} />
        </div>
      </div>
    </section>
  );
}
