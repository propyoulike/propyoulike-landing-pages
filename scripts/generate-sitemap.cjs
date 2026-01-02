/**
 * ============================================================
 * SITEMAP GENERATOR — PRODUCTION LOCKED
 * ============================================================
 *
 * Guarantees:
 * - File-based projects only
 * - Identity resolved via shared helper
 * - Public URL = /<builder>-<slug>
 * - Filename must match public URL
 * - Duplicate URLs forbidden
 * - Homepage explicitly included
 * - ❌ Build FAILS if ZERO projects found
 * - Output always written to /public/sitemap.xml
 */

const fs = require("fs");
const path = require("path");

const {
  getProjectIdentity,
  enforceProjectGuards,
} = require("./utils/projectIdentity.cjs");

/* ============================================================
   CONFIG
============================================================ */

const DOMAIN = "https://propyoulike.com";
const PROJECTS_DIR = path.resolve("src/content/projects");
const OUTPUT_FILE = path.resolve("public/sitemap.xml");
const today = new Date().toISOString().split("T")[0];

/* ============================================================
   UTILS
============================================================ */

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/* ============================================================
   PROJECT DISCOVERY
============================================================ */

function getProjects() {
  const projects = [];

  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error(`❌ Projects directory not found: ${PROJECTS_DIR}`);
  }

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
        throw new Error(`❌ Invalid JSON: ${builderDirName}/${file}`);
      }

      const identity = getProjectIdentity(
        data.project && typeof data.project === "object"
          ? data.project
          : data
      );

      if (!identity) {
        throw new Error(
          `❌ Invalid project identity in sitemap: ${builderDirName}/${file}`
        );
      }

      projects.push({
        ...identity,
        fileName: file,
      });
    }
  }

  return projects;
}

/* ============================================================
   SITEMAP GENERATION
============================================================ */

function generate() {
  const projects = getProjects();

  /* 🔒 MUST-HAVE GUARD #1 */
  if (projects.length === 0) {
    throw new Error("❌ No valid projects found. Sitemap generation aborted.");
  }

  /* 🔒 MUST-HAVE GUARD #2 */
  enforceProjectGuards(projects);

  /* 🔒 MUST-HAVE GUARD #3: duplicate slug protection */
  const seen = new Set();
  for (const p of projects) {
    if (seen.has(p.publicSlug)) {
      throw new Error(`❌ Duplicate publicSlug detected: ${p.publicSlug}`);
    }
    seen.add(p.publicSlug);
  }

  /* ----------------------------------------------------------
     STATIC URLS (HOMEPAGE)
  ---------------------------------------------------------- */

  const staticUrls = [
    `
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  /* ----------------------------------------------------------
     PROJECT URLS
  ---------------------------------------------------------- */

  const projectUrls = projects.map(
    (p) => `
  <url>
    <loc>${DOMAIN}/${p.publicSlug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  );

  /* ----------------------------------------------------------
     WRITE FILE
  ---------------------------------------------------------- */

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...projectUrls].join("\n")}
</urlset>
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, xml, "utf8");

  console.log(`📄 Sitemap generated: ${OUTPUT_FILE}`);
  console.log(`🔢 Total URLs: ${staticUrls.length + projectUrls.length}`);
}

/* ============================================================
   EXECUTE
============================================================ */

generate();
