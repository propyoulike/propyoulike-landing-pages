// src/lib/data/loadProject.ts
import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";

const projectFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true,
}) as Record<string, any>;

/* --------------------------------------------------------------
   Helper: safe fallback image generator (NO : allowed)
--------------------------------------------------------------- */
function fallbackImg(label: string) {
  const safe = encodeURIComponent(label.replace(/[:]/g, ""));
  return `https://via.placeholder.com/800x450?text=${safe}`;
}

/* --------------------------------------------------------------
   Collect metadata for ALL projects — used for widgets
--------------------------------------------------------------- */
type ProjectMeta = {
  slug: string;
  builder?: string;
  projectName?: string;
  locality?: string;
  city?: string;
  zone?: string;
  heroImage?: string | null;
  heroVideoId?: string | null;
};

const allProjectMetas: ProjectMeta[] = Object.entries(projectFiles)
  .filter(([path]) =>
    path.startsWith("/src/content/projects/") &&
    path.endsWith("/index.json")
  )
  .map(([_, mod]) => {
    const raw = mod.default ?? mod;

    const builder = raw.builder;
    const innerSlug = raw.slug;
    const fullSlug = builder && innerSlug ? `${builder}-${innerSlug}` : innerSlug || "";

    const heroImage =
      raw.hero?.images?.[0] ||
      raw.hero?.image ||
      null;

    return {
      slug: fullSlug,
      builder,
      projectName: raw.projectName,
      locality: raw.locationMeta?.locality ?? raw.locality,
      city: raw.locationMeta?.city ?? raw.city,
      zone: raw.locationMeta?.zone ?? raw.zone,
      heroImage,
      heroVideoId: raw.hero?.videoId ?? raw.hero?.videoUrl ?? null,
    };
  })
  .filter((p) => !!p.slug);

/* --------------------------------------------------------------
   MAIN LOADER
--------------------------------------------------------------- */
export async function loadProject(
  slug?: string
): Promise<
  ProjectData & {
    builderData?: any;
    builderProjects?: any[];
    localityProjects?: any[];
  } | null
> {
  if (!slug) return null;

  const parts = slug.split("-");
  const builder = parts[0];
  const projectSlug = parts.slice(1).join("-");
  const baseDir = `/src/content/projects/${builder}/${projectSlug}/`;

  const indexKey = `${baseDir}index.json`;
  const indexModule = projectFiles[indexKey];
  if (!indexModule) return null;

  const baseData = structuredClone(indexModule.default ?? indexModule);

  /* ------- AUTO MERGE extra JSON files -------- */
  if (baseData.files && typeof baseData.files === "object") {
    for (const key of Object.keys(baseData.files)) {
      const fileName = baseData.files[key];
      const attempts = [
        `${baseDir}${fileName}`,
        `${baseDir}${fileName.replace(/^\.\.\//, "")}`,
      ];

      for (const c of attempts) {
        if (projectFiles[c]) {
          const raw = projectFiles[c].default ?? projectFiles[c];

          if (typeof raw === "object" && raw !== null && Object.keys(raw).length === 1 && raw[key]) {
            baseData[key] = raw[key];
          } else {
            baseData[key] = raw;
          }
          break;
        }
      }
    }
  }

  /* ------- Optional builder overrides -------- */
  const builderOverrideKey = `/src/content/builders/${builder}.json`;
  const builderData = projectFiles[builderOverrideKey]?.default ?? null;

  /* ------- Validate schema -------- */
  const parsed = ProjectSchema.safeParse(baseData);
  if (!parsed.success) {
    console.error("❌ Project schema validation failed:", parsed.error);
    return null;
  }

  const project: ProjectData = parsed.data;

  /* ------------------------------------------------------
     Build = "Other projects by this builder"
  -------------------------------------------------------- */
  const builderProjects =
    allProjectMetas
      .filter((p) => p.builder === project.builder && p.slug !== slug)
      .map((p) => ({
        name: p.projectName ?? p.slug,
        slug: p.slug,
        locality: p.locality,
        city: p.city,
        zone: p.zone,
        thumb: p.heroImage || fallbackImg(p.projectName ?? p.slug),
      }));

  /* ------------------------------------------------------
     Build = “Locality Nearby Recommendations”
  -------------------------------------------------------- */
  let localityProjects: any[] = [];
  const currentMeta = allProjectMetas.find((p) => p.slug === slug);

  if (currentMeta?.city && (currentMeta.locality || currentMeta.zone)) {
    localityProjects =
      allProjectMetas
        .filter((p) => p.slug !== slug)
        .filter((p) => p.city === currentMeta.city)
        .map((p) => {
          let score = 0;
          if (p.locality && currentMeta.locality && p.locality === currentMeta.locality) score += 3;
          if (p.zone && currentMeta.zone && p.zone === currentMeta.zone) score += 2;
          if (p.city === currentMeta.city) score += 1;

          return { meta: p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ meta }) => ({
          name: meta.projectName ?? meta.slug,
          slug: meta.slug,
          locality: meta.locality,
          city: meta.city,
          zone: meta.zone,
          thumb: meta.heroImage || fallbackImg(meta.projectName ?? meta.slug),
        }));
  }

  return {
    ...project,
    builderData: builderData ?? undefined,
    builderProjects,
    localityProjects,
  };
}
