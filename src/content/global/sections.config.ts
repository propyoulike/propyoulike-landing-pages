// src/content/global/sections.config.ts

import { COMPONENT_REGISTRY } from "@/content/registry/componentRegistry";

const sectionsConfig = [
  {
    id: "hero",
    component: "Hero_component",
    menu: { visible: false, order: 1 },
  meta: {
    title: "hero.heading.title",
    subtitle: "hero.heading.subtitle",
    tagline: "hero.heading.tagline",
  },    props: {
      "...hero": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "navbar",
    component: "Navbar_component",
    menu: { visible: false, order: 2 },
  meta: {
    title: "navbar.heading.title",
    subtitle: "navbar.heading.subtitle",
    tagline: "navbar.heading.tagline",
  },
    props: {
      projectName: "project.projectName",
      autoMenu: "$ctx.menuItems",
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "summary",
    component: "Summary_component",
    menu: { visible: true, label: "Overview", order: 3 },
  meta: {
    title: "summary.heading.title",
    subtitle: "summary.heading.subtitle",
    tagline: "summary.heading.tagline",
  },
    props: {
      "...summary": true,
      modelFlats: "project.propertyPlans.modelFlats",
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "propertyPlans",
    component: "PropertyPlans_component",
    menu: { visible: true, label: "Plans", order: 4 },
  meta: {
    title: "propertyPlans.heading.title",
    subtitle: "propertyPlans.heading.subtitle",
    tagline: "propertyPlans.heading.tagline",
  },
    props: {
      "...propertyPlans": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "amenities",
    component: "Amenities_component",
    menu: { visible: true, label: "Amenities", order: 5 },
  meta: {
    title: "amenities.heading.title",
    subtitle: "amenities.heading.subtitle",
    tagline: "amenities.heading.tagline",
  },
    props: {
      "...amenities": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "views",
    component: "Views_component",
    menu: { visible: true, label: "Views", order: 6 },
  meta: {
    title: "views.heading.title",
    subtitle: "views.heading.subtitle",
    tagline: "views.heading.tagline",
  },
    props: {
      "...views": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "locationUI",
    component: "LocationUI_component",
    menu: { visible: true, label: "Location", order: 7 },
  meta: {
    title: "locationUI.heading.title",
    subtitle: "locationUI.heading.subtitle",
    tagline: "locationUI.heading.tagline",
  },
    props: {
      "...locationUI": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "construction",
    component: "Construction_component",
    menu: { visible: true, label: "Construction", order: 8 },
  meta: {
    title: "construction.heading.title",
    subtitle: "construction.heading.subtitle",
    tagline: "construction.heading.tagline",
  },
    props: {
      "...construction": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "paymentPlans",
    component: "PaymentPlans_component",
    menu: { visible: false, order: 9 },
  meta: {
    title: "paymentPlans.heading.title",
    subtitle: "paymentPlans.heading.subtitle",
    tagline: "paymentPlans.heading.tagline",
  },
    props: {
      "...paymentPlans": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  // ✅ LOAN ASSISTANCE (GLOBAL REASSURANCE BLOCK)
  {
    id: "loanAssistance",
    component: "LoanAssistance",
    menu: { visible: false, order: 10 },
  meta: {
    title: "loanAssistance.heading.title",
    subtitle: "loanAssistance.heading.subtitle",
    tagline: "loanAssistance.heading.tagline",
  },
    props: {
      loanSupport: "$resolved.loanSupport",
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "testimonials",
    component: "Testimonials_component",
    menu: { visible: true, label: "Testimonials", order: 11 },
  meta: {
    title: "testimonials.heading.title",
    subtitle: "testimonials.heading.subtitle",
    tagline: "testimonials.heading.tagline",
  },
    props: {
      "...testimonials": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "brochure",
    component: "Brochure_component",
    menu: { visible: false, order: 12 },
  meta: {
    title: "brochure.heading.title",
    subtitle: "brochure.heading.subtitle",
    tagline: "brochure.heading.tagline",
  },
    props: {
      "...brochure": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "aboutBuilder",
    component: "AboutBuilder_component",
    menu: { visible: false, order: 13 },
  meta: {
    title: "aboutBuilder.heading.title",
    subtitle: "aboutBuilder.heading.subtitle",
    tagline: "aboutBuilder.heading.tagline",
  },
    props: {
      "...aboutBuilder": true,
      builderProjects: "project.builderProjects",
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "faq",
    component: "Faq_component",
    menu: { visible: true, label: "FAQ", order: 14 },
  meta: {
    title: "faq.heading.title",
    subtitle: "faq.heading.subtitle",
    tagline: "faq.heading.tagline",
  },
    props: {
      faqs: "project.faq.faqs",
      title: "project.faq.title",
      subtitle: "project.faq.subtitle",
      onCtaClick: "$ctx.openCTA",
    },
  }

];

export default sectionsConfig;
