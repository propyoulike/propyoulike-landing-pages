import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Maximize2 } from "lucide-react";

interface FloorPlan {
  type: string;
  size: string;
  bedrooms?: string;
  bathrooms?: string;
  image: string;
  price?: string;
}

interface FloorPlansProps {
  floorPlans: FloorPlan[];
}

const FloorPlans = ({ floorPlans }: FloorPlansProps) => {
  const uniqueTypes = Array.from(new Set(floorPlans.map(plan => plan.type)));

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Floor Plans
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from thoughtfully designed layouts that suit your lifestyle
          </p>
        </div>

        <Tabs defaultValue={uniqueTypes[0]} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8" style={{ gridTemplateColumns: `repeat(${uniqueTypes.length}, 1fr)` }}>
            {uniqueTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="font-semibold">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {uniqueTypes.map((type) => (
            <TabsContent key={type} value={type}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {floorPlans
                  .filter(plan => plan.type === type)
                  .map((plan, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={plan.image}
                          alt={`${plan.type} floor plan`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-xl font-bold text-foreground">
                            {plan.type}
                          </h3>
                          {plan.price && (
                            <span className="text-accent font-semibold text-lg">
                              {plan.price}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {plan.bedrooms && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Home className="w-4 h-4" />
                              <span>{plan.bedrooms} Bedrooms</span>
                              {plan.bathrooms && <span>• {plan.bathrooms} Bathrooms</span>}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Maximize2 className="w-4 h-4" />
                            <span>{plan.size}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FloorPlans;
