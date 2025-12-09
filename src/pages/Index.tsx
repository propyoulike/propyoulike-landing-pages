import { Button } from "@/components/ui/button";
import { Building2, MapPin, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/footer/Footer";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      <Helmet>
        <title>PropYouLike – Premium Bangalore Real Estate</title>
        <meta
          name="description"
          content="Browse curated, premium real estate projects in Bangalore from top builders. Explore verified properties with PropYouLike."
        />
        <meta property="og:title" content="PropYouLike – Premium Bangalore Real Estate" />
        <meta
          property="og:description"
          content="Handpicked real estate projects in Bangalore from trusted builders."
        />
        <meta property="og:image" content="https://propyoulike.com/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            PropYouLike
          </h1>

          <p
            className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-slide-up"
          >
            Your Gateway to Premium Real Estate in Bangalore
          </p>

          <Link to="/provident-sunworth-city">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 shadow-lg animate-slide-up"
            >
              <Home className="w-5 h-5 mr-2" />
              Explore Projects
            </Button>
          </Link>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
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

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            
            {/* CARD */}
            <Link to="/projects/provident-sunworth-city" className="group block">
              <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                    alt="Provident Sunworth City"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">By Provident</span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    Provident Sunworth City
                  </h3>

                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <MapPin className="w-4 h-4" />
                    <span>Kengeri, Bangalore</span>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-semibold">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Index;
