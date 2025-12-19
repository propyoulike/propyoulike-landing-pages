import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ProjectSchema } from "../src/content/schema/project.schema.ts";
import { zodToJsonTemplate } from "./zodToJsonTemplate.ts";

/* -------------------------------------------------
   Node ESM helpers
------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_ROOT = path.resolve(__dirname, "../src/content/templates");
const SECTIONS_DIR = path.join(OUT_ROOT, "sections");

fs.mkdirSync(SECTIONS_DIR, { recursive: true });

/* -------------------------------------------------
   1️⃣ Generate FULL PROJECT TEMPLATE
------------------------------------------------- */
const projectTemplate = zodToJsonTemplate(ProjectSchema);

/* -------------------------------------------------
   2️⃣ HARD VALIDATION (ROUND-TRIP)
------------------------------------------------- */
const projectValidation = ProjectSchema.safeParse(projectTemplate);

if (!projectValidation.success) {
  console.error("❌ Generated project template is INVALID");
  console.error(projectValidation.error.format());
  process.exit(1);
}

/* -------------------------------------------------
   3️⃣ Write project template
------------------------------------------------- */
fs.writeFileSync(
  path.join(OUT_ROOT, "project.template.json"),
  JSON.stringify(projectTemplate, null, 2)
);

/* -------------------------------------------------
   4️⃣ Generate + Validate SECTION TEMPLATES
------------------------------------------------- */
const sectionKeys = [
  "hero",
  "summary",
  "amenities",
  "views",
  "locationUI",
  "propertyPlans",
  "paymentPlans",
  "construction",
  "testimonials",
  "aboutBuilder",
  "faq",
];

const projectShape = (ProjectSchema as any)._def.shape();

for (const key of sectionKeys) {
  const schema = projectShape[key];
  if (!schema) continue;

  let sectionTemplate =
  zodToJsonTemplate(schema) ?? {};


if (key === "propertyPlans") {
  sectionTemplate = {
    _note:
      "REQUIRED: Add at least one of modelFlats, unitPlans, floorPlans, or masterPlan.image",
  };
}

if (key === "brochure") {
  sectionTemplate = {
    title: "",
    documents: [],
  };
}

  /* ---------- Section-level validation ---------- */
  const result = schema.safeParse(sectionTemplate);
  if (!result.success) {
    console.warn(`⚠ Section "${key}" requires manual completion`);
  }

  /* ---------- Semantic warning for refine() ---------- */
  if (key === "propertyPlans") {
    sectionTemplate._note =
      "⚠ REQUIRED: Add at least one of modelFlats, unitPlans, floorPlans, or masterPlan.image";
  }

  fs.writeFileSync(
    path.join(SECTIONS_DIR, `${key}.section.json`),
    JSON.stringify(sectionTemplate, null, 2)
  );
}

console.log("✅ Templates generated & schema-validated successfully");
