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
import { CheckCircle2, Building2, MapPin, Ruler, Landmark, BadgeCheck } from "lucide-react";

// NEW: Quick Info Component (inline)
const QuickInfo = ({ data }: any) => {
  const info = [
    { icon: <Building2 />, label: "Builder", value: data.builder },
    { icon: <Ruler />, label: "Land Area", value: data.landArea?.value ? `${data.landArea.value} ${data.landArea.unit}` : "—" },
    { icon: <BadgeCheck />, label: "RERA", value: data.rera?.id ?? "—" },
    { icon: <MapPin />, label: "Location", value: data.locality },
    { icon: <Landmark />, label: "Status", value: data.status },
    { icon: <Building2 />, label: "Units", value: data.unitCount ? `${data.unitCount}+ Units` : "—" }
  ];

  return (
    <section className="py-10 bg-muted/40 border-b">
      <div className="container mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {info.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">{item.icon}</div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="font-medium text-foreground text-sm">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

interface ApartmentProvidentProps {
  data: any;
}

const ApartmentProvident = ({ data }: ApartmentProvidentProps) => {
  const highlights = data.highlights || [];
  const gallery = Array.isArray(data.gallery)
    ? data.gallery.map((g: any) => (typeof g === "string" ? g : g.url))
    : [];

  const configurations = data.configurations || [];
  const floorPlans = data.floorPlans || [];
  const amenities = data.amenities || [];
  const location = data.locationMap || null;

  const otherProjects = data.other_projects || [];
  const excluded = data.exclude_projects_from_widgets || [];

  const footerData = data.footer || undefined;

  return (
    <div className="min-h-screen provident-theme">
      <Hero data={data} />

      {/* NEW: Quick Info Section */}
      <QuickInfo data={data} />

      {/* NEW: Overview Section */}
      <section className="py-14 bg-background border-b">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-4 text-foreground">
            Project Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {data.description}
          </p>
        </div>
      </section>

      {/* Highlights (Improved Styling) */}
      {highlights.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-foreground mb-3">
                Project Highlights
              </h2>
              <p className="text-muted-foreground">Key features that make this project stand out</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {highlights.map((item: any, index: number) => (
                <Card key={index} className="shadow-sm border border-muted hover:border-primary/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="text-primary w-6 h-6 mt-1" />
                      <div>
                        <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && <Gallery images={gallery} />}

      {/* Price Table */}
      {configurations.length > 0 && (
        <section className="py-20">
          <PriceTable configurations={configurations} />
        </section>
      )}

      {/* Floor Plans (Slider) */}
      {floorPlans.length > 0 && (
        <section className="py-20 bg-muted/30">
          <FloorPlans floorPlans={floorPlans} />
        </section>
      )}

      {/* Amenities */}
      {amenities.length > 0 && (
        <section className="py-20 bg-background">
          <Amenities amenities={amenities} />
        </section>
      )}

      {/* Location Map */}
      {location && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto border rounded-xl shadow p-4 bg-white">
            <LocationMap location={location} />
          </div>
        </section>
      )}

      {/* CTA Buttons */}
      <section className="py-20">
        <CTAButtons />
      </section>

      {/* FAQ */}
      {data.faq?.length > 0 && (
        <section className="py-20 bg-muted/30">
          <FAQ faqs={data.faq} />
        </section>
      )}

      {/* Widgets */}
      <BuilderOtherProjects
        currentSlug={data.slug}
        builder={data.builder}
        otherProjects={otherProjects}
        excludeProjects={excluded}
      />

      <LocalityOtherProjects
        currentSlug={data.slug}
        locality={data.locality}
        builder={data.builder}
        excludeProjects={excluded}
      />

      {/* Footer */}
      <Footer
        data={footerData}
        projectName={data.name}
        builder={data.builder}
        locality={data.locality}
      />
    </div>
  );
};

export default ApartmentProvident;
