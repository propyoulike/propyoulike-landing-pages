import { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Play } from "lucide-react";
import CTAButtons from "@/components/CTAButtons";

interface Testimonial {
  name: string;
  videoId: string;
  quote?: string;
  thumbUrl?: string; // optional custom thumbnail
}

interface CustomerSpeaksProps {
  id?: string;
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  autoScrollSpeed?: number;
  onCtaClick: () => void;
}

export default function CustomerSpeaks({
  id = "customer-speaks",
  title = "What Our Customers Say",
  subtitle = "",
  testimonials = [],
  autoScrollSpeed = 0.8,
  onCtaClick,
}: CustomerSpeaksProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
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
          <div className="flex gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_100%] md:flex-[0_0_80%] lg:flex-[0_0_60%]"
              >
                <div
                  className="bg-card rounded-2xl overflow-hidden h-full"
                  style={{ boxShadow: "var(--shadow-strong)" }}
                >
                  {/* Video/Thumbnail */}
                  <div className="relative aspect-video group cursor-pointer">
                    {activeVideo === t.videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${t.videoId}?autoplay=1`}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
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
                        />

                        <button
                          onClick={() => {
                            setActiveVideo(t.videoId);
                            trackVideoPlay(t.name);
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition"
                        >
                          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="p-6">
                    {t.quote && (
                      <p className="text-muted-foreground italic text-lg mb-3">
                        "{t.quote}"
                      </p>
                    )}
                    <p className="font-semibold text-foreground">— {t.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <CTAButtons onFormOpen={onCtaClick} variant="compact" />
      </div>
    </section>
  );
}
