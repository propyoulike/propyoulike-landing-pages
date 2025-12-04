// src/templates/common/FloorPlansTabs.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";
import { ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

interface UnitPlan {
  title: string;
  video: string;
  description?: string;
  sba?: string;
  ca?: string;
  usable?: string;
  uds?: string;
  price?: string;
  floorPlan?: string;
}

interface FloorPlan {
  title: string;
  image: string;
  description?: string;
}

interface FloorPlansTabsProps {
  onCtaClick: () => void;
  projectName: string;

  unitPlans: UnitPlan[];
  floorPlans: FloorPlan[];
  masterPlan?: string;
}

export default function FloorPlansTabs({
  onCtaClick,
  projectName,
  unitPlans,
  floorPlans,
  masterPlan,
}: FloorPlansTabsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /** -------------------------------------------------------
   * Embeddable YouTube URL transformer
   ------------------------------------------------------- */
  const embed = useCallback((url: string) => {
    if (!url) return url;

    if (url.includes("shorts")) return url.replace("shorts/", "embed/");
    if (url.includes("youtu.be"))
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");

    return url;
  }, []);

  /** -------------------------------------------------------
   * Central tracking funnel
   ------------------------------------------------------- */
  const track = useCallback(
    (event: string, data?: any) => {
      window?.dataLayer?.push({
        event,
        section: "floor_plans",
        project: projectName,
        ...data,
      });

      window?.fbq?.("trackCustom", event, data || {});
    },
    [projectName]
  );

  /** -------------------------------------------------------
   * Escape key closes fullscreen / zoom
   ------------------------------------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomImage(null);
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /** -------------------------------------------------------
   * Track which video card enters viewport
   ------------------------------------------------------- */
  useEffect(() => {
    if (!unitPlans.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const idx = Number(entry.target.getAttribute("data-index"));
          setActiveIndex(idx);

          track("video_scroll_in_view", {
            index: idx,
            unit_title: unitPlans[idx].title,
          });
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((el) => el && observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [unitPlans, track]);

  return (
    <section
      id="floorplanstabs"
      className="py-20 lg:py-28 scroll-mt-32 bg-background"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* ---------------- HEADER ---------------- */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
            Meticulously Designed <span className="text-primary">Homes</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Explore virtual walkthroughs & detailed floor plans
          </p>
        </div>

        {/* ---------------- TABS ---------------- */}
        <Tabs defaultValue="unit-plans">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto">
            <TabsTrigger
              value="unit-plans"
              onClick={() => track("tab_switch", { tab: "unit_plans" })}
            >
              Unit Plans
            </TabsTrigger>

            <TabsTrigger
              value="floor-plans"
              onClick={() => track("tab_switch", { tab: "floor_plans" })}
            >
              Floor Plans
            </TabsTrigger>

            <TabsTrigger
              value="master-plan"
              onClick={() => track("tab_switch", { tab: "master_plan" })}
            >
              Master Plan
            </TabsTrigger>
          </TabsList>

          {/* =====================================================
           * UNIT PLANS TAB
           ===================================================== */}
          <TabsContent value="unit-plans">
            <div className="flex gap-6 overflow-x-auto py-4 snap-x snap-mandatory">
              {unitPlans.map((unit, i) => {
                const isOpen = expanded === i;
                const isActive = activeIndex === i;
                const youtubeId = unit.video.split("/").pop();

                return (
                  <div
                    key={i}
                    ref={(el) => (videoRefs.current[i] = el)}
                    data-index={i}
                    className={`flex-shrink-0 snap-start w-[300px] border-2 rounded-xl p-4 transition-all ${
                      isActive ? "border-primary" : "border-muted/50"
                    }`}
                    style={{ boxShadow: "var(--shadow-medium)" }}
                  >
                    {/* ---- Video Thumbnail / Iframe ---- */}
                    <div
                      className="w-full h-40 rounded-lg overflow-hidden bg-black cursor-pointer mb-3"
                      onClick={() => {
                        setIsFullscreen(true);
                        track("video_fullscreen_open", { unit: unit.title });
                      }}
                    >
                      {isActive ? (
                        <iframe
                          src={embed(unit.video) + "?autoplay=1"}
                          allow="accelerometer; autoplay; encrypted-media"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                          alt={unit.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* ---- Title & Expand Toggle ---- */}
                    <button
                      className="flex justify-between items-center w-full text-left"
                      onClick={() => {
                        const willOpen = !isOpen;
                        setExpanded(willOpen ? i : null);
                        if (willOpen)
                          track("unit_plan_expand", { unit: unit.title });
                      }}
                    >
                      <h3 className="text-lg font-bold">{unit.title}</h3>

                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {/* ---- EXPANDED PANEL ---- */}
                    {isOpen && (
                      <div className="mt-3 text-sm text-muted-foreground space-y-2 animate-accordion-down">
                        {unit.description && <p>{unit.description}</p>}
                        {unit.sba && (
                          <p>
                            <strong>SBA:</strong> {unit.sba}
                          </p>
                        )}
                        {unit.ca && (
                          <p>
                            <strong>Carpet:</strong> {unit.ca}
                          </p>
                        )}
                        {unit.usable && (
                          <p>
                            <strong>Usable:</strong> {unit.usable}
                          </p>
                        )}
                        {unit.price && (
                          <p className="text-primary font-semibold">
                            Price: {unit.price}
                          </p>
                        )}

                        {unit.floorPlan && (
                          <img
                            src={unit.floorPlan}
                            alt="Unit Plan"
                            className="w-full rounded-lg cursor-zoom-in"
                            onClick={() => {
                              setZoomImage(unit.floorPlan!);
                              track("zoom_floorplan", { unit: unit.title });
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* =====================================================
           * FLOOR PLANS TAB
           ===================================================== */}
          <TabsContent value="floor-plans">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {floorPlans.map((plan, i) => (
                <Card
                  key={i}
                  className="p-6 hover:shadow-xl transition-shadow"
                  style={{ boxShadow: "var(--shadow-medium)" }}
                >
                  <button
                    className="w-full"
                    onClick={() => {
                      setZoomImage(plan.image);
                      track("zoom_floorplan", { plan: plan.title });
                    }}
                  >
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="w-full rounded-lg cursor-zoom-in"
                    />
                  </button>

                  <h3 className="text-xl font-bold mt-4">
                    {plan.description || plan.title}
                  </h3>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* =====================================================
           * MASTER PLAN TAB
           ===================================================== */}
          <TabsContent value="master-plan">
            <Card className="p-8">
              {masterPlan ? (
                <img
                  src={masterPlan}
                  alt="Master Plan"
                  className="w-full rounded-xl cursor-zoom-in"
                  onClick={() => {
                    setZoomImage(masterPlan);
                    track("zoom_masterplan");
                  }}
                />
              ) : (
                <p className="text-muted-foreground text-center">
                  Master plan not available
                </p>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* ---------------- CTA Section ---------------- */}
        <div className="mt-12 text-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" />
        </div>
      </div>

      {/* ---------------- IMAGE ZOOM OVERLAY ---------------- */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-w-[95%] max-h-[95%] rounded-lg shadow-xl"
            alt="Zoomed Floor Plan"
          />
        </div>
      )}

      {/* ---------------- FULLSCREEN VIDEO ---------------- */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
          onClick={() => setIsFullscreen(false)}
        >
          <iframe
            src={embed(unitPlans[activeIndex].video) + "?autoplay=1"}
            allowFullScreen
            className="w-full h-full max-w-[90%] max-h-[90%]"
          />
        </div>
      )}
    </section>
  );
}
