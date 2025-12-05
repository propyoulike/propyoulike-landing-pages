import { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Play } from "lucide-react";
import CTAButtons from "./CTAButtons";
export interface Testimonial {
  name: string;
  quote: string;
  videoId?: string; // optional video
  thumbnailUrl?: string; // optional thumbnail override
  embedUrl?: string; // optional embed URL override
}

interface CustomerSpeaksProps {
  testimonials: Testimonial[];
  onCtaClick: () => void;
}

const CustomerSpeaks = ({ testimonials, onCtaClick }: CustomerSpeaksProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, stopOnInteraction: true, speed: 0.8 })]
  );

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            Real Experiences. <span className="text-primary">Real People.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hear from people who experienced it themselves.
          </p>
        </div>

        <div className="overflow-hidden mb-12" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex-[0_0_100%] md:flex-[0_0_85%] lg:flex-[0_0_70%]"
              >
                <div
                  className="bg-card rounded-2xl overflow-hidden h-full"
                  style={{ boxShadow: "var(--shadow-strong)" }}
                >
                  {t.videoId ? (
                    <div className="relative aspect-video group cursor-pointer">
                      {activeVideo === t.videoId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={
                            t.embedUrl ??
                            `https://www.youtube.com/embed/${t.videoId}?autoplay=1`
                          }
                          title={`${t.name} Testimonial`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <>
                          <img
                            src={
                              t.thumbnailUrl ??
                              `https://img.youtube.com/vi/${t.videoId}/maxresdefault.jpg`
                            }
                            alt={`${t.name} Testimonial`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setActiveVideo(t.videoId!)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                          >
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play
                                className="w-10 h-10 text-primary-foreground ml-1"
                                fill="currentColor"
                              />
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                  <div className="p-6">
                    <p className="text-muted-foreground mb-3 italic text-lg">
                      "{t.quote}"
                    </p>
                    <p className="font-semibold text-foreground">— {t.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CTAButtons onFormOpen={onCtaClick} />
      </div>
    </section>
  );
};

export default CustomerSpeaks;
