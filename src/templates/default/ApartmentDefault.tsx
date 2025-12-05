import Hero from "../common/Hero";
import Amenities from "../common/Amenities";
import FloorPlans from "../common/FloorPlans";
import CTAButtons from "@/components/CTAButtons";
import FAQ from "../common/FAQ";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";
import Footer from "@/components/Footer/Footer";

interface ApartmentDefaultProps {
  data: any;
}

const ApartmentDefault = ({ data }: ApartmentDefaultProps) => {
  // Safe defaults
  const floorPlans = data?.floorPlans || [];
  const amenities = data?.amenities || [];
  const configurations = data?.configurations || [];
  const faqs = data?.faq || [];
  const slug = data?.slug || "";
  const builder = data?.builder || "";
  const otherProjects = data?.other_projects || [];
  const excludeProjects = data?.exclude_projects_from_widgets || [];
  const footerData = data?.footer || {};
  const projectName = data?.name || "";
  const locality = data?.locality || "";

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      {data && <Hero data={data} />}

      {/* Floor Plans */}
      {floorPlans.length > 0 && <FloorPlans floorPlans={floorPlans} />}

      {/* Amenities */}
      {amenities.length > 0 && <Amenities amenities={amenities} />}

      {/* Call-to-action buttons */}
      <CTAButtons />

      {/* FAQ section */}
      {faqs.length > 0 && <FAQ faqs={faqs} />}

      {/* Builder's other projects */}
      {builder && (
        <BuilderOtherProjects
          currentSlug={slug}
          builder={builder}
          otherProjects={otherProjects}
          excludeProjects={excludeProjects}
        />
      )}

      {/* Locality's other projects */}
      {locality && (
        <LocalityOtherProjects
          currentSlug={slug}
          locality={locality}
          builder={builder}
          excludeProjects={excludeProjects}
        />
      )}

      {/* Footer */}
      <Footer
        data={footerData}
        projectName={projectName}
        builder={builder}
        locality={locality}
      />
    </div>
  );
};

export default ApartmentDefault;
