import Hero from "../../common/Hero";
import Gallery from "../../common/Gallery";
import Amenities from "../../common/Amenities";
import FloorPlans from "../../common/FloorPlans";
import PriceTable from "../../common/PriceTable";
import LocationMap from "../../common/LocationMap";
import CTAButtons from "../../common/CTAButtons";
import FAQ from "../../common/FAQ";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";
import Footer from "@/components/Footer/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ApartmentProvidentProps {
  data: any;
}

const ApartmentProvident = ({ data }: ApartmentProvidentProps) => {
  return (
    <div className="min-h-screen provident-theme">
      <Hero data={data} />
      
      {/* Provident-specific Highlights Section */}
      {data.highlights && data.highlights.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Project Highlights
              </h2>
              <p className="text-muted-foreground text-lg">
                Key features that make this project exceptional
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {data.highlights.map((highlight: any, index: number) => (
                <Card key={index} className="border-accent/20 hover:border-accent transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          {highlight.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {data.gallery && data.gallery.length > 0 && (
        <Gallery images={data.gallery} />
      )}
      
      {data.configurations && data.configurations.length > 0 && (
        <PriceTable configurations={data.configurations} />
      )}
      
      {data.floorPlans && data.floorPlans.length > 0 && (
        <FloorPlans floorPlans={data.floorPlans} />
      )}
      
      {data.amenities && data.amenities.length > 0 && (
        <Amenities amenities={data.amenities} />
      )}
      
      {data.locationMap && (
        <LocationMap location={data.locationMap} />
      )}
      
      <CTAButtons />
      
      {data.faq && data.faq.length > 0 && (
        <FAQ faqs={data.faq} />
      )}
      
      <BuilderOtherProjects
        currentSlug={data.slug}
        builder={data.builder}
        otherProjects={data.other_projects}
        excludeProjects={data.exclude_projects_from_widgets}
      />
      
      <LocalityOtherProjects
        currentSlug={data.slug}
        locality={data.locality}
        builder={data.builder}
        excludeProjects={data.exclude_projects_from_widgets}
      />
      
      <Footer
        data={data.footer}
        projectName={data.name}
        builder={data.builder}
        locality={data.locality}
      />
    </div>
  );
};

export default ApartmentProvident;
