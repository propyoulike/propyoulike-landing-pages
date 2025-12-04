// src/lib/data/loadProject.ts
import { ProjectSchema } from "@/content/schema/project.schema";
import type { ProjectData } from "@/content/schema/project.schema";
import { loadBuilder } from "./loadBuilder";

const projectFiles = import.meta.glob("/src/content/projects/**/*.json", {
  eager: true,
});

/**
 * Create all possible resolution paths for a given file
 */
function resolveCandidates(baseDir: string, fileName: string, builder: string, projectSlug: string) {
  const projectDir = `/src/content/projects/${builder}/${projectSlug}/`;
  const builderDir = `/src/content/projects/${builder}/`;

  const clean = fileName.replace(/^\.\/+/, ""); // remove ./ prefix

  const candidates = [];

  // 1. Project-level direct file
  candidates.push(`${projectDir}${clean}`);

  // 2. If "../" used → go to builder folder
  if (fileName.startsWith("../")) {
    candidates.push(`${builderDir}${fileName.replace("../", "")}`);
  }

  // 3. Allow explicit builder-level reference: "/builder/aboutbuilder.json"
  if (fileName.startsWith("/")) {
    candidates.push(`/src/content/projects${fileName}`);
  }

  // 4. Try absolute-clean
  candidates.push(`${projectDir}${clean}`.toLowerCase()); 

  return Array.from(new Set(candidates)); // unique
}

export async function loadProject(slug?: string): Promise<ProjectData | null> {
  if (!slug) return null;

  try {
    const [builder, ...rest] = slug.split("-");
    const projectSlug = rest.join("-");

    const projectDir = `/src/content/projects/${builder}/${projectSlug}/`;
    const indexPath = `${projectDir}index.json`;

    let baseData: any = null;

    // -----------------------------
    // 1. LOAD PROJECT INDEX.JSON
    // -----------------------------
    const indexModule = projectFiles[indexPath];
    if (!indexModule) {
      console.error("❌ Project index.json not found:", indexPath);
      return null;
    }

    baseData = (indexModule as any).default;

    // -----------------------------
    // 2. LOAD SUBFILES DECLARED IN index.json
    // -----------------------------
    if (baseData.files) {
      for (const key in baseData.files) {
        const fileName = baseData.files[key];
        const candidates = resolveCandidates(projectDir, fileName, builder, projectSlug);

        let match: any = null;

        for (const path of candidates) {
          if (projectFiles[path]) {
            match = projectFiles[path];
            break;
          }
        }

        if (!match) {
          console.warn(`⚠ Missing subfile for "${key}" → Tried:`, candidates);
          continue; // important: do NOT break project if optional file missing
        }

        baseData[key] = match.default;
      }
    }

    // -----------------------------
    // 3. VALIDATE AGAINST SCHEMA
    // -----------------------------
    const validated = ProjectSchema.safeParse(baseData);

    if (!validated.success) {
      console.error("❌ Project schema failed:", validated.error);
      return null;
    }

    const project = validated.data;

    // -----------------------------
    // 4. LOAD BUILDER DATA
    // -----------------------------
    const builderData = await loadBuilder(builder);

    return {
      ...project,
      builderData,
    };
  } catch (err) {
    console.error("❌ Unexpected error:", slug, err);
    return null;
  }
}
