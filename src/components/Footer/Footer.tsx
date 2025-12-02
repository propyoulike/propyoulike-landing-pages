import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import defaultFooter from "./footer-data-schema.json";
import providentFooter from "./provident-footer.json";

/* ------------------------
  Types
   - FooterData / FooterProps
   - keep in sync with your JSON schema
-------------------------*/
type LinkItem = { label: string; url: string };

type FooterData = {
  projectLinks?: LinkItem[];
  builderLinks?: LinkItem[];
  localityLinks?: LinkItem[];
  companyLinks?: LinkItem[];
  legalText?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
};

type FooterProps = {
  data?: FooterData | null;
  projectName?: string | null;
  builder?: string | null;
  locality?: string | null;
};

/* ------------------------
  Builder footer registry
  Add new builder JSON imports here and map them by builder key
  e.g.
  import prestigeFooter from "./prestige-footer.json";
  const builderFooterMap = { provident: providentFooter, prestige: prestigeFooter }
-------------------------*/
const builderFooterMap: Record<string, FooterData> = {
  provident: (providentFooter as unknown) as FooterData,
  // prestige: (prestigeFooter as unknown) as FooterData,
  // sobha: (sobhaFooter as unknown) as FooterData,
};

function isInternalUrl(url?: string) {
  if (!url) return false;
  return url.startsWith("/") || url.startsWith(window.location.origin);
}

const Footer: React.FC<FooterProps> = ({ data, projectName, builder, locality }) => {
  // Resolve footer data: prop -> builder -> global default
  const footerData: FooterData = useMemo(() => {
    if (data) return data;
    if (builder && builderFooterMap[builder]) {
      return builderFooterMap[builder];
    }
    return (defaultFooter as unknown) as FooterData;
  }, [data, builder]);

  const renderLink = (link: LinkItem, idx: number) => {
    const { label, url } = link;
    if (!url) return <span key={idx}>{label}</span>;

    if (isInternalUrl(url)) {
      // Use react-router Link for internal links
      return (
        <li key={idx}>
          <Link to={url} className="text-primary-foreground/80 hover:text-accent transition-colors">
            {label}
          </Link>
        </li>
      );
    }

    // External link
    return (
      <li key={idx}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-foreground/80 hover:text-accent transition-colors"
        >
          {label}
        </a>
      </li>
    );
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Project Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">{projectName || "Project"}</h3>
            <ul className="space-y-2">
              {(footerData.projectLinks || []).map(renderLink)}
            </ul>
          </div>

          {/* Builder Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Builder</h3>
            <ul className="space-y-2">{(footerData.builderLinks || []).map(renderLink)}</ul>
          </div>

          {/* Locality Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Location</h3>
            <ul className="space-y-2">{(footerData.localityLinks || []).map(renderLink)}</ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">PropYouLike</h3>
            <ul className="space-y-2 mb-4">{(footerData.companyLinks || []).map(renderLink)}</ul>

            {footerData.contactInfo && (
              <div className="space-y-2 text-sm">
                {footerData.contactInfo.phone && (
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${footerData.contactInfo.phone}`}
                      className="hover:text-accent transition-colors"
                    >
                      {footerData.contactInfo.phone}
                    </a>
                  </div>
                )}
                {footerData.contactInfo.email && (
                  <div className="flex items-center gap-2 text-primary-foreground/80">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${footerData.contactInfo.email}`}
                      className="hover:text-accent transition-colors"
                    >
                      {footerData.contactInfo.email}
                    </a>
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
            {footerData.legalText || ""}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
