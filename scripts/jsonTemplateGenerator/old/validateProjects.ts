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
const PROJECTS_ROOT = path.resolve(
  __dirname,
  "../src/content/projects"
);

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function loadJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/* -------------------------------------------------
   Validation
------------------------------------------------- */
let hasErrors = false;

const builders = fs.readdirSync(PROJECTS_ROOT);

for (const builder of builders) {
  const builderDir = path.join(PROJECTS_ROOT, builder);
  if (!fs.statSync(builderDir).isDirectory()) continue;

  const projects = fs.readdirSync(builderDir);

  for (const projectSlug of projects) {
    const projectDir = path.join(builderDir, projectSlug);
    if (!fs.statSync(projectDir).isDirectory()) continue;

    /* -----------------------------------------
       Assemble project object
    ----------------------------------------- */
    const project: any = {
      slug: projectSlug,
      builder,
    };

    const files = fs.readdirSync(projectDir).filter(f =>
      f.endsWith(".json")
    );

    for (const file of files) {
      const fullPath = path.join(projectDir, file);

      // ✅ index.json = project-level metadata
      if (file === "index.json") {
        Object.assign(project, loadJSON(fullPath));
        continue;
      }

      // ✅ section files
      const key = file.replace(".json", "");
      project[key] = loadJSON(fullPath);
    }

    /* -----------------------------------------
       Validate against schema
    ----------------------------------------- */
    const result = ProjectSchema.safeParse(project);

    if (!result.success) {
      hasErrors = true;
      console.error(`\n❌ INVALID PROJECT: ${builder}/${projectSlug}`);
      console.error(result.error.format());
    } else {
      console.log(`✅ ${builder}/${projectSlug}`);
    }
  }
}

if (hasErrors) {
  console.error("\n❌ Project validation FAILED");
  process.exit(1);
}

console.log("\n🎉 All projects are VALID");
