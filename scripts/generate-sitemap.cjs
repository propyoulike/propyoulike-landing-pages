/**
 * SITEMAP GENERATOR (MUST-HAVE LOCKED VERSION)
 *
 * Guarantees:
 * - File-based projects only
 * - Identity resolved via shared helper
 * - Public URL = /<builder>-<slug>
 * - Filename must match public URL
 * - Duplicate URLs forbidden
 * - ❌ Build FAILS if ZERO projects found
 */

const fs = require("fs");
const path = require("path");
const {
  getProjectIdentity,
  enforceProjectGuards,
} = require("./utils/projectIdentity.cjs");

const DOMAIN = "https://propyoulike.com";
const PROJECTS_DIR = path.resolve("src/content/projects");
const today = new Date().toISOString().split("T")[0];

// --------------------------------------------------
function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// --------------------------------------------------
function getProjects() {
  const projects = [];

  for (const builderDirName of fs.readdirSync(PROJECTS_DIR)) {
    const builderDir = path.join(PROJECTS_DIR, builderDirName);
    if (!isDirectory(builderDir)) continue;

    for (const file of fs.readdirSync(builderDir)) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(builderDir, file);
      let data;

      try {
        data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch {
        continue;
      }

      const identity = getProjectIdentity(data);
      if (!identity) continue;

      projects.push({
        ...identity,
        fileName: file,
        locationMeta: data.locationMeta,
      });
    }
  }

  return projects;
}

// --------------------------------------------------
function generate() {
  const projects = getProjects();

  // 🔒 MUST-HAVE GUARD #1: zero projects = hard fail
  if (projects.length === 0) {
    throw new Error("❌ No valid projects found. Sitemap generation aborted.");
  }

  // 🔒 MUST-HAVE GUARD #2: URL + filename invariants
  enforceProjectGuards(projects);

  const urls = projects.map(
    (p) => `
  <url>
    <loc>${DOMAIN}/${p.publicSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  );

  fs.writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`
  );

  console.log(`📄 Sitemap generated (${projects.length} projects)`);
}

// --------------------------------------------------
generate();
