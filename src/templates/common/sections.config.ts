// -------------------sections.config.ts------------------------------
import Hero from "@/templates/common/Hero";
import Navbar from "@/templates/common/Navbar";
import Summary from "@/templates/common/ProjectSummary";
import FloorPlans from "@/templates/common/FloorPlans";
import Amenities from "@/templates/common/Amenities";
import Views from "@/templates/common/Views";
import LocationUI from "@/templates/common/LocationUI";
import Construction from "@/templates/common/ConstructionStatus";
import PaymentPlans from "@/templates/common/PaymentPlans";
import LoanEligibility from "@/components/Widgets/LoanEligibilityWidget";
import CustomerSpeaks from "@/templates/common/CustomerSpeaks";
import Brochure from "@/templates/common/Brochure";
import BuilderAbout from "@/templates/common/BuilderAbout";
import FAQ from "@/templates/common/FAQ";

import type { ProjectData } from "@/content/schema/project.schema";

// --------------------------------------------------------------------
// AUTO MENU GENERATOR → builds navbar menu from sections[]
// --------------------------------------------------------------------
function autoMenuFromSections(project: ProjectData) {
  const sections = project.sections || [];

  return sections
    .filter(
      (name) =>
        !["Hero", "Navbar"].includes(name) // exclude sections not needed in menu
    )
    .map((name) => {
      const normalized = name.charAt(0).toUpperCase() + name.slice(1);
      const def = SECTIONS[normalized as keyof typeof SECTIONS];

      const id =
        typeof def.id === "function" ? def.id(project) : def.id;

      // Convert "LocationUI" → "Location UI"
      const label = normalized.replace(/([A-Z])/g, " $1").trim();

      return { label, targetId: id };
    });
}

// --------------------------------------------------------------------
// COMPLETE SECTIONS REGISTRY
// --------------------------------------------------------------------
export const SECTIONS = {
  Hero: {
    id: "hero",
    Component: Hero,
    menuVisible: false,
    menuLabel: "Hero",
    props: (project: ProjectData) => ({
      videoUrl: project.hero?.videoUrl,
      images: project.hero?.images,
      overlayTitle: project.hero?.overlayTitle,
      overlaySubtitle: project.hero?.overlaySubtitle,
      ctaEnabled: project.hero?.ctaEnabled,
      quickInfo: project.hero?.quickInfo,
    }),
  },

Navbar: {
  id: "navbar",
  menuVisible: true,
  menuLabel: "Home", // override label if needed
  Component: Navbar,
  props: (project: ProjectData, openCTA: () => void, autoMenu: any[]) => ({
    logo: project.navbar?.logo,
    autoMenu,
    onCtaClick: openCTA,
  }),
},

  Summary: {
    id: "summary",
    Component: Summary,
    menuVisible: false,
    menuLabel: "Overview",
    props: (project, openCTA) => ({
      title: project.summary?.title,
      subtitle: project.summary?.subtitle,
      description: project.summary?.description,
      highlights: project.summary?.highlights,
      onCtaClick: openCTA,
    }),
  },

  FloorPlansSection: {
    id: "floor-plans",
    menuVisible: true,
    menuLabel: "Floor Plans",
    Component: FloorPlans,
    props: (project, openCTA) => ({
      section: project.floorPlansSection,
      onCtaClick: openCTA,
    }),
  },

  Amenities: {
    id: "amenities",
    menuVisible: true,
    menuLabel: "Amenities",
    Component: Amenities,
    props: (project) => ({
      heroTitle: project.amenities?.heroTitle,
      heroSubtitle: project.amenities?.heroSubtitle,
      amenityImages: project.amenities?.amenityImages,
      amenityCategories: project.amenities?.amenityCategories,
    }),
  },

  Views: {
    id: "views",
    menuVisible: true,
    menuLabel: "Gallery",
    Component: Views,
    props: (project, openCTA) => ({
      id: "views",
      title: project.views?.title,
      subtitle: project.views?.subtitle,
      images: project.views?.images,
      onCtaClick: openCTA,
    }),
  },

LocationUI: {
  id: (project: ProjectData) => {
    const sid = project.locationUI?.sectionId;

    if (typeof sid === "string" && sid.trim().length > 0) {
      return sid.trim();
    }

    console.warn(
      "%c[LocationUI] Missing or invalid sectionId → using fallback 'location-ui'",
      "color: orange; font-weight: bold;"
    );

    return "location-ui";
  },

    menuVisible: true,
    menuLabel: "Location",
  Component: LocationUI,

  props: (project: ProjectData, openCTA: () => void) => ({
    section: {
      id: project.locationUI?.sectionId ?? "location-ui",
      title: project.locationUI?.title ?? "",
      subtitle: project.locationUI?.subtitle ?? "",
      tagline: project.locationUI?.tagline ?? "",
      videoUrl: project.locationUI?.videoUrl ?? "",
      mapUrl: project.locationUI?.mapUrl ?? "",
      categories: project.locationUI?.categories ?? [],
      ctaText: project.locationUI?.ctaText ?? "Enquire Now",
    },
    onCtaClick: openCTA,
  }),
},

  Construction: {
    id: "construction",
    menuVisible: true,
    menuLabel: "Status",
    Component: Construction,
    props: (project) => ({
      updates: project.construction,
    }),
  },

  PaymentPlans: {
    id: "payment-plans",
    menuVisible: true,
    menuLabel: "Pricing",
    Component: PaymentPlans,
    props: (project, openCTA) => ({
      sectionId: project.paymentPlans?.sectionId,
      sectionTitle: project.paymentPlans?.sectionTitle,
      sectionSubtitle: project.paymentPlans?.sectionSubtitle,
      pricingTitle: project.paymentPlans?.pricingTitle,
      pricingComputation: project.paymentPlans?.pricingComputation,
      scheduleTitle: project.paymentPlans?.scheduleTitle,
      paymentSchedule: project.paymentPlans?.paymentSchedule,
      ctaText: project.paymentPlans?.ctaText,
      onCtaClick: openCTA,
    }),
  },

LoanEligibility: {
  id: "loan-eligibility",
  menuVisible: true,
  menuLabel: "Eligibility",
  Component: LoanEligibility,
  props: (project: ProjectData, openCTA: () => void) => ({
    onCtaClick: openCTA,
    banks: (project as any).loanBanks ?? [],
  }),
},

  CustomerSpeaks: {
    id: "customer-speaks",
    menuVisible: true,
    menuLabel: "Testimonials",
    Component: CustomerSpeaks,
    props: (project, openCTA) => ({
      id: "customerspeaks",
      title: project.customerSpeaks?.title,
      subtitle: project.customerSpeaks?.subtitle,
      testimonials: project.customerSpeaks?.testimonials,
      onCtaClick: openCTA,
    }),
  },

  Brochure: {
    id: "brochure",
    menuVisible: false,
    menuLabel: "Brochure",
    Component: Brochure,
    props: (project) => ({
      heroTitle: project.brochure?.heroTitle,
      heroSubtitle: project.brochure?.heroSubtitle,
      coverImage: project.brochure?.coverImage,
      documents: project.brochure?.documents,
    }),
  },

  BuilderAbout: {
    id: "about-builder",
    menuVisible: false,
    Component: BuilderAbout,
    props: (project, openCTA) => ({
      title: project.builderAbout?.title,
      subtitle: project.builderAbout?.subtitle,
      description: project.builderAbout?.description,
      descriptionExpanded: project.builderAbout?.descriptionExpanded,
      stats: project.builderAbout?.stats || [],
      onCtaClick: openCTA,
    }),
  },

  FAQ: {
    id: "faq",
    menuVisible: true,
    menuLabel: "FAQ",
    Component: FAQ,
    props: (project, openCTA) => ({
      id: "faq",
      title: project.faqTitle,
      subtitle: project.faqSubtitle,
      faqs: project.faq,
      onCtaClick: openCTA,
    }),
  },
} as const;

export type SectionName = keyof typeof SECTIONS;
