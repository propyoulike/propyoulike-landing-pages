/**
 * ============================================================
 * Project Meta Builder — STRICT MODE
 *
 * PURPOSE:
 * - Build a deterministic, minimal ProjectMeta index
 * - Used for routing, SEO, listings, prerendering
 *
 * CORE PRINCIPLES:
 * - Filename is the SINGLE source of truth for URL identity
 * - No auto-fixing, no normalization, no guessing
 * - Any inconsistency MUST fail the build
 *
 * FILE RULE:
 * /projects/{builder}/{builder}-{slug}.json
 *
 * URL RULE:
 * /{builder}-{slug}
 * ============================================================
 */

export type ProjectMeta = {
  builder: string;        // builder slug (from path)
  slug: string;           // project slug (from filename)
  publicSlug: string;     // `${builder}-${slug}`

  projectName?: string;
  type: string;           // REQUIRED — used by template resolution
  status?: string;

  area?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
  zone?: string;

  heroImage?: string | null;
  heroVideoId?: string | null;

  featured?: boolean;
};

/* -------------------------------------------------
   Build ALL project metas (STRICT)
-------------------------------------------------- */
export function buildAllProjectMetas(
  contentFiles: Record<string, any>
): ProjectMeta[] {
  const metas: ProjectMeta[] = [];

  for (const [path, mod] of Object.entries(contentFiles)) {
    const data = mod?.default ?? mod;
    if (!data || typeof data !== "object") continue;

    /* Match: /projects/{builder}/{builder}-{slug}.json */
    const match = path.match(/\/projects\/([^/]+)\/([^/]+)\.json$/);
    if (!match) continue;

    const [, builderFromPath, fileBaseName] = match;

    /* 🔒 HARD GUARD #1 — filename format */
    if (!fileBaseName.startsWith(`${builderFromPath}-`)) {
      throw new Error(
        `❌ Invalid project filename.\n\n` +
        `Path: ${path}\n` +
        `Expected: ${builderFromPath}-{slug}.json`
      );
    }

    /* Extract slug from filename */
    const slugFromFilename =
      fileBaseName.slice(builderFromPath.length + 1);

    /* Resolve project root */
    const project = data.project ?? data;

    /* 🔒 HARD GUARD #2 — identity presence */
    if (!project?.builder || !project?.slug || !project?.type) {
      throw new Error(
        `❌ Missing required project identity.\n\n` +
        `File: ${path}\n` +
        `Required: project.builder, project.slug, project.type`
      );
    }

    /* 🔒 HARD GUARD #3 — identity consistency */
    if (project.builder !== builderFromPath) {
      throw new Error(
        `❌ Builder mismatch.\n\n` +
        `Path: ${builderFromPath}\n` +
        `JSON: ${project.builder}\n` +
        `File: ${path}`
      );
    }

    if (project.slug !== slugFromFilename) {
      throw new Error(
        `❌ Slug mismatch.\n\n` +
        `Filename: ${slugFromFilename}\n` +
        `JSON: ${project.slug}\n` +
        `File: ${path}`
      );
    }

    const hero = data.hero ?? {};

    metas.push({
      builder: project.builder,
      slug: project.slug,
      publicSlug: `${project.builder}-${project.slug}`,

      projectName:
        typeof project.projectName === "string"
          ? project.projectName
          : undefined,

      type: project.type,

      status:
        typeof project.status === "string"
          ? project.status
          : undefined,

      area:
        typeof project.area === "string"
          ? project.area
          : undefined,

      locality:
        typeof project.locality === "string"
          ? project.locality
          : undefined,

      city:
        typeof project.city === "string" &&
        project.city.toLowerCase() !== "india"
          ? project.city
          : undefined,

      state:
        typeof project.state === "string"
          ? project.state
          : undefined,

      country:
        typeof project.country === "string"
          ? project.country
          : undefined,

      zone:
        typeof project.zone === "string"
          ? project.zone
          : undefined,

      heroImage:
        Array.isArray(hero.images) && hero.images.length > 0
          ? hero.images[0]
          : null,

      heroVideoId:
        typeof hero.videoId === "string"
          ? hero.videoId
          : null,

      featured: project.featured === true,
    });
  }

  /* 🔒 HARD GUARD #4 — zero projects is a failure */
  if (metas.length === 0) {
    throw new Error("❌ No valid projects found. Build aborted.");
  }

  return metas;
}
