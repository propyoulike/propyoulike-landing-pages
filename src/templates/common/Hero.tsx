import { Button } from "@/components/ui/button";
import { Phone, Download, MapPin } from "lucide-react";

interface HeroProps {
  data: {
    name: string;
    tagline?: string;
    heroImage: string;
    locality?: string;
    city?: string;
    builder?: string;
    status?: string;
  };
}

const Hero = ({ data }: HeroProps) => {
  const handleCallNow = () => {
    window.location.href = "tel:+919876543210";
  };

  const handleDownloadBrochure = () => {
    // Implement brochure download
    console.log("Download brochure");
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl animate-fade-in">
          {/* Builder Badge */}
          {data.builder && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 mb-6 animate-slide-in-left">
              <span className="text-accent-foreground font-medium">By {data.builder}</span>
              {data.status && (
                <>
                  <span className="w-1 h-1 bg-accent rounded-full"></span>
                  <span className="text-accent-foreground text-sm">{data.status}</span>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
            {data.name}
          </h1>

          {/* Tagline */}
          {data.tagline && (
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 font-light animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
              {data.tagline}
            </p>
          )}

          {/* Location */}
          {(data.locality || data.city) && (
            <div className="flex items-center gap-2 text-primary-foreground/80 mb-8 animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
              <MapPin className="w-5 h-5" />
              <span className="text-lg">
                {data.locality}{data.city ? `, ${data.city}` : ""}
              </span>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-in-left" style={{ animationDelay: "0.4s" }}>
            <Button
              size="lg"
              onClick={handleCallNow}
              className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-glow transition-all"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadBrochure}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 backdrop-blur-sm font-semibold px-8 py-6 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary-foreground/60 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
