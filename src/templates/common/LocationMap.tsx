import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationMapProps {
  location: {
    lat: number;
    lng: number;
    address?: string;
    landmarks?: Array<{
      name: string;
      distance: string;
    }>;
  };
}

const LocationMap = ({ location }: LocationMapProps) => {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location.lat},${location.lng}&zoom=15`;
  
  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`, '_blank');
  };

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Prime Location
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Strategically located with excellent connectivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map */}
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
            
            <div className="absolute top-4 right-4">
              <Button
                onClick={openDirections}
                className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold shadow-lg"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>

          {/* Nearby Landmarks */}
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-accent" />
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Nearby Landmarks
              </h3>
            </div>

            {location.address && (
              <p className="text-muted-foreground mb-6 pb-6 border-b border-border">
                {location.address}
              </p>
            )}

            <div className="space-y-4">
              {location.landmarks?.map((landmark, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-accent rounded-full"></div>
                    <span className="text-foreground font-medium">{landmark.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-semibold whitespace-nowrap ml-4">
                    {landmark.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
