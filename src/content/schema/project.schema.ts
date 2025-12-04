import { z } from "zod";

/* ----------------------------------------------------
   HERO
---------------------------------------------------- */
const HeroSchema = z.object({
  videoUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  overlayTitle: z.string().optional(),
  overlaySubtitle: z.string().optional(),
  ctaEnabled: z.boolean().default(true),
  quickInfo: z
    .object({
      price: z.string().optional(),
      typology: z.string().optional(),
      location: z.string().optional(),
      size: z.string().optional(),
    })
    .optional(),
});

/* ----------------------------------------------------
   NAVBAR
---------------------------------------------------- */
const NavbarSchema = z.object({
  logo: z.string().optional(),
  menu: z
    .array(
      z.object({
        label: z.string(),
        targetId: z.string().optional(),
      })
    )
    .optional(),
}).optional();

/* ----------------------------------------------------
   SUMMARY
---------------------------------------------------- */
const SummarySchema = z.object({
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
});

/* ----------------------------------------------------
   BROCHURE
---------------------------------------------------- */
const BrochureSchema = z.object({
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
}).optional();

/* ----------------------------------------------------
   VIEWS (REUSABLE)
---------------------------------------------------- */
const ViewImageSchema = z.object({
  src: z.string(),
  title: z.string().optional(),
});

const ViewsSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  images: z.array(ViewImageSchema),
}).optional();

/* ----------------------------------------------------
   GALLERY
---------------------------------------------------- */
const GallerySchema = z.array(z.string()).optional();

/* ----------------------------------------------------
   UNIT PLANS
---------------------------------------------------- */
const UnitPlanSchema = z.object({
  title: z.string(),
  video: z.string().optional(),
  description: z.string().optional(),
  sba: z.string().optional(),
  ca: z.string().optional(),
  usable: z.string().optional(),
  uds: z.string().optional(),
  price: z.string().optional(),
  floorPlan: z.string().optional(),
});

/* ----------------------------------------------------
   FLOOR PLANS
---------------------------------------------------- */
const FloorPlanSchema = z.object({
  title: z.string(),
  image: z.string(),
  description: z.string().optional(),
});
const FloorPlansSchema = z.array(FloorPlanSchema).optional();

/* ----------------------------------------------------
   LOCATION DATA
---------------------------------------------------- */
const LocationSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  landmarks: z.array(z.string()).optional(),
});

/* ----------------------------------------------------
   LOCATION UI (REUSABLE)
---------------------------------------------------- */
const LocationSectionSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

const LocationUISchema = z.object({
  videoUrl: z.string().optional(),
  mapUrl: z.string().optional(),
  sections: z.array(LocationSectionSchema),
}).optional();

/* ----------------------------------------------------
   PAYMENT UI (for PaymentPlans component)
---------------------------------------------------- */
const PricingComputationSchema = z.object({
  title: z.string(),
  points: z.array(z.string()),
});

const PaymentStageSchema = z.object({
  title: z.string(),
  percentage: z.string(),
  expandable: z.boolean().default(false),
  items: z.array(z.string()).optional(),
});

const PaymentPlansUISchema = z.object({
  pricingComputation: z.array(PricingComputationSchema).optional(),
  paymentSchedule: z.array(PaymentStageSchema).optional(),
}).optional();

/* ----------------------------------------------------
   CUSTOMER SPEAKS
---------------------------------------------------- */
const TestimonialSchema = z.object({
  name: z.string(),
  videoId: z.string(),
  quote: z.string().optional(),
});

const CustomerSpeaksSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  testimonials: z.array(TestimonialSchema),
}).optional();

/* ----------------------------------------------------
   BUILDER ABOUT (REUSABLE)
---------------------------------------------------- */
const BuilderAboutSchema = z.object({
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
}).optional();

/* ----------------------------------------------------
   FAQ
---------------------------------------------------- */
const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const FAQSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(FAQItemSchema),
}).optional();

/* ----------------------------------------------------
   AMENITIES (NEW REUSABLE)
---------------------------------------------------- */
const AmenityImageSchema = z.object({
  src: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const AmenityCategorySchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
});

const AmenitiesSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  amenityImages: z.array(AmenityImageSchema).optional(),
  amenityCategories: z.array(AmenityCategorySchema).optional(),
}).optional();

/* ----------------------------------------------------
   CONSTRUCTION
---------------------------------------------------- */
const ConstructionTowerSchema = z.object({
  name: z.string(),
  image: z.string(),
  status: z.array(z.string()).optional(),
  achieved: z.array(z.string()).optional(),
  upcoming: z.array(z.string()).optional(),
});

const ConstructionSchema = z.array(ConstructionTowerSchema).optional();

/* ----------------------------------------------------
   SECTIONS ORDER
---------------------------------------------------- */
const SectionsSchema = z.array(z.string()).optional();

/* ----------------------------------------------------
   BASE PROJECT SCHEMA
---------------------------------------------------- */
export const ProjectBaseSchema = z.object({
  builder: z.string(),
  slug: z.string(),
  projectName: z.string(),

  navbar: NavbarSchema,
  sections: SectionsSchema,

  hero: HeroSchema.optional(),
  summary: SummarySchema.optional(),

  location: LocationSchema.optional(),
  locationUI: LocationUISchema.optional(),

  brochure: BrochureSchema,
views: ViewsSchema.optional(),
  gallery: GallerySchema,

  unitPlans: z.array(UnitPlanSchema).default([]),
  floorPlans: FloorPlansSchema,

amenities: AmenitiesSchema.optional(),
construction: ConstructionSchema.optional(),

  media: z.object({ masterPlan: z.string().optional() }).optional(),
  paymentUI: PaymentPlansUISchema.optional(),

  customerSpeaks: CustomerSpeaksSchema,
  faqs: FAQSchema.optional(),


  builderAbout: BuilderAboutSchema.optional(),
});

/* ----------------------------------------------------
   PROVIDENT EXTENSION
---------------------------------------------------- */
export const ProvidentExtensionSchema = z.object({
  provident: z
    .object({
      theme: z.string().optional(),
      communitySize: z.string().optional(),
      usp: z.array(z.string()).optional(),
    })
    .optional(),
});

/* ----------------------------------------------------
   MERGED SCHEMA
---------------------------------------------------- */
export const ProjectSchema = ProjectBaseSchema.merge(ProvidentExtensionSchema);
export type ProjectData = z.infer<typeof ProjectSchema>;
