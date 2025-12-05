import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";
import { useRef, useState, useEffect } from "react";

interface FloorPlansProps {
  onCtaClick: () => void;
  trackGA?: (event: string, data?: any) => void;
  trackFB?: (event: string, data?: any) => void;
  section: {
    title: string;
    subtitle: string;
    unitPlans: {
      title: string;
      videoUrl: string;
      description: string;
      sba: string;
      ca: string;
      usable: string;
      uds: string;
      price: string;
      floorPlanImage?: string;
    }[];
    floorPlans: {
      title: string;
      image: string;
      description: string;
    }[];
    masterPlan: {
      image: string;
      title: string;
      description: string;
    };
    ctaText: string;
  };
}

const FloorPlans = ({ onCtaClick, trackGA, trackFB, section }: FloorPlansProps) => {

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const convertToEmbed = (url: string) => {
    if (url.includes("shorts")) return url.replace("shorts/", "embed/");
    if (url.includes("youtu.be")) return url.replace("youtu.be/", "youtube.com/embed/");
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomImage(null);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);

            const video = section.unitPlans[index];
            trackGA?.("video_scroll_inview", {
              category: "Unit Plan",
              label: video.title,
              value: index
            });
            trackFB?.("VideoView", { title: video.title });
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="floorplans"
      ref={sectionRef}
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4">

        {/* TITLE + SUBTITLE */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        <Tabs defaultValue="unit-plans" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto">
            <TabsTrigger value="unit-plans">Unit Plans</TabsTrigger>
            <TabsTrigger value="floor-plans">Floor Plans</TabsTrigger>
            <TabsTrigger value="master-plan">Master Plan</TabsTrigger>
          </TabsList>

          {/* UNIT PLANS */}
          <TabsContent value="unit-plans" className="space-y-8">
            <div className="flex gap-6 overflow-x-auto py-4">
              {section.unitPlans.map((video, i) => {
                const isOpen = expanded === i;
                const isActive = activeIndex === i;

                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-[300px] border-2 rounded-lg p-4 transition-all ${
                      isActive ? "border-primary" : "border-muted/50"
                    }`}
                    ref={(el) => (videoRefs.current[i] = el)}
                    data-index={i}
                  >
                    {/* Thumbnail / Video */}
                    <div
                      className="w-full h-40 bg-black mb-3 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setIsFullscreen(true)}
                    >
                      {isActive ? (
                        <iframe
                          src={convertToEmbed(video.videoUrl) + "?autoplay=1"}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={`https://img.youtube.com/vi/${video.videoUrl.split("/").pop()}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Expand button */}
                    <button
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => {
                        setExpanded(isOpen ? null : i);
                        if (!isOpen) {
                          trackGA?.("unit_plan_expand", {
                            category: "Unit Plan",
                            label: video.title
                          });
                          trackFB?.("ViewContent", { title: video.title });
                        }
                      }}
                    >
                      <h3 className="text-lg font-bold text-foreground">{video.title}</h3>
                      <span
                        className={`transition-transform duration-300 text-2xl ${
                          isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      >
                        &gt;
                      </span>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="mb-1 font-semibold">Description:</p>
                        <p>{video.description}</p>

                        <p className="mt-2 font-semibold">Super Builtup Area: {video.sba}</p>
                        <p>Carpet Area: {video.ca}</p>
                        <p>Usable Area: {video.usable}</p>
                        <p>Undivided Share: {video.uds}</p>

                        <p className="text-primary font-semibold">Price: {video.price}</p>

                        {video.floorPlanImage && (
                          <img
                            src={video.floorPlanImage}
                            alt=""
                            className="mt-3 w-full rounded-lg cursor-zoom-in"
                            onClick={() => setZoomImage(video.floorPlanImage)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* FLOOR PLANS */}
          <TabsContent value="floor-plans" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.floorPlans.map((plan, i) => (
                <Card key={i} className="p-6 hover:shadow-xl transition-shadow">
                  <button
                    onClick={() => setZoomImage(plan.image)}
                    className="w-full p-0 bg-transparent border-0 text-left"
                    type="button"
                  >
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-full h-auto rounded-lg cursor-zoom-in"
                    />
                  </button>
                  <h3 className="text-2xl font-bold my-3 text-foreground">
                    {plan.description}
                  </h3>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* MASTER PLAN */}
          <TabsContent value="master-plan" className="space-y-8">
            <Card className="p-8">
              <img
                src={section.masterPlan.image}
                alt={section.masterPlan.title}
                className="w-full h-auto rounded-xl"
              />
              <div className="text-center mt-6 space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  {section.masterPlan.title}
                </h3>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  {section.masterPlan.description}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">{section.ctaText}</p>
          <CTAButtons onFormOpen={onCtaClick} />
        </div>
      </div>

      {/* IMAGE ZOOM */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-w-[95%] max-h-[95%] rounded-lg shadow-lg"
            alt=""
          />
        </div>
      )}

      {/* FULLSCREEN VIDEO */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <iframe
            src={convertToEmbed(section.unitPlans[activeIndex].videoUrl) + "?autoplay=1"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
            className="w-full h-full max-w-[90%] max-h-[90%]"
          />
        </div>
      )}
    </section>
  );
};

export default FloorPlans;
