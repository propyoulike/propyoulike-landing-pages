const fs = require("fs");
const path = require("path");

const DIST = path.resolve("dist");
const PROJECTS_SRC = path.resolve("src/content/projects");
const DOMAIN = "https://propyoulike.com";

function fail(msg) {
  console.error(`❌ CANONICAL/OG FAILED: ${msg}`);
  process.exit(1);
}

function read(rel) {
  return fs.readFileSync(path.join(DIST, rel), "utf8");
}

function has(re, html) {
  return re.test(html);
}

/* ------------------------------
   Builder slugs (source of truth)
------------------------------- */
const builderSlugs = fs
  .readdirSync(PROJECTS_SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

/* ------------------------------
   Validate builder hubs
------------------------------- */
builderSlugs.forEach((slug) => {
  const rel = `${slug}/index.html`;
  const html = read(rel);

  const canonical = `${DOMAIN}/${slug}/`;

  if (!has(new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${canonical}["']`, "i"), html)) {
    fail(`Builder canonical incorrect or missing: /${slug}`);
  }

  if (!has(/property=["']og:title["']/i, html)) {
    fail(`Missing og:title on builder: /${slug}`);
  }

  if (!has(/property=["']og:description["']/i, html)) {
    fail(`Missing og:description on builder: /${slug}`);
  }

  if (!has(new RegExp(`property=["']og:url["'][^>]+content=["']${canonical}["']`, "i"), html)) {
    fail(`og:url incorrect on builder: /${slug}`);
  }
});

/* ------------------------------
   Validate project pages
------------------------------- */
const projectDirs = fs
  .readdirSync(DIST, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      !["assets", "legal", "shared", ".vite", "images"].includes(d.name) &&
      !builderSlugs.includes(d.name)
  )
  .map((d) => d.name);

if (projectDirs.length === 0) {
  fail("No project directories found");
}

projectDirs.forEach((slug) => {
  const rel = `${slug}/index.html`;
  const html = read(rel);
  const canonical = `${DOMAIN}/${slug}/`;

  if (!has(new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${canonical}["']`, "i"), html)) {
    fail(`Project canonical incorrect or missing: /${slug}`);
  }

  if (!has(/property=["']og:title["']/i, html)) {
    fail(`Missing og:title on project: /${slug}`);
  }

  if (!has(/property=["']og:description["']/i, html)) {
    fail(`Missing og:description on project: /${slug}`);
  }

  if (!has(new RegExp(`property=["']og:url["'][^>]+content=["']${canonical}["']`, "i"), html)) {
    fail(`og:url incorrect on project: /${slug}`);
  }
});

console.log("✅ Canonical & OG validation passed");
