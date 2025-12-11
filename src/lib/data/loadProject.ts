// src/lib/data/loadProject.ts
import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";

const projectFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true,
}) as Record<string, any>;

/* --------------------------------------------------------------
   Helper: safe fallback image generator
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
    path.startsWith("/src/content/projects/") && path.endsWith("/index.json")
  )
  .map(([path, mod]) => {
    const raw = mod.default ?? mod;

    const builder = raw.builder;
    const innerSlug = raw.slug;
    const fullSlug =
      builder && innerSlug ? `${builder}-${innerSlug}` : innerSlug || "";

    /* ------------------------------------------------------
       Load hero.json (multiple filename support)
    --------------------------------------------------------- */
    const baseDir = path.replace("index.json", "");

    const possibleHeroFiles = [
      baseDir + "hero.json",
      baseDir + "Hero.json",
      baseDir + "hero/index.json",
      baseDir + "Hero/index.json",
    ];

    let hero: any = null;

    for (const candidate of possibleHeroFiles) {
      if (projectFiles[candidate]) {
        hero = projectFiles[candidate].default ?? projectFiles[candidate];
        break;
      }
    }

    /* ------------------------------------------------------
       Normalize heroImage to string
    --------------------------------------------------------- */
    let heroImage: string | null = null;

    if (Array.isArray(hero?.images)) {
      const first = hero.images[0];
      if (typeof first === "string") heroImage = first;
      else if (first?.url) heroImage = first.url;
    }

    if (!heroImage && typeof hero?.image === "string") {
      heroImage = hero.image;
    }

    const heroVideoId = hero?.videoId ?? hero?.videoUrl ?? null;

    return {
      slug: fullSlug,
      builder,
      projectName: raw.projectName,
      locality: raw.locationMeta?.locality ?? raw.locality,
      city: raw.locationMeta?.city ?? raw.city,
      zone: raw.locationMeta?.zone ?? raw.zone,
      heroImage,
      heroVideoId,
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

  /* ------------------------------------------------------
     AUTO MERGE extra JSON
  --------------------------------------------------------- */
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

  /* ------------------------------------------------------
     Optional builder overrides
  --------------------------------------------------------- */
  const builderOverrideKey = `/src/content/builders/${builder}.json`;
  const builderData = projectFiles[builderOverrideKey]?.default ?? null;

  /* ------------------------------------------------------
     Validate schema
  --------------------------------------------------------- */
  const parsed = ProjectSchema.safeParse(baseData);
  if (!parsed.success) {
    console.error("❌ Project schema validation failed:", parsed.error);
    return null;
  }

  const project: ProjectData = parsed.data;

  /* ------------------------------------------------------
     Builder Projects (clean strings)
  --------------------------------------------------------- */
  const builderProjects = allProjectMetas
    .filter((p) => p.builder === project.builder && p.slug !== slug)
    .map((p) => ({
      name: p.projectName ?? p.slug,
      slug: p.slug,
      location: p.locality || p.city || "",
      locality: p.locality,
      city: p.city,
      zone: p.zone,
      heroImage: typeof p.heroImage === "string" ? p.heroImage : null,
      heroVideoId: p.heroVideoId,
    }));

  /* ------------------------------------------------------
     ⭐ CHANGED: Locality Recommendations (ONLY score = 6)
     Meaning:
     locality match = +3
     zone match = +2
     city match = +1
     ONLY include if all match → score === 6
  --------------------------------------------------------- */
  let localityProjects: any[] = [];
  const currentMeta = allProjectMetas.find((p) => p.slug === slug);

  if (currentMeta?.city && currentMeta.locality && currentMeta.zone) {
    localityProjects = allProjectMetas
      .filter((p) => p.slug !== slug)
      .map((p) => {
        let score = 0;
        if (p.locality === currentMeta.locality) score += 3;
        if (p.zone === currentMeta.zone) score += 2;
        if (p.city === currentMeta.city) score += 1;

        return { meta: p, score };
      })
      .filter((x) => x.score === 6) // ⭐ CHANGED: only exact matches
      .map(({ meta }) => ({
        name: meta.projectName ?? meta.slug,
        slug: meta.slug,
        location: meta.locality || meta.city || "",
        locality: meta.locality,
        city: meta.city,
        zone: meta.zone,

        heroImage: typeof meta.heroImage === "string" ? meta.heroImage : null,
        heroVideoId: meta.heroVideoId,
      }));
  }

  return {
    ...project,
    builderData: builderData ?? undefined,
    builderProjects,
    localityProjects,
  };
}
