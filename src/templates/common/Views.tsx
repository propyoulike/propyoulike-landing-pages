import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useRef, useState } from "react";
import CTAButtons from "./CTAButtons";

interface ViewItem {
  src: string;
  title: string;
}

interface ViewsProps {
  onCtaClick: () => void;
  images: ViewItem[];
  heading?: string;
  subheading?: string;
  sectionId?: string;
}

export default function Views({
  onCtaClick,
  images,
  heading = "Mesmerizing Views",
  subheading = "Wake up to greenery and open spaces. Enjoy a sanctuary at home.",
  sectionId = "views",
}: ViewsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 1 })]
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const hasTrackedView = useRef(false);
  const [visible, setVisible] = useState(false);

  // ---------- Track Section View ----------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          setVisible(true);

          setTimeout(() => {
            if (typeof (window as any).gtag === "function") {
              (window as any).gtag("event", "section_view", {
                event_category: "engagement",
                event_label: `${sectionId} Section`,
              });
            }
            if (typeof (window as any).fbq === "function") {
              (window as any).fbq("trackCustom", `${sectionId}Viewed`);
            }
          }, 300);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [sectionId]);

  const handleImageClick = (title: string) => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "image_click", {
        event_category: "engagement",
        event_label: title,
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", "ImageClicked", { image: title });
    }
  };

  const handleCtaClick = () => {
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: `${sectionId} CTA`,
      });
    }
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq("trackCustom", `${sectionId}CTAClicked`);
    }
    onCtaClick();
  };

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {heading.split(" ").map((word, i) =>
              i === heading.split(" ").length - 1 ? (
                <span key={i} className="text-primary">{word}</span>
              ) : word + " "
            )}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{subheading}</p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {images.map((view, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_45%]"
                style={{ boxShadow: "var(--shadow-strong)" }}
                onClick={() => handleImageClick(view.title)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={view.src}
                    alt={view.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-semibold text-lg">{view.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <CTAButtons onFormOpen={handleCtaClick} />
      </div>
    </section>
  );
}
