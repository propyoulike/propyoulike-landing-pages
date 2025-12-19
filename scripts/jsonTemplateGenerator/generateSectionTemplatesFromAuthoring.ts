import fs from "fs";
import path from "path";
import {
  AUTHORING_SCHEMA_PATH,
  TEMPLATE_DIR,
} from "./paths";

/* -------------------------------------------------
   Load authoring schema
------------------------------------------------- */
const authoringSchema = JSON.parse(
  fs.readFileSync(AUTHORING_SCHEMA_PATH, "utf-8")
);

/* -------------------------------------------------
   Prepare output directory
------------------------------------------------- */
const SECTIONS_DIR = path.join(TEMPLATE_DIR, "sections");
fs.mkdirSync(SECTIONS_DIR, { recursive: true });

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function generateValue(field: any): any {
  switch (field.type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "enum":
      return field.enumValues?.[0] ?? "";
    case "array":
      return [];
    case "object": {
      const obj: any = {};
      if (field.fields) {
        for (const key in field.fields) {
          obj[key] = generateValue(field.fields[key]);
        }
      }
      if (field.note) obj._note = field.note;
      return obj;
    }
    default:
      return undefined;
  }
}

/* -------------------------------------------------
   Index section (project identity + section manifest)
------------------------------------------------- */
const INDEX_KEYS = [
  "slug",
  "projectName",
  "builder",
  "city",
  "zone",
  "area",
  "locality",
  "state",
  "country",
  "status",
  "type",
];

const indexTemplate: any = {};
const sectionsManifest: Record<string, string> = {};

/* Populate project identity fields */
for (const key of INDEX_KEYS) {
  if (!authoringSchema[key]) continue;
  indexTemplate[key] = generateValue(authoringSchema[key]);
}

/* Build section manifest */
for (const key in authoringSchema) {
  if (INDEX_KEYS.includes(key)) continue;

  const field = authoringSchema[key];
  if (!field.visible) continue;

  sectionsManifest[key] = `${key}.json`;
}

indexTemplate.sections = sectionsManifest;

/* Write index.json */
fs.writeFileSync(
  path.join(SECTIONS_DIR, "index.json"),
  JSON.stringify(indexTemplate, null, 2),
  "utf-8"
);

/* -------------------------------------------------
   Write individual section templates
------------------------------------------------- */
for (const key in authoringSchema) {
  if (INDEX_KEYS.includes(key)) continue;

  const field = authoringSchema[key];
  if (!field.visible) continue;

  const sectionTemplate = generateValue(field);

  fs.writeFileSync(
    path.join(SECTIONS_DIR, `${key}.json`),
    JSON.stringify(sectionTemplate, null, 2),
    "utf-8"
  );
}

/* -------------------------------------------------
   Done
------------------------------------------------- */
console.log("✅ Per-section templates generated in:", SECTIONS_DIR);
