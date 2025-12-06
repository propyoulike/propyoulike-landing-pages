import { z } from "zod";

/**
 * Universal project schema.
 * Generic and reusable across all builders.
 */

/* -----------------------------------------
    COMMON SECTION SCHEMAS
----------------------------------------- */

const HeroSchema = z
  .object({
    videoUrl: z.string().optional(),
    images: z.array(z.string()).optional(),
    overlayTitle: z.string().optional(),
    overlaySubtitle: z.string().optional(),
    ctaEnabled: z.boolean().default(false),
    quickInfo: z
      .object({
        price: z.string().optional(),
        typology: z.string().optional(),
        size: z.string().optional(),
      })
      .optional(),
  })
  .optional();

const NavbarSchema = z
  .object({
    logo: z.string().optional(),
    menu: z
      .array(
        z.object({
          label: z.string(),
          targetId: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

const SummarySchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    highlights: z
      .array(
        z.object({
          icon: z.string().optional(),
          label: z.string().optional(),
          value: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

const BrochureSchema = z
  .object({
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    coverImage: z.string().optional(),
    documents: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  })
  .optional();

const ViewsSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    images: z
      .array(
        z.object({
          src: z.string(),
          title: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

/* -----------------------------------------
    FLOOR PLANS SECTION
----------------------------------------- */

const FloorPlansSectionSchema = z
  .object({
    title: z.string(),
    subtitle: z.string(),

    unitPlans: z.array(
      z.object({
        title: z.string(),
        videoUrl: z.string(),
        description: z.string(),
        sba: z.string(),
        ca: z.string(),
        usable: z.string(),
        uds: z.string(),
        price: z.string(),
        floorPlanImage: z.string().optional(),
      })
    ),

    floorPlans: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        description: z.string(),
      })
    ),

    masterPlan: z.object({
      image: z.string(),
      title: z.string(),
      description: z.string(),
    }),

    ctaText: z.string(),
  })
  .optional();

/* -----------------------------------------
    LOCATION UI SECTION (NEW)
----------------------------------------- */

const LocationUISchema = z.object({
  sectionId: z.string().default("location-ui"),
  title: z.string(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  videoUrl: z.string().optional(),
  mapUrl: z.string().optional(),

  categories: z
    .array(
      z.object({
        title: z.string(),
        items: z.array(z.string())
      })
    )
    .default([]),

  ctaText: z.string().optional(),
});

/* -----------------------------------------
    OTHER SECTIONS
----------------------------------------- */

const AmenitiesSchema = z
  .object({
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    amenityImages: z
      .array(
        z.object({
          src: z.string(),
          title: z.string().optional(),
        })
      )
      .optional(),
    amenityCategories: z
      .array(
        z.object({
          title: z.string(),
          items: z.array(z.string()),
        })
      )
      .optional(),
  })
  .optional();

const ConstructionSchema = z
  .array(
    z.object({
      name: z.string(),
      image: z.string().optional(),
      updates: z.array(z.string()).optional(),
    })
  )
  .optional();

/* -----------------------------------------
    PAYMENT PLANS
----------------------------------------- */

const PaymentPlansSchema = z
  .object({
    sectionId: z.string(),
    sectionTitle: z.string(),
    sectionSubtitle: z.string(),
    pricingTitle: z.string(),

    pricingComputation: z.array(
      z.object({
        title: z.string(),
        points: z.array(z.string()),
      })
    ),

    scheduleTitle: z.string(),

    paymentSchedule: z.array(
      z.object({
        title: z.string(),
        percentage: z.string(),
        items: z.array(z.string()).optional(),
      })
    ),

    ctaText: z.string(),
  })
  .optional();

/* -----------------------------------------
    CUSTOMER SPEAKS
----------------------------------------- */

const CustomerSpeaksSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    testimonials: z
      .array(
        z.object({
          name: z.string(),
          videoId: z.string().optional(),
          quote: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

/* -----------------------------------------
    FAQ (Array of Items)
----------------------------------------- */

const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const FAQSchema = z.array(FAQItemSchema).optional();

/* -----------------------------------------
    BUILDER ABOUT
----------------------------------------- */

const BuilderAboutSchema = z
  .object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    descriptionExpanded: z.string().optional(),
    stats: z
      .array(
        z.object({
          icon: z.string().optional(),
          label: z.string().optional(),
          value: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

const NavbarConfigSchema = z.object({
  visible: z.array(z.string()).optional(),
  hidden: z.array(z.string()).optional(),
  order: z.array(z.string()).optional(),
  ctaLabel: z.string().optional()
}).optional();

/* -----------------------------------------
    TOP-LEVEL PROJECT SCHEMA
----------------------------------------- */

export const ProjectSchema = z.object({
  builder: z.string(),
  slug: z.string(),
  projectName: z.string(),
  type: z.string().optional(),

  meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),

  sections: z.array(z.string()).optional(),

  navbar: NavbarSchema,
  navbarConfig: NavbarConfigSchema,
  hero: HeroSchema,
  summary: SummarySchema,
  brochure: BrochureSchema,
  views: ViewsSchema,
  floorPlansSection: FloorPlansSectionSchema,
  locationUI: LocationUISchema.optional(),
  amenities: AmenitiesSchema,
  construction: ConstructionSchema,
  paymentPlans: PaymentPlansSchema,
  customerSpeaks: CustomerSpeaksSchema,

  faq: FAQSchema,

  builderAbout: BuilderAboutSchema,
});

export type ProjectData = z.infer<typeof ProjectSchema>;
