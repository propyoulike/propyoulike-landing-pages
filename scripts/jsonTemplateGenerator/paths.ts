import * as path from "path";
import { fileURLToPath } from "url";

/* -------------------------------------------------
   Resolve repo root safely (Node ESM)
------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * scripts/jsonTemplateGenerator/paths.ts
 * → repo root
 */
export const ROOT = path.resolve(__dirname, "../../");

/* -------------------------------------------------
   Runtime schema (read-only)
------------------------------------------------- */
export const PROJECT_SCHEMA_PATH = path.join(
  ROOT,
  "src/content/schema/project.schema.ts"
);

/* -------------------------------------------------
   Authoring artifacts
------------------------------------------------- */
export const CONTENT_DIR = path.join(ROOT, "content");

export const AUTHORING_SCHEMA_PATH = path.join(
  CONTENT_DIR,
  "authoring.schema.json"
);

export const TEMPLATE_DIR = path.join(CONTENT_DIR, "templates");

export const PROJECT_TEMPLATE_PATH = path.join(
  TEMPLATE_DIR,
  "project.template.json"
);
