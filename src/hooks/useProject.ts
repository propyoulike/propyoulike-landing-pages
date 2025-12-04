// src/hooks/useProject.ts
import { useMemo } from "react";
import { ProjectSchema, ProjectData } from "@/content/schema/project.schema";

// All project JSON imports (auto-added here)
import sunworthCity from "@/content/projects/sunworth-city.json";

/**
 * Registry of all project JSON files
 * You will add new projects here:
 *  slug: jsonData
 */
const PROJECT_REGISTRY: Record<string, any> = {
  "sunworth-city": sunworthCity
};

/**
 * Loads + validates + merges project data
 */
export default function useProject(slug: string): ProjectData {
  return useMemo(() => {
    // 1. Check if project JSON exists
    const jsonData = PROJECT_REGISTRY[slug];
    if (!jsonData) {
      throw new Error(
        `❌ Project JSON not found for slug "${slug}". 
Make sure the file exists under /content/projects and is added to PROJECT_REGISTRY.`
      );
    }

    // 2. Validate using Zod schema
    const parsed = ProjectSchema.safeParse(jsonData);

    if (!parsed.success) {
      console.error("❌ Project JSON validation failed:", parsed.error.format());
      throw new Error(
        `Invalid project JSON structure for slug "${slug}". Check console for details.`
      );
    }

    const project = parsed.data;

    // 3. Auto-merge builder overrides (Provident + future)
    const merged: ProjectData = {
      ...project,
      ...(project.provident ? { builderTheme: "provident" } : {})
    };

    return merged;
  }, [slug]);
}
