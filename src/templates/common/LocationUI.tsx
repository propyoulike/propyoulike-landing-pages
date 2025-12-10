import { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CTAButtons from "@/components/CTAButtons";

interface Category {
  title: string;
  items: string[];
}

interface LocationUISection {
  id?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;

  videoId?: string; // YouTube video ID only
  mapUrl?: string;

  categories: Category[];

  ctaText?: string;
}

interface LocationUIProps {
  section: LocationUISection;
  onCtaClick: () => void;
}

export default function LocationUI({ section, onCtaClick }: LocationUIProps) {
  const {
    id = "locationUI",
    title,
    subtitle,
    tagline,
    videoId,
    mapUrl,
    categories = [],
    ctaText = "Enquire Now",
  } = section;

  const [videoVisible, setVideoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Build embed URL from video ID
  const videoEmbedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1`
    : null;

  /* ---------------- Lazy Load Video + Map ---------------- */
  useEffect(() => {
    const observe = (
      ref: React.RefObject<HTMLDivElement>,
      setVisible: (v: boolean) => void
    ) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(ref.current);
    };

    observe(videoRef, setVideoVisible);
    observe(mapRef, setMapVisible);
  }, []);

  return (
    <section id={id} className="w-full py-14 md:py-20 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary">{title.split(" ").slice(-1)}</span>
            </h2>
          )}

          {subtitle && (
            <p className="mt-3 text-muted-foreground text-lg">{subtitle}</p>
          )}

          {tagline && (
            <p className="mt-1 text-muted-foreground text-base italic">
              {tagline}
            </p>
          )}
        </div>

        {/* VIDEO + MAP */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

          <div ref={videoRef} className="w-full h-[260px] md:h-[420px] rounded-xl overflow-hidden">
            {videoVisible && videoEmbedUrl && (
              <iframe
                src={videoEmbedUrl}
                className="w-full h-full rounded-xl shadow-lg"
                title="Location Video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope"
                allowFullScreen
              />
            )}
          </div>

          <div ref={mapRef} className="w-full h-[260px] md:h-[420px] rounded-xl overflow-hidden">
            {mapVisible && mapUrl && (
              <iframe
                src={mapUrl}
                className="w-full h-full rounded-xl shadow-lg"
                title="Location Map"
                loading="lazy"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* ACCORDION */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-3">
            {categories.map((category, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-2xl bg-card shadow-sm px-2"
              >
                <AccordionTrigger className="px-4 py-4 text-lg font-semibold hover:no-underline">
                  {category.title}
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                    {category.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" label={ctaText} />
        </div>
      </div>
    </section>
  );
}
