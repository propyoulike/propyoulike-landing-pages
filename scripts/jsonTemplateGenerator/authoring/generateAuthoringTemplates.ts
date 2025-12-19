import fs from "fs";
import path from "path";
import authoringSchema from "../../content/authoring.schema.json" assert { type: "json" };
import { TEMPLATE_DIR } from "./paths";

/* -------------------------------------------------
   Output directory
------------------------------------------------- */
const OUT_DIR = path.join(TEMPLATE_DIR, "authoring");
fs.mkdirSync(OUT_DIR, { recursive: true });

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function walkFields(
  fields: any,
  prefix: string,
  out: { key: string; path: string; note?: string }[]
) {
  for (const key in fields) {
    const field = fields[key];
    if (!field.visible) continue;

    if (field.type === "array") continue;

    if (field.type === "object" && field.fields) {
      walkFields(field.fields, `${prefix}${key}.`, out);
    } else {
      out.push({
        key: `${prefix}${key}`,
        path: `${prefix}${key}`,
        note: field.note,
      });
    }
  }
}

/* -------------------------------------------------
   Generate templates
------------------------------------------------- */
for (const section in authoringSchema) {
  const sectionDef = authoringSchema[section];
  if (!sectionDef.visible) continue;
  if (sectionDef.type !== "object") continue;

  const template: any = {
    section,
    main: {
      sheet: section.toUpperCase(),
      columns: [],
    },
    arrays: [],
  };

  /* ---------- MAIN SHEET ---------- */
  template.main.columns.push({
    key: "slug",
    path: "slug",
    required: true,
  });

  walkFields(sectionDef.fields, `${section}.`, template.main.columns);

  /* ---------- ARRAY SHEETS ---------- */
  for (const key in sectionDef.fields) {
    const field = sectionDef.fields[key];
    if (field.type !== "array") continue;

    const items = field.items;
    if (!items || items.type !== "object" || !items.fields) {
      // already validated earlier
      continue;
    }

    const arraySheet = {
      sheet: `${section}_${key}`.toUpperCase(),
      path: `${section}.${key}`,
      columns: [
        { key: "slug", path: "slug", required: true },
        { key: "sort", path: "_sort", required: true },
      ],
    };

    for (const itemKey in items.fields) {
      const itemField = items.fields[itemKey];
      arraySheet.columns.push({
        key: itemKey,
        path: itemKey,
        required: itemField.requiredForAuthoring,
        note: itemField.note,
      });
    }

    template.arrays.push(arraySheet);
  }

  /* ---------- WRITE FILE ---------- */
  fs.writeFileSync(
    path.join(OUT_DIR, `${section}.authoring.template.json`),
    JSON.stringify(template, null, 2),
    "utf-8"
  );
}

/* -------------------------------------------------
   Done
------------------------------------------------- */
console.log("✅ Authoring templates generated");
