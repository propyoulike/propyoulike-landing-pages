import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import CTAButtons from "@/components/CTAButtons";
import { useState, useEffect } from "react";

interface FloorPlansProps {
  onCtaClick: () => void;
  section: any;
}

const FloorPlans = ({ onCtaClick, section }: FloorPlansProps) => {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // ESC closes zoom modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomImage(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Convert flat arrays → tab data
  const floorTabs = section.floorPlans.map((item: any) => ({
    label: item.title,
    plans: [item],
  }));

  const unitTabs = section.unitPlans.map((item: any) => ({
    label: item.title,
    plans: [item],
  }));

  return (
    <section className="py-20 lg:py-28 scroll-mt-32 bg-background relative" id="floorplans">
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

        {/* ---------- MAIN TABS ---------- */}
        <Tabs defaultValue="master-plan" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-gray-50 rounded-xl p-1">
            <TabsTrigger value="master-plan" className="rounded-lg">Master Plan</TabsTrigger>
            <TabsTrigger value="floor-plans" className="rounded-lg">Floor Plans</TabsTrigger>
            <TabsTrigger value="unit-plans" className="rounded-lg">Unit Plans</TabsTrigger>
          </TabsList>

          {/* ===================== MASTER PLAN ===================== */}
          <TabsContent value="master-plan">
            <Card className="p-6 lg:p-8 max-w-4xl mx-auto">
              <div className="relative group cursor-zoom-in">
                <img
                  src={section.masterPlan.image}
                  alt="Master Plan"
                  className="w-full h-auto rounded-xl object-contain bg-gray-50"
                  loading="lazy"
                  onClick={() => setZoomImage(section.masterPlan.image)}
                />
              </div>
            </Card>
          </TabsContent>

          {/* ===================== FLOOR PLANS ===================== */}
          <TabsContent value="floor-plans">
            <Tabs defaultValue={floorTabs[0]?.label}>
              
              {/* Sub-tabs */}
              <TabsList className="flex flex-wrap gap-2 mb-8 justify-center">
                {floorTabs.map((tab: any, i: number) => (
                  <TabsTrigger
                    key={i}
                    value={tab.label}
                    className="rounded-lg px-4 py-2"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {floorTabs.map((tab: any, i: number) => (
                <TabsContent key={i} value={tab.label}>
                  
                  {/* CENTERED 2-COLUMN PREMIUM GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center place-items-center">
                    {tab.plans.map((plan: any, j: number) => (
                      <Card
                        key={j}
                        className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white max-w-md w-full"
                      >
                        <div className="relative cursor-zoom-in">
                          <img
                            src={plan.image}
                            alt={plan.title}
                            className="w-full aspect-[4/3] object-contain rounded-xl bg-gray-50"
                            loading="lazy"
                            onClick={() => setZoomImage(plan.image)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* ===================== UNIT PLANS ===================== */}
          <TabsContent value="unit-plans">
            <Tabs defaultValue={unitTabs[0]?.label}>

              {/* Unit tabs */}
              <TabsList className="flex flex-wrap gap-2 mb-8 justify-center">
                {unitTabs.map((tab: any, i: number) => (
                  <TabsTrigger
                    key={i}
                    value={tab.label}
                    className="rounded-lg px-4 py-2"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {unitTabs.map((tab: any, i: number) => (
                <TabsContent key={i} value={tab.label}>
                  
                  {/* CENTERED 2-COLUMN GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center place-items-center">
                    {tab.plans.map((plan: any, j: number) => (
                      <Card
                        key={j}
                        className="p-7 rounded-2xl shadow-lg hover:shadow-xl transition bg-white max-w-md w-full"
                      >

                        {/* Image */}
                        <div className="relative mb-5 cursor-zoom-in">
                          <img
                            src={plan.floorPlanImage}
                            alt={plan.title}
                            className="w-full aspect-[4/3] object-contain rounded-xl bg-gray-50"
                            loading="lazy"
                            onClick={() => setZoomImage(plan.floorPlanImage)}
                          />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                        <div className="space-y-1 text-sm">
                          <p><strong>SBA:</strong> {plan.sba}</p>
                          <p><strong>Carpet:</strong> {plan.ca}</p>
                          <p><strong>Usable:</strong> {plan.usable}</p>
                          <p><strong>UDS:</strong> {plan.uds}</p>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={onCtaClick}
                          className="w-full mt-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition"
                        >
                          Schedule a Site Visit
                        </button>

                      </Card>
                    ))}
                  </div>

                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* ---------- SECTION CTA ---------- */}
        <div className="mt-16 text-center">
          <CTAButtons onFormOpen={onCtaClick} variant="compact" label="Schedule Your Free Site Visit" />
        </div>
      </div>

      {/* ===================== ZOOM MODAL ===================== */}
      {zoomImage && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center">
          <div className="absolute inset-0" onClick={() => setZoomImage(null)} />
          <button
            className="absolute top-5 right-5 text-4xl text-white"
            onClick={() => setZoomImage(null)}
          >
            ×
          </button>
          <div className="max-w-[95%] max-h-[95%] rounded-xl overflow-hidden">
            <img src={zoomImage} className="object-contain w-full h-full" />
          </div>
        </div>
      )}

      {/* ===================== GLOBAL STICKY CTA ===================== */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[999] bg-primary text-white 
                   text-center py-4 font-semibold text-lg cursor-pointer lg:hidden"
        onClick={onCtaClick}
      >
        Book a Site Visit
      </div>
    </section>
  );
};

export default FloorPlans;
