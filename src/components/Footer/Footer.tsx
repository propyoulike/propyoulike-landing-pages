import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterData {
  projectLinks?: Array<{ label: string; url: string }>;
  builderLinks?: Array<{ label: string; url: string }>;
  localityLinks?: Array<{ label: string; url: string }>;
  companyLinks?: Array<{ label: string; url: string }>;
  legalText?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

interface FooterProps {
  data?: FooterData;
  projectName?: string;
  builder?: string;
  locality?: string;
}

const Footer = ({ data, projectName, builder, locality }: FooterProps) => {
  // Default footer structure with fallbacks
  const footerData: FooterData = data || {
    projectLinks: [
      { label: "Overview", url: "#overview" },
      { label: "Gallery", url: "#gallery" },
      { label: "Floor Plans", url: "#floor-plans" },
      { label: "Amenities", url: "#amenities" },
    ],
    builderLinks: [
      { label: `About ${builder || "Builder"}`, url: "#" },
      { label: "Other Projects", url: "#" },
      { label: "Testimonials", url: "#" },
    ],
    localityLinks: [
      { label: `Properties in ${locality || "Location"}`, url: "#" },
      { label: "Nearby Schools", url: "#" },
      { label: "Transport", url: "#" },
    ],
    companyLinks: [
      { label: "About PropYouLike", url: "https://propyoulike.com/about" },
      { label: "Contact Us", url: "https://propyoulike.com/contact" },
      { label: "Privacy Policy", url: "https://propyoulike.com/privacy" },
      { label: "Terms & Conditions", url: "https://propyoulike.com/terms" },
    ],
    legalText: "© 2024 PropYouLike. All rights reserved. All information provided is for reference only and subject to change without notice.",
    contactInfo: {
      phone: "+91 98765 43210",
      email: "info@propyoulike.com",
      address: "Bangalore, Karnataka, India",
    },
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Project Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              {projectName || "Project"}
            </h3>
            <ul className="space-y-2">
              {footerData.projectLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Builder Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              Builder
            </h3>
            <ul className="space-y-2">
              {footerData.builderLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locality Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              Location
            </h3>
            <ul className="space-y-2">
              {footerData.localityLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">
              PropYouLike
            </h3>
            <ul className="space-y-2 mb-4">
              {footerData.companyLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {footerData.contactInfo && (
              <div className="space-y-2 text-sm">
                {footerData.contactInfo.phone && (
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Phone className="w-4 h-4" />
                    <span>{footerData.contactInfo.phone}</span>
                  </div>
                )}
                {footerData.contactInfo.email && (
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Mail className="w-4 h-4" />
                    <span>{footerData.contactInfo.email}</span>
                  </div>
                )}
                {footerData.contactInfo.address && (
                  <div className="flex items-start gap-2 text-primary-foreground/80">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>{footerData.contactInfo.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Legal Text */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-sm text-primary-foreground/60 text-center">
            {footerData.legalText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
