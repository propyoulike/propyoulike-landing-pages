import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useRef } from "react";
import CTAButtons from "@/components/CTAButtons";

interface ViewImage {
  src: string;
  title?: string;
}

interface ViewsProps {
  id?: string;
  title?: string;
  subtitle?: string;
  images: ViewImage[];
  onCtaClick: () => void;
}

const Views = ({
  id = "views",
  title = "Mesmerizing Views",
  subtitle = "",
  images = [],
  onCtaClick,
}: ViewsProps) => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 1 })]
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);

  /* -------------------------------
      Track Section View
  ------------------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!hasTrackedView.current && entries[0].isIntersecting) {
          hasTrackedView.current = true;

          // GA
          if (typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "section_view", {
              event_category: "engagement",
              event_label: "Views Section",
            });
          }

          // Meta Pixel
          if (typeof (window as any).fbq === "function") {
            (window as any).fbq("trackCustom", "ViewsSectionViewed");
          }
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------
      Track Image Click
  ------------------------------- */
  const handleImageClick = (title?: string) => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "image_click", {
        event_category: "engagement",
        event_label: title || "Gallery Image",
      });
    }

    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "ImageClicked", { image: title });
    }
  };

  /* -------------------------------
      CTA Click
  ------------------------------- */
  const handleCtaClick = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: "Views Section CTA",
      });
    }

    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "ViewsCTAClicked");
    }

    onCtaClick();
  };

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {title}
          </h2>

          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {images.map((view, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_45%]"
                onClick={() => handleImageClick(view.title)}
                style={{ boxShadow: "var(--shadow-strong)" }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={view.src}
                    alt={view.title || ""}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                  />
                </div>

                {view.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-semibold text-lg">{view.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons onFormOpen={handleCtaClick} variant="compact" />
        </div>
      </div>
    </section>
  );
};

export default Views;
