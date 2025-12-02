import { Button } from "@/components/ui/button";
import { Building2, MapPin, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            PropYouLike
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your Gateway to Premium Real Estate in Bangalore
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/projects/provident-sunworth-city">
              <Button size="lg" className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 shadow-lg">
                <Home className="w-5 h-5 mr-2" />
                Explore Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked premium developments from trusted builders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/projects/provident-sunworth-city" className="group">
              <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                    alt="Provident Sunworth City"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">By Provident</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Provident Sunworth City
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>Hebbal, Bangalore</span>
                  </div>
                  <p className="text-accent font-semibold text-lg mb-4">
                    ₹65 Lakhs - ₹1.2 Cr
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/80">
            © 2024 PropYouLike. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
