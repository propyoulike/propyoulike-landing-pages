// scripts/jsonTemplateGenerator/validateTemplates.ts

import fs from "fs";
import path from "path";
import { ProjectSchema } from "../../../src/content/schema/project.schema";
import authoringSchema from "@/content/authoring.schema.json";
import { TEMPLATE_DIR } from "./paths";

/* -------------------------------------------------
   Types
------------------------------------------------- */
type Issue = {
  section: string;
  path: string;
  severity: "error" | "warning";
  rule: string;
  message: string;
};

const issues: Issue[] = [];

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function isScalar(value: any) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function hasLeafFields(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;

  return Object.values(obj).some(v => {
    if (isScalar(v)) return true;
    if (Array.isArray(v)) return true;
    if (typeof v === "object") return hasLeafFields(v);
    return false;
  });
}

/* -------------------------------------------------
   Load section templates
------------------------------------------------- */
const SECTIONS_DIR = path.join(TEMPLATE_DIR, "sections");

const files = fs
  .readdirSync(SECTIONS_DIR)
  .filter(f => f.endsWith(".json") && f !== "index.json");

if (files.length === 0) {
  throw new Error("❌ No section templates found");
}

/* -------------------------------------------------
   Validate each section template
------------------------------------------------- */
for (const file of files) {
  const section = file.replace(".json", "");
  const template = JSON.parse(
    fs.readFileSync(path.join(SECTIONS_DIR, file), "utf-8")
  );

  /* ---------- ZOD PARITY ---------- */
  const candidate = {
    slug: "template-slug",
    projectName: "Template",
    builder: "template",
    city: "template",
    [section]: template,
  };

  const result = ProjectSchema.safeParse(candidate);

  if (!result.success) {
    const blocking = result.error.issues.filter(
      i => i.code !== "custom" && i.code !== "too_small"
    );

    for (const issue of blocking) {
      issues.push({
        section,
        path: issue.path.join("."),
        severity: "error",
        rule: issue.code,
        message: issue.message,
      });
    }
  }

  /* ---------- OBJECT FLATTENABILITY ---------- */
  if (!hasLeafFields(template)) {
    issues.push({
      section,
      path: section,
      severity: "error",
      rule: "emptyObject",
      message:
        "Section object has no leaf fields; cannot generate sheet columns",
    });
  }

  /* ---------- ARRAY VALIDATION ---------- */
  for (const key in template) {
    if (!Array.isArray(template[key])) continue;

    const schemaField = authoringSchema[section]?.fields?.[key];

    if (!schemaField) {
      issues.push({
        section,
        path: `${section}.${key}`,
        severity: "error",
        rule: "missingSchema",
        message:
          "Array exists in template but not defined in authoring schema",
      });
      continue;
    }

    if (
      schemaField.type === "array" &&
      (!schemaField.items ||
        schemaField.items.type !== "object" ||
        !schemaField.items.fields)
    ) {
      issues.push({
        section,
        path: `${section}.${key}`,
        severity: "error",
        rule: "arrayItemsUndefined",
        message:
          "Array has no defined item fields; cannot generate sheet columns",
      });
    }
  }

  /* ---------- REQUIRED FOR AUTHORING ---------- */
  if (
    authoringSchema[section]?.requiredForAuthoring &&
    Object.keys(template).length === 0
  ) {
    issues.push({
      section,
      path: section,
      severity: "error",
      rule: "requiredForAuthoring",
      message: "Section is required but has no authorable fields",
    });
  }
}

/* -------------------------------------------------
   OUTPUT RESULTS
------------------------------------------------- */
if (issues.length > 0) {
  console.error("\n❌ TEMPLATE VALIDATION FAILED\n");

  console.table(
    issues.map(i => ({
      section: i.section,
      path: i.path,
      severity: i.severity,
      rule: i.rule,
      message: i.message,
    }))
  );

  /* ---------- CSV EXPORT ---------- */
  const csv = [
    "section,path,severity,rule,message",
    ...issues.map(
      i =>
        `"${i.section}","${i.path}","${i.severity}","${i.rule}","${i.message}"`
    ),
  ].join("\n");

  fs.writeFileSync(
    path.join(TEMPLATE_DIR, "template-validation.csv"),
    csv,
    "utf-8"
  );

  process.exit(1);
}

console.log("✅ Templates are valid and sheet-producible");
