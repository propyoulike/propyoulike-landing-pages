import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";
import { useState, useEffect } from "react";

interface FloorPlansProps {
  onCtaClick: () => void;
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

const FloorPlans = ({ onCtaClick, section }: FloorPlansProps) => {

  /* ---------- IMAGE ZOOM STATE ---------- */
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  /* ---------- ESC TO CLOSE ---------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomImage(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section className="py-20 lg:py-28 scroll-mt-32 bg-background" id="floorplans">
      <div className="container mx-auto px-4">

        {/* ---------- TITLE ---------- */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-foreground">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {section.subtitle}
          </p>
        </div>

        {/* ---------- TABS ---------- */}
        <Tabs defaultValue="master-plan" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto">
            <TabsTrigger value="master-plan">Master Plan</TabsTrigger>
            <TabsTrigger value="floor-plans">Floor Plans</TabsTrigger>
            <TabsTrigger value="unit-plans">Unit Plans</TabsTrigger>
          </TabsList>

          {/* ---------- MASTER PLAN ---------- */}
          <TabsContent value="master-plan">
            <Card className="p-8">
              <img
                src={section.masterPlan.image}
                alt={section.masterPlan.title}
                className="w-full h-auto rounded-xl cursor-zoom-in"
                onClick={() => setZoomImage(section.masterPlan.image)}
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

          {/* ---------- FLOOR PLANS ---------- */}
          <TabsContent value="floor-plans" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.floorPlans.map((plan, i) => (
                <Card key={i} className="p-6 hover:shadow-xl transition-shadow">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-auto rounded-lg mb-4 cursor-zoom-in"
                    onClick={() => setZoomImage(plan.image)}
                  />
                  <h3 className="text-xl font-bold">{plan.description}</h3>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---------- UNIT PLANS ---------- */}
          <TabsContent value="unit-plans" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.unitPlans.map((plan, i) => (
                <Card key={i} className="p-6 hover:shadow-xl transition-shadow">
                  {plan.floorPlanImage && (
                    <img
                      src={plan.floorPlanImage}
                      alt=""
                      className="w-full h-auto rounded-lg mb-4 cursor-zoom-in"
                      onClick={() => setZoomImage(plan.floorPlanImage!)}
                    />
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {plan.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {plan.description}
                  </p>
                  <div className="text-sm text-foreground space-y-1">
                    <p><strong>SBA:</strong> {plan.sba}</p>
                    <p><strong>Carpet:</strong> {plan.ca}</p>
                    <p><strong>Usable:</strong> {plan.usable}</p>
                    <p><strong>UDS:</strong> {plan.uds}</p>
                  </div>
                  <p className="mt-3 text-primary font-semibold text-lg">
                    ₹ {plan.price}
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* ---------- CTA ---------- */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">{section.ctaText}</p>
          <div className="flex justify-center">
            <CTAButtons onFormOpen={onCtaClick} variant="compact" />
          </div>
        </div>
      </div>

      {/* ---------- IMAGE ZOOM MODAL ---------- */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            className="max-w-[95%] max-h-[95%] rounded-lg shadow-xl"
          />

          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl font-bold"
            onClick={() => setZoomImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default FloorPlans;
