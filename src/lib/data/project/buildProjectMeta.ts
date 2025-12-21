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
   Supports:
   1️⃣ Folder-based projects (index.json + hero.json)
   2️⃣ Flat-file projects (project.json)
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
      flat?: any;
    }
  >();

  /* ---------------------------------------------
     1️⃣ Scan all content files
  ---------------------------------------------- */
  for (const [path, mod] of Object.entries(contentFiles)) {
    const data = mod?.default ?? mod;
    if (!data || typeof data !== "object") continue;

    /* =================================================
       🟢 NEW: FLAT FILE SUPPORT
       Matches:
       /projects/{builder}/{slug}.json
    ================================================== */
    const flatMatch = path.match(
      /\/projects\/([^/]+)\/([^/]+)\.json$/
    );

    if (flatMatch) {
      const [, builder, slug] = flatMatch;
      const key = `${builder}-${slug}`;

      projectMap.set(key, {
        builder,
        slug,
        flat: data,
      });

      continue;
    }

    /* =================================================
       🔵 EXISTING: FOLDER-BASED SUPPORT
       Matches:
       /projects/{builder}/{slug}/index.json
       /projects/{builder}/{slug}/hero.json
    ================================================== */
    const folderMatch = path.match(
      /\/projects\/([^/]+)\/([^/]+)\/(index|hero)\.json$/
    );

    if (!folderMatch) continue;

    const [, builder, slug, file] = folderMatch;
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

  for (const entry of projectMap.values()) {
    const { builder, slug, index, hero, flat } = entry;

    /* =================================================
       🟢 FLAT FILE PROJECT
    ================================================== */
    if (flat) {
      const project = flat.project ?? flat;

      const rawCity =
        typeof project.city === "string" &&
        project.city.toLowerCase() !== "india"
          ? project.city
          : undefined;

      const heroBlock = flat.hero ?? {};

      const heroImage =
        Array.isArray(heroBlock.images) && heroBlock.images.length > 0
          ? heroBlock.images[0]
          : null;

      metas.push({
        slug,
        builder,

        projectName:
          typeof project.projectName === "string"
            ? project.projectName
            : undefined,

        type:
          typeof project.type === "string"
            ? project.type
            : undefined,

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

        city: rawCity,

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

        heroImage,
        heroVideoId:
          typeof heroBlock.videoId === "string"
            ? heroBlock.videoId
            : null,

        featured: project.featured === true,
      });

      continue;
    }

    /* =================================================
       🔵 FOLDER-BASED PROJECT (LEGACY)
    ================================================== */
    if (!index) continue;

    const rawCity =
      typeof index.city === "string" &&
      index.city.toLowerCase() !== "india"
        ? index.city
        : undefined;

    const heroImage =
      Array.isArray(hero?.hero?.images) && hero.hero.images.length > 0
        ? hero.hero.images[0]
        : null;

    metas.push({
      slug,
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
