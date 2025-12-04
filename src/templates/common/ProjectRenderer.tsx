import { SECTION_COMPONENTS } from "./sections";
import type { ProjectData } from "@/content/schema/project.schema";
import { useLeadCTAContext } from "@/components/lead/LeadCTAProvider";

export default function ProjectRenderer({ project }: { project: ProjectData }) {
  const { openCTA } = useLeadCTAContext();

  const sections = project.sections || [];

  return (
    <div>
      {sections.map((sectionName, index) => {
        // Normalize from "amenities", "faq", "aboutbuilder" → "Amenities", "Faq", "Aboutbuilder"
        const normalized =
          sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

        const SectionComponent = SECTION_COMPONENTS[normalized];

        if (!SectionComponent) {
          console.warn(`⚠ Unknown section: ${sectionName}`);
          return null;
        }

        const props = getSectionProps(normalized, project, openCTA);

        return <SectionComponent key={index} {...props} />;
      })}
    </div>
  );
}

/**
 * Maps JSON → Component Props
 * Using normalized section names
 */
function getSectionProps(
  sectionName: string,
  project: ProjectData,
  openCTA: () => void
) {
  switch (sectionName) {
    case "Hero":
      return {
        videoUrl: project.hero?.videoUrl,
        images: project.hero?.images,
        overlayTitle: project.hero?.overlayTitle,
        overlaySubtitle: project.hero?.overlaySubtitle,
        ctaEnabled: project.hero?.ctaEnabled,
        quickInfo: project.hero?.quickInfo,
      };

    case "Navbar":
      return {
        logo: project.navbar?.logo || null,
        menu: project.navbar?.menu || [],
        onCtaClick: openCTA,
      };

    case "Summary":
      return {
        title: project.summary?.title,
        subtitle: project.summary?.subtitle,
        description: project.summary?.description,
        highlights: project.summary?.highlights || [],
        onCtaClick: openCTA,
      };

    case "FloorPlans":
      return {
        unitPlans: project.unitPlans || [],
        floorPlans: project.floorPlans || [],
        masterPlan: project.media?.masterPlan,
      };

    case "Location":
      return {
        videoUrl: project.location?.videoUrl,
        mapUrl: project.location?.mapUrl,
        categories: project.location?.sections || [],
        onCtaClick: openCTA,
      };

    case "Amenities":
      return {
        heroTitle: project.amenities?.heroTitle,
        heroSubtitle: project.amenities?.heroSubtitle,
        amenityImages: project.amenities?.amenityImages || [],
        amenityCategories: project.amenities?.amenityCategories || [],
      };

    case "Views":
      return {
        id: project.views?.id || "views",
        title: project.views?.title,
        subtitle: project.views?.subtitle,
        images: project.views?.images || [],
        onCtaClick: openCTA,
      };

    case "Construction":
      return {
        updates: project.construction || [],
      };

    case "PaymentPlans":
      return {
        pricingComputation: project.paymentUI?.pricingComputation,
        paymentSchedule: project.paymentUI?.paymentSchedule,
        onCtaClick: openCTA,
      };

    case "LoanEligibility":
      return {
        onCtaClick: openCTA,
      };

    case "CustomerSpeaks":
      return {
        id: "customerspeaks",
        title: project.customerSpeaks?.title,
        subtitle: project.customerSpeaks?.subtitle,
        testimonials: project.customerSpeaks?.testimonials || [],
        onCtaClick: openCTA,
      };

    case "Brochure":
      return {
        heroTitle: project.brochure?.heroTitle,
        heroSubtitle: project.brochure?.heroSubtitle,
        coverImage: project.brochure?.coverImage,
        documents: project.brochure?.documents || [],
      };

    case "Builderabout": // because "aboutbuilder" → normalized → "Aboutbuilder"
    case "BuilderAbout":
      return {
        ...project.builderAbout,
        onCtaClick: openCTA,
      };

    case "Faq":
    case "FAQ":
      return {
        id: "faq",
        title: project.faqTitle || "Frequently Asked Questions",
        subtitle: project.faqSubtitle || "Find answers to common buyer questions.",
        faqs: project.faqs || [],
        onCtaClick: openCTA,
      };

    default:
      return {};
  }
}
