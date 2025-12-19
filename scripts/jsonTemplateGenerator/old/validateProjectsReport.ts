import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ProjectSchema } from "../src/content/schema/project.schema.ts";

/* -------------------------------------------------
   Node helpers
------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   CONFIG
------------------------------------------------- */
const PROJECTS_ROOT = path.resolve(__dirname, "../src/content/projects");
const CSV_OUT = path.resolve(__dirname, "../validation-report.csv");

/* -------------------------------------------------
   Types
------------------------------------------------- */
type Cell = string;
type Row = Record<string, Cell>;

/* -------------------------------------------------
   Sections to track (columns)
------------------------------------------------- */
const SECTION_KEYS = [
  "index",
  "hero",
  "summary",
  "amenities",
  "views",
  "locationUI",
  "propertyPlans",
  "construction",
  "testimonials",
  "faq",
];

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function loadJSON(p: string) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function classifyIssue(message: string) {
  // Heuristic: refine/min/required are errors; others are warnings
  if (
    message.includes("Required") ||
    message.includes("Expected") ||
    message.includes("must")
  ) {
    return `ERROR: ${message}`;
  }
  return `WARN: ${message}`;
}

/* -------------------------------------------------
   Main
------------------------------------------------- */
const rows: Record<string, Row> = {};
const csvRows: string[] = [];

const header = ["project", ...SECTION_KEYS];
csvRows.push(header.join(","));

const builders = fs.readdirSync(PROJECTS_ROOT);

for (const builder of builders) {
  const builderDir = path.join(PROJECTS_ROOT, builder);
  if (!fs.statSync(builderDir).isDirectory()) continue;

  const projects = fs.readdirSync(builderDir);

  for (const slug of projects) {
    const projectDir = path.join(builderDir, slug);
    if (!fs.statSync(projectDir).isDirectory()) continue;

    const row: Row = {};
    SECTION_KEYS.forEach(k => (row[k] = "—"));

    const project: any = { slug, builder };

    const files = fs.readdirSync(projectDir).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const fullPath = path.join(projectDir, file);

      if (file === "index.json") {
        Object.assign(project, loadJSON(fullPath));
        row.index = "OK";
      } else {
        const key = file.replace(".json", "");
        project[key] = loadJSON(fullPath);
        if (row[key] === "—") row[key] = "OK";
      }
    }

    const result = ProjectSchema.safeParse(project);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const section = (issue.path[0] as string) || "index";
        const msg = classifyIssue(issue.message);

        if (row[section] === "OK" || row[section] === "—") {
          row[section] = msg;
        }
      }
    }

    const projectKey = `${builder}/${slug}`;
    rows[projectKey] = row;

    csvRows.push(
      [
        projectKey,
        ...SECTION_KEYS.map(k =>
          `"${(row[k] || "").replace(/"/g, '""')}"`
        ),
      ].join(",")
    );
  }
}

/* -------------------------------------------------
   Output
------------------------------------------------- */
console.table(rows);
fs.writeFileSync(CSV_OUT, csvRows.join("\n"), "utf-8");

console.log(`\n📄 CSV report written to: ${CSV_OUT}`);
