// src/lib/data/project/hydrateFiles.ts

type GetJSON = (path: string) => any;

export function hydrateFiles(
  project: any,
  builder: string,
  projectSlug: string,
  getJSON: GetJSON
) {
  // 🔒 Guard: nothing to hydrate
  if (!project || typeof project !== "object" || !project.files) {
    return project;
  }

  const projectDir = `/src/content/projects/${builder}/${projectSlug}/`;
  const builderDir = `/src/content/projects/${builder}/`;

  for (const [key, fileName] of Object.entries(project.files)) {
    if (typeof fileName !== "string") {
      console.warn(`⚠️ Invalid file mapping for key "${key}"`);
      continue;
    }

    let data: any = null;

    /* -------------------------------------------------
       1️⃣ Project-level override
    -------------------------------------------------- */
    data = getJSON(`${projectDir}${fileName}`);

    /* -------------------------------------------------
       2️⃣ Builder-level fallback
    -------------------------------------------------- */
    if (!data) {
      const normalized = fileName.replace(/^(\.\.\/)+/, "");
      data = getJSON(`${builderDir}${normalized}`);
    }

    /* -------------------------------------------------
       3️⃣ Missing file
    -------------------------------------------------- */
    if (!data) {
      console.warn(
        `⚠️ hydrateFiles: Missing "${fileName}" for key "${key}"`
      );
      continue;
    }

    /* -------------------------------------------------
       4️⃣ Missing expected export
    -------------------------------------------------- */
    if (!(key in data)) {
      console.warn(
        `⚠️ hydrateFiles: "${fileName}" must export root key "${key}"`
      );
      continue;
    }

    /* -------------------------------------------------
       5️⃣ Inject hydrated data
    -------------------------------------------------- */
    project[key] = data[key];
  }

  return project;
}
