import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ProjectSchema } from "../src/content/schema/project.schema.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.resolve(
  __dirname,
  "../src/content/templates/project.template.json"
);

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error("❌ project.template.json not found");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf-8"));

const result = ProjectSchema.safeParse(raw);

if (!result.success) {
  console.error("❌ Template validation FAILED");
  console.error(result.error.format());
  process.exit(1);
}

console.log("✅ project.template.json is VALID");
