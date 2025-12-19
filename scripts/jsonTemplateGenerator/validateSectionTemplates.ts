import fs from "fs";
import path from "path";
import { ProjectSchema } from "@/content/schema/project.schema";

/* -------------------------------------------------
   Paths
------------------------------------------------- */
const SECTIONS_DIR = path.resolve(
  process.cwd(),
  "content/templates/sections"
);

/* -------------------------------------------------
   Minimal required project base
------------------------------------------------- */
const BASE_PROJECT = {
  slug: "test-project",
  projectName: "Test Project",
  builder: "test-builder",
  city: "test-city",
  hero: {},
};

/* -------------------------------------------------
   Load section templates
------------------------------------------------- */
const files = fs
  .readdirSync(SECTIONS_DIR)
  .filter(
    f => f.endsWith(".json") && f !== "index.json"
  );

if (files.length === 0) {
  throw new Error("❌ No section templates found to validate.");
}

let hasErrors = false;

/* -------------------------------------------------
   Validate each section independently
------------------------------------------------- */
for (const file of files) {
  const sectionName = file.replace(".json", "");
  const filePath = path.join(SECTIONS_DIR, file);

  const sectionData = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
  );

  const projectCandidate = {
    ...BASE_PROJECT,
    [sectionName]: sectionData,
  };

const result = ProjectSchema.safeParse(projectCandidate);

if (!result.success) {
  // Ignore refine/custom errors during TEMPLATE validation
  const blockingIssues = result.error.issues.filter(
    issue =>
      issue.code !== "custom" &&      // ignore .refine()
      issue.code !== "too_small"      // ignore .min() for empty templates
  );

  if (blockingIssues.length > 0) {
    hasErrors = true;

    console.error(`\n❌ INVALID SECTION TEMPLATE: ${sectionName}`);
    console.error(
      JSON.stringify(blockingIssues, null, 2)
    );
  } else {
    console.log(`⚠️ ${sectionName} has publish-time constraints (allowed in templates)`);
  }
} else {
  console.log(`✅ ${sectionName} template is valid`);
}
}

/* -------------------------------------------------
   Final result
------------------------------------------------- */
if (hasErrors) {
  console.error("\n❌ Section template validation FAILED");
  process.exit(1);
}

console.log("\n✅ All section templates are valid");
