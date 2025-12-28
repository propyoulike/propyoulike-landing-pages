import { z } from "zod";

/**
 * ============================================================
 * IMPORTANT ARCHITECTURE NOTES
 * ============================================================
 * - All schemas below are AUTHORING schemas unless stated.
 * - ProjectCard + *Projects arrays are DERIVED at runtime.
 * - No empty arrays or empty strings are allowed as meaning.
 * - Sections may be optional, but when present must be meaningful.
 *
 * IDENTITY RULE (LOCKED):
 * - builder, slug, city, locality, zone are PROJECT-LEVEL identity
 * - sections NEVER contain identity fields
 * - sections may READ identity, not own it
 * - ProjectCard is DERIVED, never authored
 */

/* ============================================================
   SHARED SCHEMAS
============================================================ */

const GroupedListSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

/* ============================================================
   SECTION META (CANONICAL)
============================================================ */

export const SectionMetaSchema = z.object({
  eyebrow: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
});

/* ============================================================
   HERO
============================================================ */

export const HeroQuickInfoSchema = z.object({
  price: z.string().optional(),
  typology: z.string().optional(),
  size: z.string().optional(),
});

export const HeroSchema = z
  .object({
    videoId: z.string().optional(),
    images: z.array(z.string().min(1)).optional(),

    meta: SectionMetaSchema.optional(),

    quickInfo: HeroQuickInfoSchema.optional(),
  })
  .refine(
    (v) => v.videoId || v.images?.length || v.title,
    {
      message:
        "Hero must have at least one of: videoId, images, or title",
    }
  );

/* ============================================================
   SUMMARY
============================================================ */

export const SummarySchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    description: z.string().min(1).optional(),

    highlights: z
      .array(z.string().min(1))
      .min(1, "Highlights must contain at least one item")
      .optional(),
  })
  .refine(
    (v) =>
      v.title ||
      v.subtitle ||
      v.tagline ||
      v.description ||
      v.highlights,
    {
      message: "Summary must contain at least some content",
    }
  );

/* ============================================================
   AMENITIES
============================================================ */

const AmenityImageSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  media_type: z.enum(["image", "video"]).optional(),
});

const AmenityCategorySchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const AmenitiesSchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    amenityImages: z.array(AmenityImageSchema).min(1).optional(),
    amenityCategories: z.array(AmenityCategorySchema).min(1).optional(),
  })
  .refine(
    (v) => v.amenityImages || v.amenityCategories,
    {
      message:
        "Amenities must include at least one of amenityImages or amenityCategories",
    }
  );

/* ============================================================
   VIEWS
============================================================ */

const ViewImageSchema = z.object({
  src: z.string().min(1),
  title: z.string().min(1).optional(),
  order: z.number().int().optional(),
  is_active: z.boolean().default(true),
});

export const ViewsSchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    images: z.array(ViewImageSchema).min(1),
  })
  .refine(
    (v) => v.images.some((img) => img.is_active !== false),
    {
      message: "At least one view image must be active",
    }
  );

/* ============================================================
   LOCATION UI
============================================================ */

const LocationCategorySchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export const LocationUISchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    videoId: z.string().optional(),
    mapUrl: z.string().optional(),

    categories: z.array(LocationCategorySchema).min(1).optional(),
  })
  .refine(
    (v) => v.videoId || v.mapUrl,
    {
      message: "LocationUI must have at least a videoId or a mapUrl",
    }
  );

/* ============================================================
   PROPERTY PLANS
============================================================ */

const ModelFlatSchema = z.object({
  title: z.string().min(1),
  youtubeId: z.string().min(1),
  order: z.number().int().optional(),
});

const UnitPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  sba: z.string().optional(),
  ca: z.string().optional(),
  usable: z.string().optional(),
  uds: z.string().optional(),
  price: z.string().optional(),
  floorPlanImage: z.string().optional(),
});

const FloorPlanSchema = z.object({
  title: z.string().min(1),
  image: z.string().min(1),
  description: z.string().min(1).optional(),
});

const MasterPlanSchema = z.object({
  image: z.string().min(1),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const PropertyPlansSchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    modelFlats: z.array(ModelFlatSchema).min(1).optional(),
    unitPlans: z.array(UnitPlanSchema).min(1).optional(),
    floorPlans: z.array(FloorPlanSchema).min(1).optional(),
    masterPlan: MasterPlanSchema.optional(),
  })
  .refine(
    (v) =>
      v.modelFlats ||
      v.unitPlans ||
      v.floorPlans ||
      v.masterPlan,
    {
      message:
        "PropertyPlans must include at least one content block",
    }
  );

/* ============================================================
   PAYMENT & PRICING PLANS (GROUPED)
============================================================ */

export const PaymentPlansSchema = z.object({
    meta: SectionMetaSchema.optional(),

  /* ----------------------------
     PRICING
  ----------------------------- */
  pricingTitle: z.string().min(1).optional(),

  pricingComputation: z
    .array(GroupedListSchema)
    .optional(),

  /* ----------------------------
     PAYMENT SCHEDULE
  ----------------------------- */
  scheduleTitle: z.string().min(1).optional(),

  paymentSchedule: z
    .array(GroupedListSchema)
    .optional(),

  /* ----------------------------
     CTA
  ----------------------------- */
  ctaText: z.string().min(1).optional(),
});

/* ============================================================
   CONSTRUCTION
============================================================ */

const ConstructionUpdateSchema = z
  .object({
    name: z.string().min(1),
    image: z.string().min(1).optional(),
    videoId: z.string().min(1).optional(),
    type: z.enum(["image", "video"]).default("image"),
  })
  .refine(
    (v) =>
      (v.type === "image" && !!v.image) ||
      (v.type === "video" && !!v.videoId),
    {
      message:
        "Construction update must match its media type",
    }
  );

export const ConstructionSchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    status: z
      .enum(["not-started", "in-progress", "updates-coming-soon"])
      .optional(),

    updates: z.array(ConstructionUpdateSchema).optional(),
    note: z.string().min(1).optional(),
  })
  .refine(
    (v) => v.updates?.length || v.status || v.note,
    {
      message:
        "Construction must have updates or a status/note",
    }
  );

/* ============================================================
   TESTIMONIALS
============================================================ */

const TestimonialItemSchema = z
  .object({
    name: z.string().min(1),
    quote: z.string().min(1).optional(),
    videoId: z.string().min(1).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    thumbUrl: z.string().min(1).optional(),
  })
  .refine(
    (v) => v.quote || v.videoId,
    {
      message:
        "Testimonial must have either quote or videoId",
    }
  );

export const TestimonialsSchema = z.object({
    meta: SectionMetaSchema.optional(),

  testimonials: z.array(TestimonialItemSchema).min(1),
});

/* ============================================================
   BUILDER ABOUT
============================================================ */

const BuilderStatSchema = z.object({
  icon: z.string().optional(),
  label: z.string().min(1),
  value: z.string().min(1),
});

export const AboutBuilderSchema = z
  .object({
    name: z.string().min(1),

    meta: SectionMetaSchema.optional(),

    description: z.string().min(1).optional(),
    descriptionExpanded: z.string().min(1).optional(),

    stats: z.array(BuilderStatSchema).min(1).optional(),
  })
  .refine(
    (v) =>
      v.title ||
      v.subtitle ||
      v.tagline ||
      v.description ||
      v.descriptionExpanded ||
      v.stats,
    {
      message:
        "AboutBuilder must include some descriptive content",
    }
  );

/* ============================================================
   PROJECT CARD (DERIVED)
============================================================ */

export const ProjectCardSchema = z
  .object({
    slug: z.string().min(1),
    builder: z.string().min(1),
    projectName: z.string().min(1),

    city: z.string().optional(),
    locality: z.string().optional(),
    zone: z.enum(["East", "West", "North", "South", "Central"]).optional(),

    heroImage: z.string().min(1).nullable().optional(),
    heroVideoId: z.string().min(1).nullable().optional(),
  })
  .refine(
    (v) => v.heroImage || v.heroVideoId,
    {
      message:
        "ProjectCard must have at least one visual",
    }
  );

/* ============================================================
   LOAN SUPPORT
============================================================ */

const LoanBankSchema = z.object({
  name: z.string().min(1),
  logo: z.string().optional(),
});

export const LoanSupportSchema = z
  .object({
    enabled: z.boolean().default(true),

    meta: SectionMetaSchema.optional(),

    banks: z.array(LoanBankSchema).min(1).optional(),
    ctaText: z.string().min(1).optional(),
  })
  .refine(
    (v) => v.enabled === false || v.banks || v.ctaText,
    {
      message:
        "LoanSupport enabled=true requires banks or CTA",
    }
  );

/* ============================================================
   BROCHURE
============================================================ */

const BrochureDocumentSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
});

export const BrochureSchema = z
  .object({
    meta: SectionMetaSchema.optional(),

    coverImage: z.string().url().nullable().optional(),
    documents: z.array(BrochureDocumentSchema).min(1).optional(),

    status: z
      .enum(["available", "on-request", "coming-soon"])
      .optional(),

    note: z.string().min(1).optional(),
  })
  .refine(
    (v) => v.documents || v.status || v.note,
    {
      message:
        "Brochure must have documents or a status/note",
    }
  );

/* ============================================================
   FAQ
============================================================ */

const FAQItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),

  category: z.string().min(1).optional(),
  subCategory: z.string().min(1).optional(),
  isPopular: z.boolean().optional(),

  order: z.number().int().optional(),
  source: z.enum(["builder", "project", "global"]).optional(),
});

export const FAQSchema = z.object({
    meta: SectionMetaSchema.optional(),

  faqs: z.array(FAQItemSchema).min(1),
});

/* ============================================================
   FINAL PROJECT SCHEMA
============================================================ */

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  builder: z.string().min(1),
  projectName: z.string().min(1),

  type: z.string().optional(),
  status: z.string().optional(),
  featured: z.boolean().optional(),

  area: z.string().optional(),
  locality: z.string().optional(),
  zone: z.enum(["East", "West", "North", "South", "Central"]).optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),

  hero: HeroSchema.optional(),

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
  loanSupport: LoanSupportSchema.optional(),

  /* Derived (runtime only) */
  localityProjects: z.array(ProjectCardSchema).optional(),
  builderProjects: z.array(ProjectCardSchema).optional(),
});

export type ProjectData = z.infer<typeof ProjectSchema>;
