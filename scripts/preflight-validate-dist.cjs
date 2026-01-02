/**
 * PRE-FLIGHT VALIDATION (DIST-ONLY, HARD SAFE)
 *
 * RULES:
 * - Validate ONLY generated output in /dist
 * - NEVER re-validate source JSON
 * - NEVER derive identity again
 * - If something exists in dist, trust upstream generators
 */

const fs = require("fs");
const path = require("path");

const DIST = path.resolve("dist");

function fail(msg) {
  console.error(`❌ PRE-FLIGHT FAILED: ${msg}`);
  process.exit(1);
}

function exists(rel) {
  return fs.existsSync(path.join(DIST, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(DIST, rel), "utf8");
}

/* ============================================================
   1. REQUIRED LEGAL PAGES (FOOTER CONTRACT)
============================================================ */

const legalPages = [
  "legal/about/index.html",
  "legal/contact/index.html",
  "legal/privacy/index.html",
  "legal/terms/index.html",
  "legal/rera/index.html",
];

for (const p of legalPages) {
  if (!exists(p)) {
    fail(`Missing legal page: /${p}`);
  }
}

/* ============================================================
   2. SITEMAP (GLOBAL SEO CONTRACT)
============================================================ */

if (!exists("sitemap.xml")) {
  fail("Missing sitemap.xml");
}

/* ============================================================
   3. BUILDER HUB PAGES (TOP-LEVEL)
   Example:
   /provident/index.html
   /purva/index.html
============================================================ */

const distDirs = fs.readdirSync(DIST, { withFileTypes: true });

const builderDirs = distDirs
  .filter(
    (d) =>
      d.isDirectory() &&
      ![
        "assets",
        "shared",
        "images",
        "legal",
        ".vite",
      ].includes(d.name)
  )
  .map((d) => d.name)
  .filter((name) => exists(`${name}/index.html`))
  .filter((name) => {
    // builder pages have NO dash
    return !name.includes("-");
  });

if (builderDirs.length === 0) {
  fail("No builder hub pages found in /dist");
}

for (const builder of builderDirs) {
  const rel = `${builder}/index.html`;
  if (!exists(rel)) {
    fail(`Missing builder hub page: /${rel}`);
  }
}

/* ============================================================
   4. PROJECT PAGES (DIST = SOURCE OF TRUTH)
============================================================ */

const projectDirs = distDirs
  .filter(
    (d) =>
      d.isDirectory() &&
      ![
        "assets",
        "shared",
        "images",
        "legal",
        ".vite",
        ...builderDirs,
      ].includes(d.name)
  )
  .map((d) => d.name);

if (projectDirs.length === 0) {
  fail("No project pages found in /dist");
}

for (const slug of projectDirs) {
  const rel = `${slug}/index.html`;

  if (!exists(rel)) {
    fail(`Missing project page: /${rel}`);
  }

  const html = read(rel);

  if (!/<title>.+<\/title>/i.test(html)) {
    fail(`Missing <title> in /${rel}`);
  }

  if (!/meta\s+name=["']description["']/i.test(html)) {
    fail(`Missing meta description in /${rel}`);
  }
}

console.log("✅ Pre-flight validation passed");
