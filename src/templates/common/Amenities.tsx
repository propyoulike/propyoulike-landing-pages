// src/templates/common/Amenities.tsx
import { memo, useState, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import CTAButtons from "@/components/CTAButtons";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AmenitiesProps {
  heroTitle?: string;
  heroSubtitle?: string;
  amenityImages?: { src: string; title: string; description?: string }[];
  amenityCategories?: { title: string; items: string[] }[];
  onCtaClick?: () => void;
}

const Amenities = memo(function Amenities({
  heroTitle,
  heroSubtitle,
  amenityImages = [],
  amenityCategories = [],
  onCtaClick,
}: AmenitiesProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // --- Embla Setup ---
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 1.1 })]
  );

  // Pause on hover
  useEffect(() => {
    if (!emblaApi) return;
    const node = emblaRef.current;
    if (!node) return;

    const autoScroll = emblaApi.plugins()?.autoScroll;

    const enter = () => autoScroll?.stop();
    const leave = () => autoScroll?.play();

    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);

    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
    };
  }, [emblaApi]);

  // --- Scroll animations reveal ---
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        }),
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  // --- Spotlight mouse effect ---
  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", e.clientX - rect.left + "px");
    e.currentTarget.style.setProperty("--y", e.clientY - rect.top + "px");
  };

  return (
    <section id="amenities" ref={sectionRef} className="py-24 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-up">
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">{heroTitle}</h2>
          <p className="text-lg text-muted-foreground">{heroSubtitle}</p>
        </div>

        {/* ULTRA-LUXURY CAROUSEL */}
        <div className="overflow-hidden mb-20" ref={emblaRef}>
          <div
            className="
              flex gap-6 md:gap-8 will-change-transform
              pl-6 pr-6 md:pl-10 md:pr-10
              -ml-6 -mr-6 md:-ml-10 md:-mr-10
            "
          >
            {amenityImages.map((amenity, index) => (
              <div
                key={index}
                className="flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-[0_0_45%] lg:flex-[0_0_32%] px-2 fade-up"
              >
                <div
                  className="
                    relative rounded-3xl overflow-hidden tilt-card amenity-spotlight
                    transition-all duration-700
                    hover:shadow-2xl hover:-translate-y-2
                  "
                  style={{ boxShadow: "var(--shadow-strong)" }}
                  onMouseMove={handleSpotlight}
                >
                  {/* Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={amenity.src}
                      alt={amenity.title}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-700
                        group-hover:scale-110
                      "
                    />
                  </div>

                  {/* Parallax overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />

                  {/* Title & description */}
                  <div className="absolute bottom-6 left-0 w-full text-center px-6">
                    <h4 className="text-white text-2xl font-extrabold drop-shadow-xl">
                      {amenity.title}
                    </h4>
                    {amenity.description && (
                      <p className="text-white/90 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {amenity.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto fade-up">
          {amenityCategories.map((category, index) => {
            const open = expandedCategory === index;

            return (
              <div
                key={index}
                className={`
                  rounded-2xl border transition-all duration-300 overflow-hidden
                  ${open ? "border-primary/50 shadow-xl" : "border-border shadow-md"}
                `}
              >
                <button
                  onClick={() => setExpandedCategory(open ? null : index)}
                  className="w-full p-5 flex items-center justify-between hover:bg-muted/40"
                >
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                  {open ? <ChevronUp /> : <ChevronDown />}
                </button>

                {open && (
                  <div className="p-5 animate-accordion-down">
                    <ul className="space-y-2">
                      {category.items.map((item, i) => (
                        <li key={i} className="flex items-start text-muted-foreground">
                          <span className="text-primary mr-2 mt-[3px]">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16 fade-up">
          <CTAButtons variant="compact" onFormOpen={onCtaClick} />
        </div>
      </div>
    </section>
  );
});

export default Amenities;
