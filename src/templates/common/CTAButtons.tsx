import { Button } from "@/components/ui/button";
import { Phone, Download, Mail } from "lucide-react";

interface CTAButtonsProps {
  onFormOpen?: () => void;
}

const CTAButtons = ({ onFormOpen }: CTAButtonsProps) => {
  const handleCallNow = () => {
    window.location.href = "tel:+919876543210";
  };

  const handleDownloadBrochure = () => {
    if (onFormOpen) {
      onFormOpen();
    } else {
      console.log("Download brochure");
    }
  };

  const handleEnquiry = () => {
    if (onFormOpen) {
      onFormOpen();
    } else {
      window.location.href = "mailto:info@propyoulike.com";
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Own Your Dream Home?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Contact us today for exclusive offers and personalized assistance
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={handleCallNow}
              className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleDownloadBrochure}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 font-semibold px-8"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Brochure
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleEnquiry}
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 font-semibold px-8"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Enquiry
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAButtons;
