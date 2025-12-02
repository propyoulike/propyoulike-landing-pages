import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface PriceConfig {
  type: string;
  size: string;
  price: string;
  availability?: string;
}

interface PriceTableProps {
  configurations: PriceConfig[];
}

const PriceTable = ({ configurations }: PriceTableProps) => {
  const handleEnquiry = () => {
    window.location.href = "tel:+919876543210";
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Configurations & Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparent pricing for your dream home
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-lg border border-border overflow-hidden shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Configuration</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Area (Sq.Ft)</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Price Range</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">Availability</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations.map((config, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{config.type}</TableCell>
                    <TableCell>{config.size}</TableCell>
                    <TableCell className="text-accent font-semibold">{config.price}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        config.availability === 'Available' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {config.availability || 'Available'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={handleEnquiry}
                        className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Enquire
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              * Prices are subject to change. Please contact us for the latest pricing and availability.
            </p>
            <Button
              size="lg"
              onClick={handleEnquiry}
              className="bg-primary hover:bg-primary-light text-primary-foreground font-semibold px-8"
            >
              <Phone className="w-5 h-5 mr-2" />
              Get Best Price
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceTable;
