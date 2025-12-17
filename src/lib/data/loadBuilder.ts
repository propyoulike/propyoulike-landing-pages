// src/lib/data/loadBuilder.ts

import { BuilderSchema } from "@/content/schema/builder.schema";
import type { BuilderData } from "@/content/schema/builder.schema";

/* -----------------------------------------------
   PRELOAD ALL BUILDER FILES (EAGER)
------------------------------------------------ */
const builderModules = import.meta.glob(
  "/src/content/projects/*/aboutbuilder.json",
  { eager: true }
);

/* -----------------------------------------------
   In-memory cache (static content)
------------------------------------------------ */
const cache = new Map<string, BuilderData | null>();

/* -----------------------------------------------
   loadBuilder(builderId)
------------------------------------------------ */
export function loadBuilder(builderId: string): BuilderData | null {
  if (!builderId) return null;

  // ✅ Cache hit
  if (cache.has(builderId)) {
    return cache.get(builderId)!;
  }

  try {
    const path = `/src/content/projects/${builderId}/aboutbuilder.json`;
    const rawModule = builderModules[path];

    if (!rawModule) {
      if (import.meta.env.DEV) {
        console.warn("⚠️ Builder JSON not found:", path);
      }
      cache.set(builderId, null);
      return null;
    }

    // Vite JSON default handling
    const raw = (rawModule as any).default ?? rawModule;

    // Schema validation
    const parsed = BuilderSchema.safeParse(raw);

    if (!parsed.success) {
      if (import.meta.env.DEV) {
        console.warn("❌ Builder schema validation failed:", builderId);
        console.warn(parsed.error.format());
        console.log("⚠ Raw builder JSON:", raw);
      }
      cache.set(builderId, null);
      return null;
    }

    cache.set(builderId, parsed.data);
    return parsed.data;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("❌ Unexpected error in loadBuilder:", err);
    }
    cache.set(builderId, null);
    return null;
  }
}
