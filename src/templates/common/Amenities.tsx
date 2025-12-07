// src/templates/common/Amenities.tsx
import { memo, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import CTAButtons from "@/components/CTAButtons";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AmenitiesProps {
  heroTitle?: string;
  heroSubtitle?: string;
  amenityImages?: { src: string; title: string; description: string }[];
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

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.8 })]
  );

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
          <div className="flex gap-4 md:gap-6 will-change-transform">
            {amenityImages.map((amenity, index) => (
              <div
                key={index}
                className="group relative rounded-xl md:rounded-2xl overflow-hidden flex-[0_0_75%] sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_30%] transform-gpu"
                style={{ boxShadow: "var(--shadow-strong)" }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={amenity.src}
                    alt={amenity.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                  <h4 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">{amenity.title}</h4>
                  <p className="text-white/90 text-sm md:text-base line-clamp-2">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-7xl mx-auto">
          {amenityCategories.map((category, index) => {
            const isExpanded = expandedCategory === index;

            return (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden border border-border"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : index)}
                  className="w-full p-4 md:p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-bold text-foreground">{category.title}</h3>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 animate-accordion-down">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-muted-foreground text-sm flex items-start">
                          <span className="text-primary mr-2 flex-shrink-0">•</span>
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

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons variant="compact" onFormOpen={onCtaClick} />
        </div>

      </div>
    </section>
  );
});

export default Amenities;
