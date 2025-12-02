import { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CTAButtons from "./CTAButtons";
import { ChevronDown } from "lucide-react";

interface LocationSection {
  title: string;
  items: string[];
}

interface LocationProps {
  onCtaClick: () => void;
  sections: LocationSection[]; // dynamic sections
  videoUrl?: string;
  mapUrl?: string;
  heading?: string;
  subheading?: string;
  tagline?: string;
}

export default function Location({
  onCtaClick,
  sections,
  videoUrl,
  mapUrl,
  heading = "The Perfect Setting",
  subheading = "Everything you need within easy reach — schools, hospitals, connectivity & more.",
  tagline = "Life. Convenience. Future-ready.",
}: LocationProps) {
  const [videoVisible, setVideoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // ---------- GA / Meta Tracking ----------
  const trackView = (sectionName: string) => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "section_view", {
        event_category: "engagement",
        event_label: sectionName,
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", `${sectionName}Viewed`);
    }
  };

  const handleCtaClick = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "cta_click_location", {
        section: "Location",
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("track", "Lead");
    }
    onCtaClick();
  };

  // ---------- Lazy Load Video + Map ----------
  useEffect(() => {
    const observeSection = (
      ref: React.RefObject<HTMLDivElement>,
      setVisible: (value: boolean) => void,
      sectionName: string
    ) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true);
            trackView(sectionName);
            observer.disconnect();
          }
        },
        { threshold: 0.25 }
      );

      observer.observe(ref.current);
    };

    if (videoUrl) observeSection(videoRef, setVideoVisible, "LocationVideo");
    if (mapUrl) observeSection(mapRef, setMapVisible, "LocationMap");
  }, [videoUrl, mapUrl]);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="w-full py-14 md:py-20 bg-muted/30 scroll-mt-32"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {heading.split(" ").map((word, i) =>
              word === "Setting" ? <span key={i} className="text-primary">{word}</span> : word + " "
            )}
          </h2>

          <p className="mt-3 text-muted-foreground text-lg">{subheading}</p>
          <p className="mt-1 text-muted-foreground text-base italic">{tagline}</p>
        </div>

        {/* Video + Map Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {videoUrl && (
            <div ref={videoRef} className="w-full h-[260px] sm:h-[300px] md:h-[420px] rounded-xl overflow-hidden">
              {videoVisible && (
                <iframe
                  src={videoUrl}
                  className="w-full h-full rounded-xl shadow-lg"
                  title="Location Video"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          )}

          {mapUrl && (
            <div ref={mapRef} className="w-full h-[260px] sm:h-[300px] md:h-[420px] rounded-xl overflow-hidden">
              {mapVisible && (
                <iframe
                  src={mapUrl}
                  className="w-full h-full rounded-xl shadow-lg"
                  loading="lazy"
                  title="Location Map"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          )}
        </div>

        {/* Accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-3">
            {sections.map((section, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-2xl bg-card shadow-sm"
              >
                <AccordionTrigger
                  className="px-4 py-2 flex justify-between items-center text-base md:text-lg font-semibold hover:no-underline [&>svg]:hidden"
                >
                  <span>{section.title}</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 data-[state=open]:rotate-180" />
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-2 pt-1">
                  <ul className="list-disc ml-5 space-y-1 text-sm md:text-base text-muted-foreground">
                    {section.items.map((item, i) => (
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
          <CTAButtons onFormOpen={handleCtaClick} />
        </div>
      </div>
    </section>
  );
}
