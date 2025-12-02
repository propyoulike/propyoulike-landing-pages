import Hero from "../common/Hero";
import Gallery from "../common/Gallery";
import Amenities from "../common/Amenities";
import FloorPlans from "../common/FloorPlans";
import PriceTable from "../common/PriceTable";
import LocationMap from "../common/LocationMap";
import CTAButtons from "../common/CTAButtons";
import FAQ from "../common/FAQ";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";
import Footer from "@/components/Footer/Footer";

interface ApartmentDefaultProps {
  data: any;
}

const ApartmentDefault = ({ data }: ApartmentDefaultProps) => {
  return (
    <div className="min-h-screen">
      <Hero data={data} />
      
      {data.gallery && data.gallery.length > 0 && (
        <Gallery images={data.gallery} />
      )}
      
      {data.configurations && data.configurations.length > 0 && (
        <PriceTable configurations={data.configurations} />
      )}
      
      {data.floorPlans && data.floorPlans.length > 0 && (
        <FloorPlans floorPlans={data.floorPlans} />
      )}
      
      {data.amenities && data.amenities.length > 0 && (
        <Amenities amenities={data.amenities} />
      )}
      
      {data.locationMap && (
        <LocationMap location={data.locationMap} />
      )}
      
      <CTAButtons />
      
      {data.faq && data.faq.length > 0 && (
        <FAQ faqs={data.faq} />
      )}
      
      <BuilderOtherProjects
        currentSlug={data.slug}
        builder={data.builder}
        otherProjects={data.other_projects}
        excludeProjects={data.exclude_projects_from_widgets}
      />
      
      <LocalityOtherProjects
        currentSlug={data.slug}
        locality={data.locality}
        builder={data.builder}
        excludeProjects={data.exclude_projects_from_widgets}
      />
      
      <Footer
        data={data.footer}
        projectName={data.name}
        builder={data.builder}
        locality={data.locality}
      />
    </div>
  );
};

export default ApartmentDefault;
