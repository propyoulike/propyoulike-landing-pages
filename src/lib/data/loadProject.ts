// src/content/loadProject.ts

import { ProjectSchema, type ProjectData } from "@/content/schema/project.schema";

/* ------------------------------------------------------------------
   Load all JSON content eagerly (Vite)
------------------------------------------------------------------- */
const contentFiles = import.meta.glob("/src/content/**/*.json", {
  eager: true
}) as Record<string, any>;

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
function getJSON(path: string) {
  const mod = contentFiles[path];
  return mod ? mod.default ?? mod : null;
}

/* ------------------------------------------------------------------
   Load base project (index.json)
------------------------------------------------------------------- */
function loadBaseProject(slug: string) {
  const [builder, ...rest] = slug.split("-");
  const projectSlug = rest.join("-");

  const basePath = `/src/content/projects/${builder}/${projectSlug}/index.json`;
  const base = getJSON(basePath);

  if (!base) {
    throw new Error(`❌ Project index.json not found at ${basePath}`);
  }

  return { builder, projectSlug, base };
}

/* ------------------------------------------------------------------
   Strictly hydrate referenced section JSON files
   RULE:
   - Each JSON must export a root key equal to the project key
------------------------------------------------------------------- */
function hydrateFiles(project: any, builder: string, projectSlug: string) {
  const baseDir = `/src/content/projects/${builder}/${projectSlug}/`;

  if (!project.files) return project;

  for (const [key, fileName] of Object.entries(project.files)) {
    const filePath = `${baseDir}${fileName}`;
    const data = getJSON(filePath);

    if (!data) {
      console.warn(`⚠️ Missing file: ${filePath}`);
      continue;
    }

    if (!data[key]) {
      console.warn(`⚠️ ${fileName} must export root key "${key}". Skipped.`);
      continue;
    }

    project[key] = data[key];
  }

  return project;
}

/* ------------------------------------------------------------------
   Project Meta (used for listings & recommendations)
------------------------------------------------------------------- */
export type ProjectMeta = {
  slug: string;
  builder: string;
  projectName?: string;
  city?: string;
  zone?: string;
  locality?: string;
  heroImage?: string | null;
  heroVideoId?: string | null;
};

/* ------------------------------------------------------------------
   Build meta index from index.json files
------------------------------------------------------------------- */
const allProjectMetas: ProjectMeta[] = Object.entries(contentFiles)
  .filter(([path]) => path.endsWith("/index.json"))
  .map(([_, mod]) => {
    const data = mod.default ?? mod;

    if (!data.slug || !data.builder) return null;

    return {
      slug: `${data.builder}-${data.slug}`,
      builder: data.builder,
      projectName: data.projectName,
      city: data.city,
      zone: data.zone,
      locality: data.locality,
      heroImage: data.hero?.images?.[0] ?? null,
      heroVideoId: data.hero?.videoId ?? null
    };
  })
  .filter(Boolean) as ProjectMeta[];

/* ------------------------------------------------------------------
   Public API: loadProject
------------------------------------------------------------------- */
export async function loadProject(
  slug: string
): Promise<
  ProjectData & {
    builderProjects: ProjectMeta[];
    localityProjects: ProjectMeta[];
  }
> {
  if (!slug) throw new Error("❌ loadProject called without slug");

  /* 1. Load base project */
  const { builder, projectSlug, base } = loadBaseProject(slug);

  /* 2. Hydrate section files */
  const hydrated = hydrateFiles(structuredClone(base), builder, projectSlug);

/* ---------------------------------------------------------------
   3. Merge FAQs (Global + Builder + Project)
   FINAL OUTPUT → hydrated.faq (object with .faqs array)
---------------------------------------------------------------- */
const globalFaq = getJSON("/src/content/projects/faq.json")?.faqs ?? [];
const builderFaq = getJSON(`/src/content/projects/${builder}/builder_faq.json`)?.faqs ?? [];
const projectFaqPath = `/src/content/projects/${builder}/${projectSlug}/faq.json`;
const projectFaq = getJSON(projectFaqPath)?.faqs ?? [];

const finalFaqs = [...globalFaq, ...builderFaq, ...projectFaq];

// Schema requires hydrated.faq (not hydrated.faqs)
hydrated.faq = {
  title: hydrated.faq?.title ?? "Frequently Asked Questions",
  subtitle: hydrated.faq?.subtitle ?? "Everything you should know before buying this home",
  faqs: finalFaqs
};

  /* ---------------------------------------------------------------
     4. Validate against schema
  ---------------------------------------------------------------- */
  const parsed = ProjectSchema.safeParse(hydrated);
  if (!parsed.success) {
    console.error("❌ Project schema validation failed", parsed.error);
    throw new Error("Invalid project schema");
  }

  const project = Object.freeze(parsed.data);

  /* ---------------------------------------------------------------
     5. Builder sibling projects
  ---------------------------------------------------------------- */
  const builderProjects = allProjectMetas.filter(
    (p) => p.builder === builder && p.slug !== slug
  );

  /* ---------------------------------------------------------------
     6. Locality recommendations
  ---------------------------------------------------------------- */
  const current = allProjectMetas.find((p) => p.slug === slug);

  const localityProjects = current
    ? allProjectMetas.filter(
        (p) =>
          p.slug !== slug &&
          p.city === current.city &&
          p.zone === current.zone
      )
    : [];

  /* ---------------------------------------------------------------
     7. Return final normalized project
  ---------------------------------------------------------------- */
  return {
    ...project,
    builderProjects,
    localityProjects
  };
}

/* ------------------------------------------------------------------
   Public APIs for routing & listings
------------------------------------------------------------------- */
export { allProjectMetas };

export function getProjectsByCity(city: string) {
  if (!city) return [];
  return allProjectMetas.filter(
    (p) => p.city?.toLowerCase() === city.toLowerCase()
  );
}

export function getProjectsByZone(city: string, zone: string) {
  if (!city || !zone) return [];
  return allProjectMetas.filter(
    (p) =>
      p.city?.toLowerCase() === city.toLowerCase() &&
      p.zone?.toLowerCase() === zone.toLowerCase()
  );
}

export function isProjectSlug(slug: string) {
  return allProjectMetas.some((p) => p.slug === slug);
}
