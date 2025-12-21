/**
 * PRERENDER (MUST-HAVE LOCKED VERSION)
 *
 * Output:
 *  /dist/<builder>-<slug>/index.html
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
      });
    }
  }

  return projects;
}

// --------------------------------------------------
// PRECHECKS
// --------------------------------------------------
if (!fs.existsSync("dist")) {
  throw new Error("❌ dist/ missing. Run Vite build first.");
}

const baseTemplatePath = path.resolve("dist/project.html");
if (!fs.existsSync(baseTemplatePath)) {
  throw new Error("❌ dist/project.html missing.");
}

const baseHtml = fs.readFileSync(baseTemplatePath, "utf8");

// --------------------------------------------------
// COLLECT + GUARD
// --------------------------------------------------
const projects = getProjects();

// 🔒 MUST-HAVE GUARD #1: zero projects = hard fail
if (projects.length === 0) {
  throw new Error("❌ No valid projects found. Prerender aborted.");
}

// 🔒 MUST-HAVE GUARD #2: URL + filename invariants
enforceProjectGuards(projects);

// --------------------------------------------------
// PRERENDER
// --------------------------------------------------
projects.forEach((p) => {
  const outDir = path.resolve(`dist/${p.publicSlug}`);
  const outFile = path.join(outDir, "index.html");

  fs.mkdirSync(outDir, { recursive: true });

  const html = baseHtml
    .replace(
      "<!--__PROJECT_ENTRY__-->",
      `<script type="module" src="/projectEntry.js"></script>`
    )
    .replace(
      "</head>",
      `  <link rel="canonical" href="${DOMAIN}/${p.publicSlug}" />\n</head>`
    );

  fs.writeFileSync(outFile, html);
  console.log(`✓ Prerendered: /${p.publicSlug}`);
});

console.log(`\n✨ Prerendered ${projects.length} project page(s).`);
