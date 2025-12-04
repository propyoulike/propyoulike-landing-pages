// src/lib/data/loadBuilder.ts
import { BuilderSchema } from "@/content/schema/builder.schema";
import type { BuilderData } from "@/content/schema/builder.schema";

/**
 * Load all builder "aboutbuilder.json" files eagerly at build time.
 *
 * Files must exist at paths like:
 *    /src/content/projects/<builder>/aboutbuilder.json
 *
 * Example:
 *    /src/content/projects/provident/aboutbuilder.json
 */
const builderModules = import.meta.glob(
  "/src/content/projects/*/aboutbuilder.json",
  { eager: true }
);

export function loadBuilder(builderId: string): BuilderData | null {
  try {
    const expectedPath = `/src/content/projects/${builderId}/aboutbuilder.json`;

    const rawModule = builderModules[expectedPath];

    if (!rawModule) {
      console.warn("❌ Builder about file not found:", expectedPath);
      console.log("Available builder files:", Object.keys(builderModules));
      return null;
    }

    const raw = (rawModule as any).default ?? rawModule;

    // Validate JSON using Zod
    const parsed = BuilderSchema.safeParse(raw);

    if (!parsed.success) {
      console.warn("❌ Builder schema validation failed:", parsed.error);
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error("❌ Unexpected error in loadBuilder:", err);
    return null;
  }
}
