import { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CTAButtons from "@/components/CTAButtons";
import { cn } from "@/lib/utils";

interface Category {
  title: string;
  items: string[];
}

interface LocationUISection {
  id?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;

  videoId?: string;
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
    categories,
    ctaText = "Enquire Now",
  } = section;

  const [videoVisible, setVideoVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  const videoRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const videoEmbedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1`
    : null;

  /* Lazy-load Video + Map */
  useEffect(() => {
    const observe = (
      ref: React.RefObject<HTMLDivElement>,
      setVisible: (v: boolean) => void
    ) => {
      if (!ref.current) return;

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.25 }
      );

      obs.observe(ref.current);
    };

    observe(videoRef, setVideoVisible);
    observe(mapRef, setMapVisible);
  }, []);

  /* ICON MAP (Emoji fallback + SVG future-ready) */
  const iconMap: Record<string, string> = {
    Connectivity: "🚇",
    "IT Tech Parks": "💼",
    Hospitals: "🏥",
    "Shopping Malls": "🛍️",
    "Educational Institutions": "🎓",
  };

  return (
    <section
      id={id}
      className="w-full py-16 md:py-24 bg-gradient-to-b from-muted/15 to-muted/40 scroll-mt-32"
    >
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="text-primary">
                {title.split(" ").slice(-1)}
              </span>
            </h2>
          )}

          {subtitle && (
            <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
          )}

          {tagline && (
            <p className="mt-2 text-sm italic text-muted-foreground">{tagline}</p>
          )}
        </div>

        {/* VIDEO + MAP */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">

          <div
            ref={videoRef}
            className={cn(
              "relative rounded-2xl overflow-hidden shadow-xl bg-black/5",
              "transition-all duration-700",
              videoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {videoVisible && videoEmbedUrl && (
              <iframe
                src={videoEmbedUrl}
                className="w-full h-[260px] md:h-[420px]"
                title="Location Video"
                allow="autoplay; encrypted-media; gyroscope"
                allowFullScreen
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent" />
          </div>

          <div
            ref={mapRef}
            className={cn(
              "relative rounded-2xl overflow-hidden shadow-xl bg-black/5",
              "transition-all duration-700",
              mapVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {mapVisible && mapUrl && (
              <iframe
                src={mapUrl}
                className="w-full h-[260px] md:h-[420px]"
                title="Location Map"
                loading="lazy"
                allowFullScreen
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent" />
          </div>
        </div>

        {/* ULTRA PREMIUM ACCORDION */}
        <div className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-4">

            {categories.map((category, idx) => {
              const icon = iconMap[category.title] ?? "📍";

              return (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="accordion-card group"
                >
                  <AccordionTrigger
                    className="accordion-trigger flex items-center gap-4"
                  >
                    {/* ICON */}
                    <span className="text-2xl">{icon}</span>

                    {/* TITLE */}
                    <span className="flex-1 text-left">{category.title}</span>

                    {/* PREMIUM ARROW */}
                    <svg
                      className="
                        w-4 h-4 transition-transform duration-300
                        group-data-[state=open]:rotate-180
                      "
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                    </svg>
                  </AccordionTrigger>

                  {/* CONTENT */}
                  <AccordionContent
                    className="
                      px-6 pb-6 pt-2
                      animate-in fade-in slide-in-from-top-2 duration-300
                    "
                  >
                    <ul className="space-y-3">
                      {category.items.map((item, j) => (
                        <li
                          key={j}
                          className="
                            flex items-start gap-3
                            text-[1rem] text-muted-foreground
                          "
                        >
                          <span className="w-2 h-2 rounded-full bg-primary/70 mt-2"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}

          </Accordion>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons
            variant="compact"
            label={ctaText}
            onFormOpen={onCtaClick}
          />
        </div>
      </div>
    </section>
  );
}
