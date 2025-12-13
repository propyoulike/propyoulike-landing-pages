// -------------------sections.config.ts------------------------------

import React from "react";

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
import BuilderOtherProjects from "@/components/Widgets/BuilderOtherProjects";
import LocalityOtherProjects from "@/components/Widgets/LocalityOtherProjects";

import type { ProjectData } from "@/content/schema/project.schema";

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
    props: (project: ProjectData, ctx) => ({
      videoId: project.hero?.videoId,
      images: project.hero?.images,
      overlayTitle: project.hero?.overlayTitle,
      overlaySubtitle: project.hero?.overlaySubtitle,
      ctaEnabled: project.hero?.ctaEnabled,
      quickInfo: project.hero?.quickInfo,
      onCtaClick: ctx.openCTA
    })
  },

  Navbar: {
    id: "navbar",
    menuVisible: false,
    menuLabel: "Home",
    menuOrder: 2,
    Component: React.lazy(() => import("@/templates/common/Navbar")),
    props: (project: ProjectData, ctx) => ({
      logo: project.navbar?.logo,
      builderLogo: project.navbar?.builderLogo,
      projectName: project.projectName,
      autoMenu: ctx.autoMenu,
      onCtaClick: ctx.openCTA
    })
  },

  Summary: {
    id: "summary",
    Component: React.lazy(() => import("@/templates/common/ProjectSummary")),
    menuVisible: true,
    menuLabel: "Overview",
    menuOrder: 3,
    props: (project, ctx) => ({
      title: project.summary?.title,
      subtitle: project.summary?.subtitle,
      description: project.summary?.description,
      highlights: project.summary?.highlights,
      modelFlats: project.floorPlansSection?.modelFlats,
      onCtaClick: ctx.openCTA
    })
  },

  FloorPlansSection: {
    id: "floor-plans",
    menuVisible: true,
    menuLabel: "Floor Plans",
    menuOrder: 4,
    Component: React.lazy(() => import("@/templates/common/FloorPlans")),
    props: (project, ctx) => ({
      section: project.floorPlansSection,
      paymentPlans: project.paymentPlans,
      onCtaClick: ctx.openCTA
    })
  },

  Amenities: {
    id: "amenities",
    menuVisible: true,
    menuLabel: "Amenities",
    menuOrder: 5,
    Component: React.lazy(() => import("@/templates/common/Amenities")),
    props: (project, ctx) => ({
      heroTitle: project.amenities?.heroTitle,
      heroSubtitle: project.amenities?.heroSubtitle,
      amenityImages: project.amenities?.amenityImages,
      amenityCategories: project.amenities?.amenityCategories,
      onCtaClick: ctx.openCTA
    })
  },

  Views: {
    id: "views",
    menuVisible: true,
    menuLabel: "Views",
    menuOrder: 6,
    Component: React.lazy(() => import("@/templates/common/Views")),
    props: (project, ctx) => ({
      id: "views",
      title: project.views?.title,
      subtitle: project.views?.subtitle,
      images: project.views?.images,
      onCtaClick: ctx.openCTA
    })
  },

  LocationUI: {
    id: (project: ProjectData) =>
      project.locationUI?.sectionId?.trim() || "location-ui",
    menuVisible: true,
    menuLabel: "Location",
    menuOrder: 7,
    Component: React.lazy(() => import("@/templates/common/LocationUI")),
    props: (project: ProjectData, ctx) => ({
      section: {
        id: project.locationUI?.sectionId ?? "location-ui",
        title: project.locationUI?.title ?? "",
        subtitle: project.locationUI?.subtitle ?? "",
        tagline: project.locationUI?.tagline ?? "",
        videoId: project.locationUI?.videoId ?? "",
        mapUrl: project.locationUI?.mapUrl ?? "",
        categories: project.locationUI?.categories ?? [],
        ctaText: project.locationUI?.ctaText ?? "Enquire Now"
      },
      onCtaClick: ctx.openCTA
    })
  },

  Construction: {
    id: "construction",
    menuVisible: true,
    menuLabel: "Construction",
    menuOrder: 8,
    Component: React.lazy(() => import("@/templates/common/ConstructionStatus")),
    props: (project, ctx) => ({
      updates: project.construction ?? [],
      onCtaClick: ctx.openCTA
    })
  },

  PaymentPlans: {
    id: "payment-plans",
    menuVisible: false,
    menuLabel: "Pricing",
    menuOrder: 9,
    Component: React.lazy(() => import("@/templates/common/PaymentPlans")),
    props: (project, ctx) => ({
      sectionId: project.paymentPlans?.sectionId,
      sectionTitle: project.paymentPlans?.sectionTitle,
      sectionSubtitle: project.paymentPlans?.sectionSubtitle,
      pricingTitle: project.paymentPlans?.pricingTitle,
      pricingComputation: project.paymentPlans?.pricingComputation,
      scheduleTitle: project.paymentPlans?.scheduleTitle,
      paymentSchedule: project.paymentPlans?.paymentSchedule,
      ctaText: project.paymentPlans?.ctaText,
      onCtaClick: ctx.openCTA
    })
  },

  LoanEligibility: {
    id: "loan-eligibility",
    menuVisible: false,
    menuLabel: "Eligibility",
    menuOrder: 10,
    Component: React.lazy(() =>
      import("@/components/Widgets/LoanEligibilityWidget")
    ),
    props: (project: ProjectData) => ({
      banks: (project as any).loanBanks ?? []
    })
  },

  CustomerSpeaks: {
    id: "customer-speaks",
    menuVisible: true,
    menuLabel: "Testimonials",
    menuOrder: 11,
    Component: React.lazy(() => import("@/templates/common/CustomerSpeaks")),
    props: (project, ctx) => ({
      title: project.customerSpeaks?.title,
      subtitle: project.customerSpeaks?.subtitle,
      testimonials: project.customerSpeaks?.testimonials,
      onCtaClick: ctx.openCTA
    })
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
      documents: project.brochure?.documents
    })
  },

  FAQ: {
    id: "faq",
    menuVisible: true,
    menuLabel: "FAQ",
    menuOrder: 14,
    Component: React.lazy(() => import("@/templates/common/faq/FaqSection")),
    props: (project: ProjectData) => ({
      builder: project.builder,
      projectId: project.slug || project.projectId || project.id
    })
  },

  BuilderWidget: {
    id: "builder-projects",
    menuVisible: false,
    menuLabel: "More Projects",
    menuOrder: 15,
    Component: React.lazy(() =>
      import("@/components/Widgets/BuilderOtherProjects")
    ),
    props: (project: ProjectData) => ({
      projects: project.builderProjects ?? []
    })
  },

  LocalityWidget: {
    id: "locality-projects",
    menuVisible: false,
    menuLabel: "Nearby Projects",
    menuOrder: 16,
    Component: React.lazy(() =>
      import("@/components/Widgets/LocalityOtherProjects")
    ),
    props: (project: ProjectData) => ({
      projects: (project.localityProjects ?? []).filter(
        (p) =>
          typeof p.slug === "string" &&
          typeof p.name === "string" &&
          (!p.heroImage || typeof p.heroImage === "string")
      )
    })
  },

  BuilderAbout: {
    id: "about-builder",
    menuVisible: false,
    menuOrder: 13,
    Component: React.lazy(() => import("@/templates/common/BuilderAbout")),
    props: (project, ctx) => ({
      ...project.builderAbout,
      builderProjects: project.builderProjects,
      onCtaClick: ctx.openCTA
    })
  }
} as const;

export type SectionName = keyof typeof SECTIONS;
