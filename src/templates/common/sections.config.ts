// -------------------sections.config.ts------------------------------
import React from "react";
import Hero from "@/templates/common/Hero";
import Navbar from "@/templates/common/Navbar";
import Summary from "@/templates/common/ProjectSummary";
import FloorPlans from "@/templates/common/FloorPlans";
import AmenitiesViewsTabs from "@/templates/common/AmenitiesViewsTabs";
import LocationUI from "@/templates/common/LocationUI";
import Construction from "@/templates/common/ConstructionStatus";
import PaymentPlans from "@/templates/common/PaymentPlans";
import LoanEligibility from "@/components/Widgets/LoanEligibilityWidget";
import CustomerSpeaks from "@/templates/common/CustomerSpeaks";
import Brochure from "@/templates/common/Brochure";
import BuilderAbout from "@/templates/common/BuilderAbout";
import FAQ from "@/templates/common/FAQ";
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";

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
    menuOrder: 1,
    props: (project: ProjectData, openCTA: () => void) => ({
      videoUrl: project.hero?.videoUrl,
      images: project.hero?.images,
      overlayTitle: project.hero?.overlayTitle,
      overlaySubtitle: project.hero?.overlaySubtitle,
      ctaEnabled: project.hero?.ctaEnabled,
      quickInfo: project.hero?.quickInfo,
      onCtaClick: openCTA,
    }),
  },

  Navbar: {
    id: "navbar",
    menuVisible: false,
    menuLabel: "Home",
    menuOrder: 2,
    Component: React.lazy(() => import("@/templates/common/Navbar")),
    props: (project: ProjectData, openCTA: () => void, autoMenu: any[]) => ({
      logo: project.navbar?.logo,
      builderLogo: project.navbar?.builderLogo,
      projectName: project.projectName,
      autoMenu,
      onCtaClick: openCTA,
    }),
  },

  Summary: {
    id: "summary",
    Component: React.lazy(() => import("@/templates/common/ProjectSummary")),
    menuVisible: true,
    menuLabel: "Overview",
    menuOrder: 3,
    props: (project, openCTA) => ({
      title: project.summary?.title,
      subtitle: project.summary?.subtitle,
      description: project.summary?.description,
      highlights: project.summary?.highlights,
      modelFlats: project.floorPlansSection?.modelFlats,
      onCtaClick: openCTA,
    }),
  },

  FloorPlansSection: {
    id: "floor-plans",
    menuVisible: true,
    menuLabel: "Floor Plans",
    menuOrder: 4,
    Component: React.lazy(() => import("@/templates/common/FloorPlans")),
    props: (project, openCTA) => ({
      section: project.floorPlansSection,
      paymentPlans: project.paymentPlans,
      onCtaClick: openCTA,
    }),
  },

  // Combined Amenities + Views as tabs
  Amenities: {
    id: "amenities",
    menuVisible: true,
    menuLabel: "Amenities",
    menuOrder: 5,
    Component: React.lazy(() => import("@/templates/common/AmenitiesViewsTabs")),
    props: (project, openCTA) => ({
      amenitiesTitle: project.amenities?.heroTitle,
      amenitiesSubtitle: project.amenities?.heroSubtitle,
      amenityImages: project.amenities?.amenityImages,
      amenityCategories: project.amenities?.amenityCategories,
      viewsTitle: project.views?.title || "Model Flats & Views",
      viewsSubtitle: project.views?.subtitle,
      viewImages: project.views?.images,
      onCtaClick: openCTA,
    }),
  },

  // Keep Views as separate section but hidden from menu (merged into Amenities tabs)
  Views: {
    id: "views",
    menuVisible: false,
    menuLabel: "Gallery",
    menuOrder: 6,
    Component: () => null, // No longer renders separately
    props: () => ({}),
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
  menuOrder: 7,
  Component: React.lazy(() => import("@/templates/common/LocationUI")),

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
  menuLabel: "Construction",
  menuOrder: 8,
  Component: React.lazy(() => import("@/templates/common/ConstructionStatus")),
  props: (project, openCTA) => ({
    updates: project.construction ?? [],   // IMPORTANT
    onCtaClick: openCTA,
  }),
},

  PaymentPlans: {
    id: "payment-plans",
    menuVisible: false,
    menuLabel: "Pricing",
    menuOrder: 9,
    Component: React.lazy(() => import("@/templates/common/PaymentPlans")),
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
  menuVisible: false,
  menuLabel: "Eligibility",
  menuOrder: 10,
  Component: React.lazy(() => import("@/components/Widgets/LoanEligibilityWidget")),
  props: (project: ProjectData, openCTA: () => void) => ({
    onCtaClick: openCTA,
    banks: (project as any).loanBanks ?? [],
  }),
},

  CustomerSpeaks: {
    id: "customer-speaks",
    menuVisible: true,
    menuLabel: "Testimonials",
    menuOrder: 11,
    Component: React.lazy(() => import("@/templates/common/CustomerSpeaks")),
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
    menuOrder: 12,
    Component: React.lazy(() => import("@/templates/common/Brochure")),
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
    menuOrder: 13,
    Component: React.lazy(() => import("@/templates/common/BuilderAbout")),
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
    menuOrder: 14,
    Component: React.lazy(() => import("@/templates/common/FAQ")),
    props: (project, openCTA) => ({
      id: "faq",
      title: project.faqTitle,
      subtitle: project.faqSubtitle,
      faqs: project.faq,
      onCtaClick: openCTA,
    }),
  },

  // Builder Widget
  BuilderWidget: {
    id: "builder-projects",
    menuVisible: false,
    menuLabel: "More Projects",
    menuOrder: 15,
    Component: React.lazy(() => import("@/components/Widgets/BuilderOtherProjects")),
    props: (project: ProjectData) => ({
      projects: (project as any).builderProjects ?? [],
    }),
  },

  // Locality Widget
  LocalityWidget: {
    id: "locality-projects",
    menuVisible: false,
    menuLabel: "Nearby Projects",
    menuOrder: 16,
    Component: React.lazy(() => import("@/components/Widgets/LocalityOtherProjects")),
    props: (project: ProjectData) => ({
      projects: (project as any).localityProjects ?? [],
    }),
  },
} as const;

export type SectionName = keyof typeof SECTIONS;
