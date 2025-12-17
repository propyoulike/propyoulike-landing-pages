// src/content/global/sections.config.ts

import { COMPONENT_REGISTRY } from "@/content/registry/componentRegistry";

const sectionsConfig = [
  {
    id: "hero",
    component: "Hero_component",
    menu: { visible: false, order: 1 },
    props: {
      "...hero": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "navbar",
    component: "Navbar_component",
    menu: { visible: false, order: 2 },
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
    props: {
      "...propertyPlans": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "amenities",
    component: "Amenities_component",
    menu: { visible: true, label: "Amenities", order: 5 },
    props: {
      "...amenities": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "views",
    component: "Views_component",
    menu: { visible: true, label: "Views", order: 6 },
    props: {
      "...views": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "locationUI",
    component: "LocationUI_component",
    menu: { visible: true, label: "Location", order: 7 },
    props: {
      "...locationUI": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "construction",
    component: "Construction_component",
    menu: { visible: true, label: "Construction", order: 8 },
    props: {
      "...construction": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "paymentPlans",
    component: "PaymentPlans_component",
    menu: { visible: false, order: 9 },
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
    props: {
      loanSupport: "$resolved.loanSupport",
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "testimonials",
    component: "Testimonials_component",
    menu: { visible: true, label: "Testimonials", order: 11 },
    props: {
      "...testimonials": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "brochure",
    component: "Brochure_component",
    menu: { visible: false, order: 12 },
    props: {
      "...brochure": true,
      onCtaClick: "$ctx.openCTA",
    },
  },

  {
    id: "aboutBuilder",
    component: "AboutBuilder_component",
    menu: { visible: false, order: 13 },
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
    props: {
      faqs: "project.faq.faqs",
      title: "project.faq.title",
      subtitle: "project.faq.subtitle",
      onCtaClick: "$ctx.openCTA",
    },
  }

];

export default sectionsConfig;
