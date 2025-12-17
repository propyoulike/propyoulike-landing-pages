// src/lib/data/project/buildProjectMeta.ts

export type ProjectMeta = {
  slug: string;              // canonical router slug
  builder: string;

  projectName?: string;
  city?: string;
  zone?: string;
  locality?: string;

  heroImage?: string | null;
  heroVideoId?: string | null;
};

/* -------------------------------------------------
   Build ALL project metas (single scan)
-------------------------------------------------- */
export function buildAllProjectMetas(
  contentFiles: Record<string, any>
): ProjectMeta[] {
  return Object.entries(contentFiles)
    .filter(([path]) => path.endsWith("/index.json"))
    .map(([path, mod]) => {
      const data = mod?.default ?? mod;
      if (!data || typeof data !== "object") return null;

      const builder = typeof data.builder === "string" ? data.builder : null;
      const slug = typeof data.slug === "string" ? data.slug : null;

      if (!builder || !slug) return null;

      // 🔑 Canonical router slug
      const fullSlug = `${builder}-${slug}`;

      const hero = data.hero && typeof data.hero === "object"
        ? data.hero
        : null;

      const heroImage =
        Array.isArray(hero?.images) && hero.images.length > 0
          ? hero.images[0]
          : null;

      return {
        slug: fullSlug,
        builder,

        projectName:
          typeof data.projectName === "string"
            ? data.projectName
            : undefined,

        city: typeof data.city === "string" ? data.city : undefined,
        locality: typeof data.locality === "string" ? data.locality : undefined,

        zone:
          typeof data.zone === "string"
            ? data.zone
            : undefined,

        heroImage,
        heroVideoId:
          typeof hero?.videoId === "string" ? hero.videoId : null,
      };
    })
    .filter(Boolean) as ProjectMeta[];
}
