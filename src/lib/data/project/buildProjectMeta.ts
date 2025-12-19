// src/lib/data/project/buildProjectMeta.ts

export type ProjectMeta = {
  slug: string;

  builder?: string;
  projectName?: string;
  type?: string;
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
   Build ALL project metas
   (index.json + hero.json merged)
-------------------------------------------------- */
export function buildAllProjectMetas(
  contentFiles: Record<string, any>
): ProjectMeta[] {
  const projectMap = new Map<
    string,
    {
      builder: string;
      slug: string;
      index?: any;
      hero?: any;
    }
  >();

  /* ---------------------------------------------
     1️⃣ Group files by project folder
  ---------------------------------------------- */
  for (const [path, mod] of Object.entries(contentFiles)) {
    const data = mod?.default ?? mod;
    if (!data || typeof data !== "object") continue;

    /**
     * Matches:
     * /src/content/projects/builder/project/index.json
     * /src/content/projects/builder/project/hero.json
     */
    const match = path.match(
      /\/projects\/([^/]+)\/([^/]+)\/(index|hero)\.json$/
    );

    if (!match) continue;

    const [, builder, slug, file] = match;
    const key = `${builder}-${slug}`;

    if (!projectMap.has(key)) {
      projectMap.set(key, { builder, slug });
    }

    projectMap.get(key)![file as "index" | "hero"] = data;
  }

  /* ---------------------------------------------
     2️⃣ Build ProjectMeta objects
  ---------------------------------------------- */
  const metas: ProjectMeta[] = [];

  for (const [fullSlug, entry] of projectMap.entries()) {
    const { builder, slug, index, hero } = entry;

    // index.json is mandatory
    if (!index || !builder || !slug) continue;

    // Sanitize city (never allow "India")
    const rawCity =
      typeof index.city === "string" &&
      index.city.toLowerCase() !== "india"
        ? index.city
        : undefined;

    // Extract hero data from hero.json
    const heroImage =
      Array.isArray(hero?.hero?.images) && hero.hero.images.length > 0
        ? hero.hero.images[0]
        : null;

    metas.push({
      slug: fullSlug,
      builder,

      projectName:
        typeof index.projectName === "string"
          ? index.projectName
          : undefined,

      type:
        typeof index.type === "string"
          ? index.type
          : undefined,

      status:
        typeof index.status === "string"
          ? index.status
          : undefined,

      area:
        typeof index.area === "string"
          ? index.area
          : undefined,

      locality:
        typeof index.locality === "string"
          ? index.locality
          : undefined,

      city: rawCity,

      state:
        typeof index.state === "string"
          ? index.state
          : undefined,

      country:
        typeof index.country === "string"
          ? index.country
          : undefined,

      zone:
        typeof index.zone === "string"
          ? index.zone
          : undefined,

      heroImage,
      heroVideoId:
        typeof hero?.hero?.videoId === "string"
          ? hero.hero.videoId
          : null,

      featured: index.featured === true,
    });
  }

  return metas;
}
