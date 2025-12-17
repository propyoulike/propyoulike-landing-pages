import { z } from "zod";

/* ============================================================
   COMMON SECTION HEADER (MENTAL MODEL)
   title?: string
   subtitle?: string
   tagline?: string
============================================================ */

/* ============================================================
   HERO
============================================================ */
const HeroSchema = z.object({
  videoId: z.string().optional(),
  images: z.array(z.string()).optional(),

  overlayTitle: z.string().optional(),
  overlaySubtitle: z.string().optional(),

  quickInfo: z.object({
    price: z.string().optional(),
    typology: z.string().optional(),
    size: z.string().optional(),
  }).optional(),
});

/* ============================================================
   SUMMARY
============================================================ */
const SummarySchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

/* ============================================================
   AMENITIES
============================================================ */
const AmenitiesSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  amenityImages: z.array(
    z.object({
      src: z.string(),
      title: z.string().optional(),
    })
  ).optional(),

  amenityCategories: z.array(
    z.object({
      title: z.string(),
      items: z.array(z.string()).min(1),
    })
  ).min(1),
});

/* ============================================================
   VIEWS
============================================================ */
const ViewsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  images: z.array(
    z.object({
      src: z.string(),
      title: z.string().optional(),
    })
  ).min(1),
});

/* ============================================================
   LOCATION UI
============================================================ */
const LocationUISchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  videoId: z.string().optional(),
  mapUrl: z.string(),

  categories: z.array(
    z.object({
      title: z.string(),
      items: z.array(z.string()).optional(),
    })
  ).optional(),
});

/* ============================================================
   PROPERTY PLANS
============================================================ */
const PropertyPlansSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  modelFlats: z.array(
    z.object({
      title: z.string().optional(),
      youtubeId: z.string().optional(),
    })
  ).optional(),

  unitPlans: z.array(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      sba: z.string().optional(),
      ca: z.string().optional(),
      usable: z.string().optional(),
      uds: z.string().optional(),
      price: z.string().optional(),
      floorPlanImage: z.string().optional(),
    })
  ).optional(),

  floorPlans: z.array(
    z.object({
      title: z.string().optional(),
      image: z.string().optional(),
      description: z.string().optional(),
    })
  ).optional(),

  masterPlan: z.object({
    image: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
}).refine(
  v =>
    (v.modelFlats?.length ?? 0) > 0 ||
    (v.unitPlans?.length ?? 0) > 0 ||
    (v.floorPlans?.length ?? 0) > 0 ||
    !!v.masterPlan?.image,
  {
    message:
      "PropertyPlans must include at least one: modelFlats, unitPlans, floorPlans, or masterPlan",
  }
);

/* ============================================================
   PAYMENT PLANS (FIXED)
============================================================ */
const PaymentPlansSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  pricing: z.object({
    title: z.string().optional(),
    computation: z.array(
      z.object({
        title: z.string().optional(),
        points: z.array(z.string()).optional(),
      })
    ).optional().default([]),
  }).optional(),

  schedule: z.object({
    title: z.string().optional(),
    items: z.array(
      z.object({
        title: z.string().optional(),
        percentage: z.string().optional(),
        items: z.array(z.string()).optional(),
      })
    ).optional().default([]),
  }).optional(),
});

/* ============================================================
   CONSTRUCTION
============================================================ */
const ConstructionUpdateSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  videoId: z.string().optional(),
  type: z.enum(["image", "video"]).default("image"),

  status: z.array(z.string()).optional(),
  achieved: z.array(z.string()).optional(),
  upcoming: z.array(z.string()).optional(),
});

const ConstructionSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  updates: z.array(ConstructionUpdateSchema).default([]),
});

/* ============================================================
   TESTIMONIALS
============================================================ */
const TestimonialsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  testimonials: z.array(
    z.object({
      name: z.string(),
      quote: z.string().optional(),
      videoId: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      thumbUrl: z.string().optional(),
    }).refine(
      v => v.quote || v.videoId,
      { message: "Testimonial must have quote or videoId" }
    )
  ).default([]),
});

/* ============================================================
   BUILDER ABOUT
============================================================ */
const AboutBuilderSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  description: z.string().optional(),
  descriptionExpanded: z.string().optional(),

  stats: z.array(
    z.object({
      icon: z.string().optional(),
      label: z.string(),
      value: z.string(),
    })
  ).optional(),
});

/* ============================================================
   PROJECT CARD
============================================================ */
const ProjectCardSchema = z.object({
  slug: z.string(),
  builder: z.string(),
  projectName: z.string(),

  city: z.string().optional(),
  zone: z.string().optional(),
  locality: z.string().optional(),

  heroImage: z.string().nullable().optional(),
  heroVideoId: z.string().nullable().optional(),
});

/* ============================================================
   LOAN SUPPORT (ALIGNED)
============================================================ */
const LoanSupportSchema = z.object({
  enabled: z.boolean().default(true),

  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  banks: z.array(
    z.object({
      name: z.string(),
      logo: z.string().optional(),
    })
  ).optional(),

  ctaText: z.string().optional(),
});

/* ============================================================
   BROCHURE
============================================================ */
const BrochureSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),

  coverImage: z.string().url().optional(),

  documents: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
    })
  ).default([]),
});

/* ============================================================
   FAQ
============================================================ */
const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().optional().default("General"),
  order: z.number().optional(),
  source: z.enum(["builder", "project", "global"]).optional(),
});

const FAQSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  faqs: z.array(FAQItemSchema),
});

/* ============================================================
   FINAL PROJECT SCHEMA
============================================================ */
export const ProjectSchema = z.object({
  slug: z.string(),
  projectName: z.string(),
  builder: z.string(),

  city: z.string(),
  zone: z.enum(["East", "West", "North", "South", "Central"]).optional(),
  area: z.string().optional(),
  locality: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),

  status: z.string().optional(),
  type: z.string().optional(),

  hero: HeroSchema,
  summary: SummarySchema.optional(),
  amenities: AmenitiesSchema.optional(),
  views: ViewsSchema.optional(),
  locationUI: LocationUISchema.optional(),
  propertyPlans: PropertyPlansSchema.optional(),
  paymentPlans: PaymentPlansSchema.optional(),
  brochure: BrochureSchema.optional(),
  testimonials: TestimonialsSchema.optional(),
  aboutBuilder: AboutBuilderSchema.optional(),
  construction: ConstructionSchema.optional(),
  faq: FAQSchema.optional(),

  localityProjects: z.array(ProjectCardSchema).optional(),
  builderProjects: z.array(ProjectCardSchema).optional(),
  loanSupport: LoanSupportSchema.optional(),
});

export type ProjectData = z.infer<typeof ProjectSchema>;
