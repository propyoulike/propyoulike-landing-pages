// src/lib/data/loadProject.ts

import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";

// GLOBAL CONFIG
import globalFiles from "@/content/global/globalFiles.json";
import globalSections from "@/content/global/globalSections.json";
import globalNavbar from "@/content/global/globalNavbar.json";

// Load all JSON files
const projectFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true,
}) as Record<string, any>;

/* --------------------------------------------------------------
   Helper: safe fallback image
--------------------------------------------------------------- */
function fallbackImg(label: string) {
  const safe = encodeURIComponent(label.replace(/[:]/g, ""));
  return `https://via.placeholder.com/800x450?text=${safe}`;
}

/* --------------------------------------------------------------
   Collect metadata for all projects
--------------------------------------------------------------- */
type ProjectMeta = {
  slug: string;
  builder?: string;
  projectName?: string;
  area?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
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

    const baseDir = path.replace("index.json", "");

    // Try hero files
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

    // Extract hero image
    let heroImage: string | null = null;

    if (Array.isArray(hero?.images)) {
      const first = hero.images[0];
      heroImage = typeof first === "string" ? first : first?.url ?? null;
    }

    if (!heroImage && typeof hero?.image === "string") {
      heroImage = hero.image;
    }

    const heroVideoId = hero?.videoId ?? hero?.videoUrl ?? null;

    return {
      slug: fullSlug,
      builder,
      projectName: raw.projectName,
      area: raw.locationMeta?.area ?? raw.area,
      locality: raw.locationMeta?.locality ?? raw.locality,
      city: raw.locationMeta?.city ?? raw.city,
      state: raw.locationMeta?.state ?? raw.state,
      country: raw.locationMeta?.country ?? raw.country,
      zone: raw.locationMeta?.zone ?? raw.zone,
      heroImage,
      heroVideoId,
    };
  })
  .filter((p) => !!p.slug);

/* --------------------------------------------------------------
   Project loader — full JSON assembly
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

  /* --------------------------------------------------------------
      Builder overrides
  --------------------------------------------------------------- */
  const builderFiles =
    projectFiles[`/src/content/builders/${builder}/files.json`]?.default ?? null;

  const builderSections =
    projectFiles[`/src/content/builders/${builder}/sections.json`]?.default ??
    null;

  const builderNavbar =
    projectFiles[`/src/content/builders/${builder}/navbar.json`]?.default ??
    null;

  /* --------------------------------------------------------------
      Merge FILES
  --------------------------------------------------------------- */
  baseData.files = {
    ...(globalFiles.files || {}),
    ...(builderFiles?.files || {}),
    ...(baseData.files || {}),
  };

  /* --------------------------------------------------------------
      Merge SECTIONS
  --------------------------------------------------------------- */
  baseData.sections = [
    ...(globalSections.sections || []),
    ...(builderSections?.sections || []),
    ...(baseData.sections || []),
  ];

  /* --------------------------------------------------------------
      Merge NAVBAR
  --------------------------------------------------------------- */
  baseData.navbarConfig = {
    ...(globalNavbar.navbarConfig || {}),
    ...(builderNavbar?.navbarConfig || {}),
    ...(baseData.navbarConfig || {}),
  };

  /* --------------------------------------------------------------
      Auto-load referenced section files
  --------------------------------------------------------------- */
  for (const key of Object.keys(baseData.files)) {
    const fileName = baseData.files[key];

    const attempts = [
      `${baseDir}${fileName}`,
      `${baseDir}${fileName.replace(/^\.\.\//, "")}`,
    ];

    for (const c of attempts) {
      if (projectFiles[c]) {
        const raw = projectFiles[c].default ?? projectFiles[c];

        if (
          typeof raw === "object" &&
          raw !== null &&
          Object.keys(raw).length === 1 &&
          raw[key]
        ) {
          baseData[key] = raw[key];
        } else {
          baseData[key] = raw;
        }

        break;
      }
    }
  }

  /* --------------------------------------------------------------
      Legacy builder.json if exists
  --------------------------------------------------------------- */
  const builderOverrideKey = `/src/content/builders/${builder}.json`;
  const builderData = projectFiles[builderOverrideKey]?.default ?? null;

  /* --------------------------------------------------------------
      Validate schema
  --------------------------------------------------------------- */
  const parsed = ProjectSchema.safeParse(baseData);

  if (!parsed.success) {
    console.error("❌ Project schema validation failed:", parsed.error);
    return null;
  }

  const project: ProjectData = parsed.data;

  /* --------------------------------------------------------------
      Builder sibling projects
  --------------------------------------------------------------- */
  const builderProjects = allProjectMetas
    .filter((p) => p.builder === project.builder && p.slug !== slug)
    .map((meta) => ({
      name: meta.projectName ?? meta.slug,
      slug: meta.slug,
      builder: meta.builder,
      area: meta.area,
      locality: meta.locality,
      city: meta.city,
      state: meta.state,
      country: meta.country,
      zone: meta.zone,
      heroImage: meta.heroImage || null,
      heroVideoId: meta.heroVideoId,
      location:
        meta.area ||
        meta.locality ||
        meta.city ||
        meta.state ||
        meta.country ||
        "",
    }));

  /* --------------------------------------------------------------
      Hierarchical locality recommendation
  --------------------------------------------------------------- */
  let localityProjects: any[] = [];
  const currentMeta = allProjectMetas.find((p) => p.slug === slug);

  if (currentMeta) {
    const levels = [
      (p: ProjectMeta) =>
        p.country === currentMeta.country &&
        p.state === currentMeta.state &&
        p.city === currentMeta.city &&
        p.zone === currentMeta.zone &&
        p.locality === currentMeta.locality &&
        p.area === currentMeta.area,

      (p: ProjectMeta) =>
        p.country === currentMeta.country &&
        p.state === currentMeta.state &&
        p.city === currentMeta.city &&
        p.zone === currentMeta.zone &&
        p.locality === currentMeta.locality,

      (p: ProjectMeta) =>
        p.country === currentMeta.country &&
        p.state === currentMeta.state &&
        p.city === currentMeta.city &&
        p.zone === currentMeta.zone,

      (p: ProjectMeta) =>
        p.country === currentMeta.country &&
        p.state === currentMeta.state &&
        p.city === currentMeta.city,

      (p: ProjectMeta) =>
        p.country === currentMeta.country &&
        p.state === currentMeta.state,

      (p: ProjectMeta) => p.country === currentMeta.country,
    ];

    for (const matchFn of levels) {
      const matches = allProjectMetas
        .filter((p) => p.slug !== slug && matchFn(p))
        .map((m) => ({
          name: m.projectName ?? m.slug,
          slug: m.slug,
          builder: m.builder,
          area: m.area,
          locality: m.locality,
          city: m.city,
          state: m.state,
          country: m.country,
          zone: m.zone,
          heroImage: m.heroImage || null,
          heroVideoId: m.heroVideoId,
          location:
            m.area ||
            m.locality ||
            m.city ||
            m.state ||
            m.country ||
            "",
        }));

      if (matches.length > 0) {
        localityProjects = matches;
        break;
      }
    }
  }

  return {
    ...project,
    builderData: builderData ?? undefined,
    builderProjects,
    localityProjects,
  };
}

/* --------------------------------------------------------------
   Public API: Get projects by CITY
--------------------------------------------------------------- */
export function getProjectsByCity(city: string) {
  if (!city) return [];

  const cityLower = city.toLowerCase();

  return allProjectMetas
    .filter((p) => p.city?.toLowerCase() === cityLower)
    .map((m) => ({
      name: m.projectName ?? m.slug,
      slug: m.slug,
      builder: m.builder,
      area: m.area,
      locality: m.locality,
      city: m.city,
      state: m.state,
      country: m.country,
      zone: m.zone,
      heroImage: m.heroImage || null,
      heroVideoId: m.heroVideoId,
      location:
        m.area ||
        m.locality ||
        m.city ||
        m.state ||
        m.country ||
        "",
    }));
}

/* --------------------------------------------------------------
   Public API: Get projects by ZONE
--------------------------------------------------------------- */
export function getProjectsByZone(city: string, zone: string) {
  if (!city || !zone) return [];

  const cityLower = city.toLowerCase();
  const zoneLower = zone.toLowerCase();

  return allProjectMetas
    .filter(
      (p) =>
        p.city?.toLowerCase() === cityLower &&
        p.zone?.toLowerCase() === zoneLower
    )
    .map((m) => ({
      name: m.projectName ?? m.slug,
      slug: m.slug,
      builder: m.builder,
      area: m.area,
      locality: m.locality,
      city: m.city,
      state: m.state,
      country: m.country,
      zone: m.zone,
      heroImage: m.heroImage || null,
      heroVideoId: m.heroVideoId,
      location:
        m.area ||
        m.locality ||
        m.city ||
        m.state ||
        m.country ||
        "",
    }));
}

/* --------------------------------------------------------------
   Public API: Check if slug belongs to a project
--------------------------------------------------------------- */
export function isProjectSlug(slug: string) {
  if (!slug) return false;
  return allProjectMetas.some((p) => p.slug === slug);
}

/* --------------------------------------------------------------
   Export meta list for Breadcrumbs + SEO
--------------------------------------------------------------- */
export { allProjectMetas };
