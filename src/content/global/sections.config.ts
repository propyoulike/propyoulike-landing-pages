/**
 * ============================================================
 * Sections Configuration (GLOBAL)
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * - Declarative source of truth for ALL project page sections
 * - Defines:
 *    • Render order
 *    • Menu visibility
 *    • Component mapping
 *    • Explicit data wiring
 *
 * THIS FILE IS PURE CONFIG
 * ------------------------------------------------------------
 * - No logic
 * - No conditionals
 * - No component imports
 *
 * ============================================================
 *
 * DATA SOURCES (STRICT)
 * ------------------------------------------------------------
 * 1. project
 *    → Flat identity only (slug, builder, type, projectName)
 *
 * 2. $payload
 *    → Structured content sections (amenities, views, etc.)
 *
 * 3. $ctx
 *    → Runtime helpers (CTA handlers, menuItems)
 *
 * 4. $resolved
 *    → Derived / global / normalized data
 *
 * ❌ NEVER mix these responsibilities
 *
 * ============================================================
 */

const sectionsConfig = [
  /* ==========================================================
     HERO
     ========================================================== */
  {
    id: "hero",
    component: "Hero_component",
    menu: { visible: false, order: 1 },

    meta: "$payload.hero.meta",

    props: {
      hero: "$payload.hero",
      onCtaClick: "$ctx.openCTA",
    },
  },

  /* ==========================================================
     NAVBAR
     ========================================================== */
  {
    id: "navbar",
    component: "Navbar_component",
    menu: { visible: false, order: 2 },

    props: {
      projectName: "$payload.project.projectName",
      autoMenu: "$ctx.menuItems",
      onCtaClick: "$ctx.openCTA",
    },
  },

  /* ==========================================================
     SUMMARY / OVERVIEW
     ========================================================== */
  {
    id: "summary",
    component: "Summary_component",
    menu: { visible: true, label: "Overview", order: 3 },

    meta: "$payload.summary.meta",

    props: {
      description: "$payload.summary.description",
      highlights: "$payload.summary.highlights",
    },
  },

  /* ==========================================================
     PROPERTY PLANS
     ========================================================== */
  {
    id: "propertyPlans",
    component: "PropertyPlans_component",
    menu: { visible: true, label: "Plans", order: 4 },

    meta: "$payload.propertyPlans.meta",

    props: {
      floorPlans: "$payload.propertyPlans.floorPlans",
      unitPlans: "$payload.propertyPlans.unitPlans",
      masterPlan: "$payload.propertyPlans.masterPlan",
      modelFlats: "$payload.propertyPlans.modelFlats",
      onCtaClick: "$ctx.openCTA",
    },
  },

  /* ==========================================================
     AMENITIES
     ========================================================== */
  {
    id: "amenities",
    component: "Amenities_component",
    menu: { visible: true, label: "Amenities", order: 5 },

    meta: "$payload.amenities.meta",

    props: {
      amenityImages: "$payload.amenities.amenityImages",
      amenityCategories: "$payload.amenities.amenityCategories",
    },
  },

  /* ==========================================================
     VIEWS
     ========================================================== */
  {
    id: "views",
    component: "Views_component",
    menu: { visible: true, label: "Views", order: 6 },

    meta: "$payload.views.meta",

    props: {
      images: "$payload.views.images",
    },
  },

  /* ==========================================================
     LOCATION
     ========================================================== */
  {
    id: "locationUI",
    component: "LocationUI_component",
    menu: { visible: true, label: "Location", order: 7 },

    meta: "$payload.locationUI.meta",

    props: {
      videoId: "$payload.locationUI.videoId",
      mapUrl: "$payload.locationUI.mapUrl",
      categories: "$payload.locationUI.categories",
    },
  },

  /* ==========================================================
     CONSTRUCTION
     ========================================================== */
{
  id: "construction",
  component: "Construction_component",
  menu: { visible: true, label: "Construction", order: 8 },

  meta: "$resolved.construction.meta",

  props: {
    updates: "$resolved.construction.updates",
  },
},

  /* ==========================================================
     PAYMENT PLANS
     ========================================================== */
  {
    id: "paymentPlans",
    component: "PaymentPlans_component",
    menu: { visible: false, order: 9 },

    meta: "$payload.paymentPlans.meta",

    props: {
      pricingComputation:
        "$payload.paymentPlans.pricingComputation",
      paymentSchedule:
        "$payload.paymentPlans.paymentSchedule",
    },
  },

  /* ==========================================================
     LOAN ASSISTANCE (DERIVED)
     ========================================================== */
  {
    id: "loanAssistance",
    component: "LoanAssistance",
    menu: { visible: false, order: 10 },

    meta: "$resolved.loanSupport.meta",

    props: {
      loanSupport: "$resolved.loanSupport",
      onCtaClick: "$ctx.openCTA",
    },
  },

  /* ==========================================================
     TESTIMONIALS
     ========================================================== */
  {
    id: "testimonials",
    component: "Testimonials_component",
    menu: { visible: true, label: "Testimonials", order: 11 },

    meta: "$payload.testimonials.meta",

    props: {
      testimonials: "$payload.testimonials.testimonials",
      onCtaClick: "$ctx.openCTA",
    },
  },

  /* ==========================================================
     BROCHURE
     ========================================================== */
  {
    id: "brochure",
    component: "Brochure_component",
    menu: { visible: false, order: 12 },

    meta: "$payload.brochure.meta",

    props: {
      coverImage: "$payload.brochure.coverImage",
      documents: "$payload.brochure.documents",
    },
  },

  /* ==========================================================
     ABOUT BUILDER
     ========================================================== */
  {
    id: "aboutBuilder",
    component: "AboutBuilder_component",
    menu: { visible: false, order: 13 },

    meta: "$payload.aboutBuilder.meta",

    props: {
      name: "$payload.aboutBuilder.name",
      description: "$payload.aboutBuilder.description",
      descriptionExpanded:
        "$payload.aboutBuilder.descriptionExpanded",
      stats: "$payload.aboutBuilder.stats",
    },
  },

  /* ==========================================================
     FAQ
     ========================================================== */
  {
    id: "faq",
    component: "Faq_component",
    menu: { visible: true, label: "FAQ", order: 14 },

    meta: "$payload.faq.meta",

    props: {
      faqs: "$payload.faq.faqs",
      onCtaClick: "$ctx.openCTA",
      whatsappNumber: "$resolved.contact.whatsapp",
    },
  },
];

export default sectionsConfig;
