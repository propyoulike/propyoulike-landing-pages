import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";

const projectFiles = import.meta.glob("/src/content/**/*.json", { eager: true }) as Record<string, any>;

function candidatePaths(baseDir: string, fileName: string) {
  const out: string[] = [];
  out.push(`${baseDir}${fileName}`);

  if (fileName.startsWith("../")) {
    out.push(`${baseDir}${fileName.replace(/^\.\.\//, "")}`);
    const parent = baseDir.replace(/\/[^\/]+\/$/, "/");
    out.push(`${parent}${fileName.replace(/^\.\.\//, "")}`);
  }
  return Array.from(new Set(out));
}

export async function loadProject(slug?: string | null): Promise<ProjectData & { builderData?: any } | null> {
  if (!slug) return null;

  const parts = slug.split("-");
  const builder = parts[0];
  const projectSlug = parts.slice(1).join("-");
  const baseDir = `/src/content/projects/${builder}/${projectSlug}/`;

  const indexKey = `${baseDir}index.json`;
  const indexModule = projectFiles[indexKey];

  if (!indexModule) return null;

  const baseData = structuredClone(indexModule.default ?? indexModule);

  // ----------------------------
  //  FILE MERGING + AUTO FIXING
  // ----------------------------
  if (baseData.files && typeof baseData.files === "object") {
    for (const key of Object.keys(baseData.files)) {
      const fileName = baseData.files[key];
      const candidates = candidatePaths(baseDir, fileName);

      for (const c of candidates) {
        if (projectFiles[c]) {
          const raw = projectFiles[c].default ?? projectFiles[c];

          // AUTO-UNWRAP if JSON wraps itself:
          //
          // { floorPlansSection: { ... } }
          //
          if (typeof raw === "object" && raw !== null && Object.keys(raw).length === 1 && raw[key]) {
            baseData[key] = raw[key];   // unwrap
          } else {
            baseData[key] = raw;        // normal JSON
          }
          break;
        }
      }
    }
  }

  // Optional builder overrides
  const builderOverrideKey = `/src/content/builders/${builder}.json`;
  const builderData = projectFiles[builderOverrideKey]?.default ?? null;

  // Validate schema
  const parsed = ProjectSchema.safeParse(baseData);
  if (!parsed.success) {
    console.error("❌ Project schema validation failed:", parsed.error);
    return null;
  }

  return {
    ...parsed.data,
    builderData: builderData ?? undefined
  };
}
