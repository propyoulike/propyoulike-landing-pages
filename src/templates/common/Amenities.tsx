// src/templates/common/Amenities.tsx
import useEmblaCarousel from "embla-carousel-react";
import CTAButtons from "@/components/CTAButtons";
import AutoScroll from "embla-carousel-auto-scroll";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AmenitiesProps {
  heroTitle?: string;
  heroSubtitle?: string;
  amenityImages?: { src: string; title: string; description: string }[];
  amenityCategories?: { title: string; items: string[] }[];
}

const Amenities = ({
  heroTitle,
  heroSubtitle,
  amenityImages = [],
  amenityCategories = [],
}: AmenitiesProps) => {

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 1 })]
  );

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <section id="amenities" ref={sectionRef} className="py-20 lg:py-28 scroll-mt-32 bg-background">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">{heroTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{heroSubtitle}</p>
        </div>

        {/* Image Carousel */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {amenityImages.map((amenity, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                style={{ boxShadow: "var(--shadow-strong)" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={amenity.src}
                    alt={amenity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h4 className="text-white font-bold text-xl mb-2">{amenity.title}</h4>
                  <p className="text-white/90 text-base">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-7xl mx-auto">
          {amenityCategories.map((category, index) => {
            const isExpanded = expandedCategory === index;

            return (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden"
                style={{ boxShadow: "var(--shadow-medium)" }}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : index)}
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 animate-accordion-down">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ⭐ UNIVERSAL CTA BUTTONS — no props, auto-wired */}
        <CTAButtons />

      </div>
    </section>
  );
};

export default Amenities;
