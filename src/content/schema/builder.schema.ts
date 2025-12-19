// src/content/schema/builder.schema.ts
import { z } from "zod";

/* --------------------------------------------
   VALID SECTIONS FOR BUILDER OVERRIDES
--------------------------------------------- */
export const SectionNames = z.enum([
  "Navbar",
  "Hero",
  "Summary",
  "PropoertyPlans",
  "Location",
  "Amenities",
  "Views",
  "Construction",
  "PaymentPlans",
  "LoanApplication",
  "Testimonials",
  "Brochure",
  "FAQ",
  "AboutBuilder",
]);

/* --------------------------------------------
   BASE BUILDER SCHEMA
--------------------------------------------- */
export const BuilderBaseSchema = z.object({
  id: z.string(),                 // "provident"
  name: z.string(),               // "Provident Housing"
  slug: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),

  title: z.string().optional(),
  subtitle: z.string().optional(),      
  tagline: z.string().optional(),      
  description: z.string().optional(),
  descriptionExpanded: z.string().optional(),

  /* -------- NEW: Builder Badges -------- */
  badges: z.array(z.string()).optional(),  

  /* -------- NEW: Stats -------- */
  stats: z.array(
    z.object({
      icon: z.string().optional(),
      label: z.string().optional(),
      value: z.string().optional(),
    })
  ).optional(), 

  /* -------- Brand Colors -------- */
  theme: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional(),
    })
    .optional(),

  /* -------- Typography -------- */
  typography: z
    .object({
      headingFont: z.string().optional(),
      bodyFont: z.string().optional(),
      weightBold: z.number().optional(),
      weightRegular: z.number().optional(),
    })
    .optional(),

  /* -------- Layout Config -------- */
  layout: z
    .object({
      headerStyle: z.enum(["compact", "full", "sticky"]).optional(),
      sectionOrder: z.array(SectionNames).optional(),
      containerWidth: z.enum(["1200px", "full", "1440px"]).optional(),
    })
    .optional(),

  /* -------- Feature Toggles -------- */
  features: z
    .object({
      enableUSP: z.boolean().default(true),
      enableAmenities: z.boolean().default(true),
      enableBrochure: z.boolean().default(true),
      enableConstructionStatus: z.boolean().default(true),
    })
    .optional(),

  /* -------- Component Overrides -------- */
  overrides: z.record(SectionNames, z.string()).optional(),
});

/* --------------------------------------------
   PROVIDENT EXTENSION
--------------------------------------------- */
export const ProvidentBuilderExtension = z.object({
  provident: z
    .object({
      tagline: z.string().optional(),
      tone: z.enum(["youthful", "premium", "affordable"]).optional(),
      townshipStyle: z.string().optional(),
      brandPillars: z.array(z.string()).optional(),
    })
    .optional(),
});

/* --------------------------------------------
   MERGED FINAL BUILDER SCHEMA
--------------------------------------------- */
export const BuilderSchema = BuilderBaseSchema.merge(
  ProvidentBuilderExtension
);

/* --------------------------------------------
   TYPES
--------------------------------------------- */
export type BuilderData = z.infer<typeof BuilderSchema>;
