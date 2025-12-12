// src/lib/data/loadBuilder.ts
import { BuilderSchema } from "@/content/schema/builder.schema";
import type { BuilderData } from "@/content/schema/builder.schema";

/* -----------------------------------------------
   PRELOAD ALL BUILDER FILES
------------------------------------------------ */
const builderModules = import.meta.glob(
  "/src/content/projects/*/aboutbuilder.json",
  { eager: true }
);

/* -----------------------------------------------
   loadBuilder(builderId)
   Loads /src/content/projects/<builderId>/aboutbuilder.json
------------------------------------------------ */
export function loadBuilder(builderId: string): BuilderData | null {

  try {
    const expectedPath = `/src/content/projects/${builderId}/aboutbuilder.json`;

    const rawModule = builderModules[expectedPath];

    if (!rawModule) {
      console.warn("❌ No builder JSON found at:", expectedPath);
      return null;
    }


    // Vite JSON import default handling
    const raw = (rawModule as any).default ?? rawModule;

    // Validate JSON structure
    const parsed = BuilderSchema.safeParse(raw);

    if (!parsed.success) {
      console.warn("❌ Builder schema validation FAILED:");
      console.warn(parsed.error.format());

      console.log("⚠ Raw JSON that failed validation:", raw);
      return null;
    }

    return parsed.data;

  } catch (err) {
    console.error("❌ Unexpected error in loadBuilder:", err);
    return null;
  }
}
