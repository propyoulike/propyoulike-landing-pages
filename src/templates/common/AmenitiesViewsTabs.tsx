// src/templates/common/AmenitiesViewsTabs.tsx
import { memo, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronDown, ChevronUp, Images, Sparkles } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

interface AmenityImage {
  src: string;
  title: string;
  description: string;
}

interface AmenityCategory {
  title: string;
  items: string[];
}

interface ViewImage {
  src: string;
  title?: string;
}

interface AmenitiesViewsTabsProps {
  // Amenities props
  amenitiesTitle?: string;
  amenitiesSubtitle?: string;
  amenityImages?: AmenityImage[];
  amenityCategories?: AmenityCategory[];
  // Views props
  viewsTitle?: string;
  viewsSubtitle?: string;
  viewImages?: ViewImage[];
  // Common
  onCtaClick?: () => void;
}

const AmenitiesViewsTabs = memo(function AmenitiesViewsTabs({
  amenitiesTitle = "World-Class Amenities",
  amenitiesSubtitle,
  amenityImages = [],
  amenityCategories = [],
  viewsTitle = "Model Flats & Views",
  viewsSubtitle,
  viewImages = [],
  onCtaClick,
}: AmenitiesViewsTabsProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // Amenities carousel
  const [amenitiesEmblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.8 })]
  );

  // Views carousel - world class styling
  const [viewsEmblaRef] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: true },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.6 })]
  );

  return (
    <section
      id="amenities"
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <Tabs defaultValue="amenities" className="w-full">
          {/* Tab Triggers */}
          <div className="flex justify-center mb-12">
            <TabsList className="h-auto p-1.5 bg-muted/50 rounded-2xl">
              <TabsTrigger
                value="amenities"
                className="flex items-center gap-2 px-6 py-3 text-base md:text-lg font-medium rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Amenities</span>
              </TabsTrigger>
              <TabsTrigger
                value="views"
                className="flex items-center gap-2 px-6 py-3 text-base md:text-lg font-medium rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Images className="w-5 h-5" />
                <span>Model Flats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="mt-0">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
                {amenitiesTitle}
              </h2>
              {amenitiesSubtitle && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {amenitiesSubtitle}
                </p>
              )}
            </div>

            {/* Image Carousel */}
            <div className="overflow-hidden mb-12" ref={amenitiesEmblaRef}>
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
                      <h4 className="text-white font-bold text-lg md:text-xl mb-1 md:mb-2">
                        {amenity.title}
                      </h4>
                      <p className="text-white/90 text-sm md:text-base line-clamp-2">
                        {amenity.description}
                      </p>
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
                        <h3 className="text-base md:text-lg font-bold text-foreground">
                          {category.title}
                        </h3>
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
                            <li
                              key={itemIndex}
                              className="text-muted-foreground text-sm flex items-start"
                            >
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
          </TabsContent>

          {/* Views/Model Flats Tab - World Class Design */}
          <TabsContent value="views" className="mt-0">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
                {viewsTitle}
              </h2>
              {viewsSubtitle && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {viewsSubtitle}
                </p>
              )}
            </div>

            {/* Premium Gallery Carousel */}
            <div className="overflow-hidden mb-12" ref={viewsEmblaRef}>
              <div className="flex gap-6 md:gap-8 will-change-transform py-4">
                {viewImages.map((view, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_60%] lg:flex-[0_0_50%] transform-gpu group"
                  >
                    {/* Premium Card with Glow Effect */}
                    <div className="relative bg-card border border-border/50 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-primary/20 group-hover:border-primary/30">
                      {/* Image Container */}
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={view.src}
                          alt={view.title || "Model flat view"}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {/* Title Badge */}
                      {view.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            <div>
                              <p className="text-white font-bold text-lg md:text-xl">
                                {view.title}
                              </p>
                              <p className="text-white/70 text-sm">
                                Click to explore
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hover Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Count Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
                <Images className="w-4 h-4" />
                <span>{viewImages.length} premium model flat views</span>
              </div>
            </div>
          </TabsContent>

          {/* CTA */}
          <div className="flex justify-center pt-8">
            <CTAButtons variant="compact" onFormOpen={onCtaClick} />
          </div>
        </Tabs>
      </div>
    </section>
  );
});

export default AmenitiesViewsTabs;
