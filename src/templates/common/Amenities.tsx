import { 
  Dumbbell, 
  Waves, 
  TreePine, 
  ShieldCheck, 
  Car, 
  Users,
  Sparkles,
  Gamepad2
} from "lucide-react";

const iconMap: Record<string, any> = {
  gym: Dumbbell,
  pool: Waves,
  garden: TreePine,
  security: ShieldCheck,
  parking: Car,
  clubhouse: Users,
  spa: Sparkles,
  sports: Gamepad2,
};

interface AmenitiesProps {
  amenities: Array<{
    name: string;
    icon?: string;
    description?: string;
  }>;
}

const Amenities = ({ amenities }: AmenitiesProps) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            World-Class Amenities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience luxury living with premium facilities designed for your comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon ? iconMap[amenity.icon.toLowerCase()] || Sparkles : Sparkles;
            
            return (
              <div
                key={index}
                className="group p-6 bg-card rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {amenity.name}
                </h3>
                {amenity.description && (
                  <p className="text-sm text-muted-foreground">
                    {amenity.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
