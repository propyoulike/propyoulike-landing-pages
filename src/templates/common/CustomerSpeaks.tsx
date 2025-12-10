import { memo, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Play, Star } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

interface Testimonial {
  name: string;
  videoId?: string; // YouTube video ID (optional - can be text-only review)
  quote?: string;
  rating?: number; // 1-5 star rating
  thumbUrl?: string;
}

interface CustomerSpeaksProps {
  id?: string;
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  autoScrollSpeed?: number;
  onCtaClick: () => void;
}

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 md:w-5 md:h-5 ${
            star <= rating
              ? "text-accent fill-accent"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
};

const CustomerSpeaks = memo(function CustomerSpeaks({
  id = "customer-speaks",
  title = "What Our Customers Say",
  subtitle = "",
  testimonials = [],
  autoScrollSpeed = 0.6,
  onCtaClick,
}: CustomerSpeaksProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: true,
        speed: autoScrollSpeed,
      }),
    ]
  );

  /* Pause autoplay when video playing */
  useEffect(() => {
    if (!emblaApi) return;
    activeVideo ? emblaApi.plugins().autoScroll.stop() : emblaApi.plugins().autoScroll.play();
  }, [activeVideo, emblaApi]);

  if (!testimonials.length) return null;

  const isSingleTestimonial = testimonials.length === 1;

  /* Tracking */
  const trackVideoPlay = (name: string) => {
    window?.gtag?.("event", "testimonial_video_play", {
      section: id,
      user: name,
    });

    window?.fbq?.("trackCustom", "TestimonialVideoPlay", {
      user: name,
    });
  };

  // Render a single testimonial card (used in both layouts)
  const TestimonialCard = ({ t, isLarge = false }: { t: Testimonial; isLarge?: boolean }) => {
    const hasVideo = !!t.videoId;
    
    return (
      <div
        className={`bg-card rounded-2xl overflow-hidden border border-border ${isLarge ? "" : "h-full"}`}
        style={{ boxShadow: "var(--shadow-strong)" }}
      >
        {/* Video (if available) */}
        {hasVideo && (
          <div className="relative aspect-video group cursor-pointer">
            {activeVideo === t.videoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${t.videoId}?autoplay=1`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              />
            ) : (
              <>
                <img
                  src={
                    t.thumbUrl ||
                    `https://img.youtube.com/vi/${t.videoId}/maxresdefault.jpg`
                  }
                  alt={t.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  onClick={() => {
                    setActiveVideo(t.videoId!);
                    trackVideoPlay(t.name);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                  aria-label={`Play video from ${t.name}`}
                >
                  <div className={`${isLarge ? "w-16 h-16 md:w-20 md:h-20" : "w-14 h-14 md:w-16 md:h-16"} bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Play className={`${isLarge ? "w-8 h-8 md:w-10 md:h-10" : "w-6 h-6 md:w-8 md:h-8"} text-white ml-1`} />
                  </div>
                </button>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`${isLarge ? "p-6 md:p-8" : "p-4 md:p-5"} ${!hasVideo ? "pt-6" : ""}`}>
          {/* Rating */}
          {t.rating && (
            <div className={`${isLarge ? "mb-4" : "mb-3"} ${!hasVideo && isLarge ? "flex justify-center" : ""}`}>
              <StarRating rating={t.rating} />
            </div>
          )}
          
          {/* Quote */}
          {t.quote && (
            <p className={`text-muted-foreground italic ${isLarge ? "text-lg md:text-xl mb-4 text-center" : "text-sm md:text-base mb-2 line-clamp-3"}`}>
              "{t.quote}"
            </p>
          )}
          
          {/* Name */}
          <p className={`font-semibold text-foreground ${isLarge ? "text-lg text-center" : "text-sm md:text-base"}`}>
            — {t.name}
          </p>
        </div>
      </div>
    );
  };

  // Single testimonial layout
  if (isSingleTestimonial) {
    const t = testimonials[0];
    return (
      <section
        id={id}
        ref={sectionRef}
        className="py-20 lg:py-28 scroll-mt-32 bg-background"
      >
        <div className="container mx-auto px-4">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            {title && (
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Single Featured Testimonial */}
          <div className="max-w-3xl mx-auto">
            <TestimonialCard t={t} isLarge />
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-12">
            <CTAButtons onFormOpen={onCtaClick} variant="compact" />
          </div>
        </div>
      </section>
    );
  }

  // Multiple testimonials - carousel layout
  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6 will-change-transform">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_60%] lg:flex-[0_0_50%] transform-gpu"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>
      </div>
    </section>
  );
});

export default CustomerSpeaks;
