// src/lib/data/loadBuilder.ts

import { BuilderSchema } from "@/content/schema/builder.schema";
import type { BuilderData } from "@/content/schema/builder.schema";

/* ---------------------------------------------------------------------------
   PRELOAD ALL BUILDER "aboutbuilder.json" FILES
   ---------------------------------------------------------------------------
   Vite's import.meta.glob eagerly loads all JSON files matching:

       /src/content/projects/<builder>/aboutbuilder.json

   Example file paths:
       /src/content/projects/provident/aboutbuilder.json
       /src/content/projects/brigade/aboutbuilder.json

   These files contain builder-specific information such as:
   - About builder
   - Statistics
   - Optional theme/branding elements
--------------------------------------------------------------------------- */
const builderModules = import.meta.glob(
  "/src/content/projects/*/aboutbuilder.json",
  { eager: true }
);

/* ---------------------------------------------------------------------------
   loadBuilder(builderId)
   ---------------------------------------------------------------------------
   Loads and validates a builder's JSON file using the BuilderSchema.
   Returns:
     → BuilderData (parsed + validated)
     → null if file missing OR schema invalid

   This ensures:
     - No runtime crashes from malformed JSON
     - Consistent structure across all builders
--------------------------------------------------------------------------- */
export function loadBuilder(builderId: string): BuilderData | null {
  try {
    // Expected absolute path (must match glob format)
    const expectedPath = `/src/content/projects/${builderId}/aboutbuilder.json`;

    // Lookup module loaded by import.meta.glob
    const rawModule = builderModules[expectedPath];

    if (!rawModule) {
      console.warn("❌ Builder about file not found:", expectedPath);
      console.log("Available builder files:", Object.keys(builderModules));
      return null;
    }

    // Extract default export (Vite JSON import format)
    const raw = (rawModule as any).default ?? rawModule;

    // Validate JSON structure using Zod schema
    const parsed = BuilderSchema.safeParse(raw);

    if (!parsed.success) {
      console.warn("❌ Builder schema validation failed:", parsed.error);
      return null;
    }

    // Valid builder data returned
    return parsed.data;

  } catch (err) {
    console.error("❌ Unexpected error in loadBuilder:", err);
    return null;
  }
}
