// src/lib/data/project/loadBaseProject.ts

export function loadBaseProject(
  slug: string,
  getJSON: (path: string) => any
) {
  if (!slug) {
    throw new Error("❌ loadBaseProject called without slug");
  }

  // Slug format: <builder>-<project-slug>
  const [builder, ...rest] = slug.split("-");
  const projectSlug = rest.join("-");

  if (!builder || !projectSlug) {
    throw new Error(`❌ Invalid project slug format: "${slug}"`);
  }

  const basePath = `/src/content/projects/${builder}/${builder}-${projectSlug}.json`;
  const base = getJSON(basePath);

  if (!base) {
    throw new Error(`❌ Project index.json not found at ${basePath}`);
  }

  return {
    builder,
    projectSlug,
    base,
  };
}
