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
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building2, MapPin, Ruler, Landmark, BadgeCheck, Phone, Calendar, MessageCircle, Home, Trees, Dumbbell, Users } from "lucide-react";
import { useState, useEffect } from "react";

// Quick Info Bar Component
const QuickInfo = ({ data }: any) => {
  const info = [
    { label: "Price", value: data.priceRange || "Contact for Price", icon: "₹" },
    { label: "Typology", value: "2 & 3 BHK", icon: <Home className="w-5 h-5" /> },
    { label: "Location", value: data.locality, icon: <MapPin className="w-5 h-5" /> },
    { label: "Size", value: data.landArea?.value ? `${data.landArea.value} ${data.landArea.unit}s` : "—", icon: <Ruler className="w-5 h-5" /> }
  ];

  return (
    <section className="bg-primary text-primary-foreground py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {info.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                {typeof item.icon === "string" ? (
                  <span className="text-accent font-bold text-lg">{item.icon}</span>
                ) : (
                  <span className="text-accent">{item.icon}</span>
                )}
              </div>
              <p className="text-xs text-primary-foreground/70 uppercase tracking-wide">{item.label}</p>
              <p className="font-semibold text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Floating CTA Bar Component
const FloatingCTABar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCall = () => window.location.href = "tel:+919876543210";
  const handleWhatsApp = () => window.open("https://wa.me/919876543210", "_blank");
  const handleSiteVisit = () => window.location.href = "#contact";

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground py-3 px-4 shadow-2xl z-50 md:hidden">
      <div className="flex gap-2 justify-between">
        <Button onClick={handleCall} size="sm" className="flex-1 bg-accent hover:bg-accent-light text-accent-foreground">
          <Phone className="w-4 h-4 mr-1" />
          Call
        </Button>
        <Button onClick={handleWhatsApp} size="sm" variant="outline" className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0">
          <MessageCircle className="w-4 h-4 mr-1" />
          WhatsApp
        </Button>
        <Button onClick={handleSiteVisit} size="sm" variant="outline" className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          Visit
        </Button>
      </div>
    </div>
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

      {/* Quick Info Bar */}
      <QuickInfo data={data} />

      {/* Main Introduction */}
      <section className="py-16 bg-background">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {data.name}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold">
              <Phone className="w-5 h-5 mr-2" />
              Personalised Guidance
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Site Visit
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Key Highlights with Icons */}
      {highlights.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why Choose {data.name}?
              </h2>
              <p className="text-muted-foreground text-lg">Everything your family needs for a wholesome lifestyle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {highlights.map((item: any, index: number) => (
                <Card key={index} className="shadow-md border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="text-accent w-8 h-8" />
                    </div>
                    <h3 className="font-heading text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meticulously Designed Homes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Meticulously Designed Homes
            </h2>
            <p className="text-muted-foreground text-lg">Explore our thoughtfully designed homes with virtual walkthroughs and detailed floor plans</p>
          </div>
        </div>
      </section>

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

      {/* Amenities - Your Leisure Adorned With Opulence */}
      {amenities.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                Your Leisure Adorned With Opulence
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                From sports to leisure, wellness to education—everything your family needs is right here. Your weekends stay inside the community.
              </p>
            </div>
            <Amenities amenities={amenities} />
          </div>
        </section>
      )}

      {/* The Perfect Setting - Location */}
      {location && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                The Perfect Setting
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need within easy reach — schools, hospitals, connectivity & more.
              </p>
              <p className="text-foreground font-semibold mt-2">Life. Convenience. Future-ready.</p>
            </div>
            <div className="max-w-5xl mx-auto border rounded-xl shadow-lg overflow-hidden bg-white">
              <LocationMap location={location} />
            </div>
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

      {/* Floating CTA Bar */}
      <FloatingCTABar />
    </div>
  );
};

export default ApartmentProvident;
