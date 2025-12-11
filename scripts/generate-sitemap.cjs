/**
 * ADVANCED SITEMAP GENERATOR
 * Generates:
 *  - sitemap.xml (root)
 *  - sitemap-projects.xml
 *  - sitemap-locations.xml (cities + zones)
 *  - sitemap-builders.xml
 */

const fs = require("fs");
const path = require("path");

const DOMAIN = "https://propyoulike.com";
const PROJECTS_DIR = path.resolve("src/content/projects");

function safeLoc(url) {
  return `${DOMAIN}${url}`;
}

const today = new Date().toISOString().split("T")[0];

/* -------------------------------------------------------------
   1. GET ALL PROJECT SLUGS
------------------------------------------------------------- */
function getProjectSlugs() {
  const slugs = [];

  for (const builder of fs.readdirSync(PROJECTS_DIR)) {
    const builderDir = path.join(PROJECTS_DIR, builder);
    if (!fs.statSync(builderDir).isDirectory()) continue;

    for (const project of fs.readdirSync(builderDir)) {
      const indexFile = path.join(builderDir, project, "index.json");
      if (fs.existsSync(indexFile)) {
        slugs.push({
          slug: `${builder}-${project}`,
          builder,
          project,
        });
      }
    }
  }
  return slugs;
}

/* -------------------------------------------------------------
   2. READ CITY + ZONE METADATA FROM JSON FILES
------------------------------------------------------------- */
function extractCityZone() {
  const setCities = new Set();
  const zonesByCity = {};

  for (const builder of fs.readdirSync(PROJECTS_DIR)) {
    const builderDir = path.join(PROJECTS_DIR, builder);

    for (const project of fs.readdirSync(builderDir)) {
      const indexPath = path.join(builderDir, project, "index.json");
      if (!fs.existsSync(indexPath)) continue;

      const data = JSON.parse(fs.readFileSync(indexPath, "utf8"));

      const city = data.locationMeta?.city?.toLowerCase();
      const zone = data.locationMeta?.zone?.toLowerCase();

      if (city) {
        setCities.add(city);

        if (zone) {
          if (!zonesByCity[city]) zonesByCity[city] = new Set();
          zonesByCity[city].add(zone);
        }
      }
    }
  }

  return {
    cities: [...setCities],
    zones: zonesByCity,
  };
}

/* -------------------------------------------------------------
   3. GET BUILDERS LIST
------------------------------------------------------------- */
function getBuilders() {
  return fs.readdirSync(PROJECTS_DIR).filter((b) =>
    fs.statSync(path.join(PROJECTS_DIR, b)).isDirectory()
  );
}

/* -------------------------------------------------------------
   BUILD XML ENTRY
------------------------------------------------------------- */
function urlNode(loc, priority = "0.70") {
  return `
  <url>
    <loc>${safeLoc(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/* -------------------------------------------------------------
   4. BUILD PROJECT SITEMAP
------------------------------------------------------------- */
function buildProjectSitemap(slugs) {
  const entries = slugs
    .map((p) => urlNode(`/${p.slug}`, "0.85"))
    .join("\n");

  return wrapUrlSet(entries);
}

/* -------------------------------------------------------------
   5. BUILD LOCATION SITEMAP (CITIES + ZONES)
------------------------------------------------------------- */
function buildLocationSitemap(locMeta) {
  const cityEntries = locMeta.cities
    .map((city) => urlNode(`/${city}`, "0.80"))
    .join("\n");

  const zoneEntries = Object.entries(locMeta.zones)
    .flatMap(([city, zones]) =>
      [...zones].map((zone) => urlNode(`/${city}/${zone}`, "0.75"))
    )
    .join("\n");

  return wrapUrlSet(cityEntries + "\n" + zoneEntries);
}

/* -------------------------------------------------------------
   6. BUILD BUILDERS SITEMAP
------------------------------------------------------------- */
function buildBuildersSitemap(builders) {
  const entries = builders
    .map((b) => urlNode(`/builder/${b}`, "0.60"))
    .join("\n");

  return wrapUrlSet(entries);
}

/* -------------------------------------------------------------
   XML WRAPPERS
------------------------------------------------------------- */
function wrapUrlSet(content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content}
</urlset>`;
}

function wrapSitemapIndex(files) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (file) => `
  <sitemap>
    <loc>${DOMAIN}/${file}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;
}

/* -------------------------------------------------------------
   OUTPUT
------------------------------------------------------------- */
function generate() {
  const slugs = getProjectSlugs();
  const locMeta = extractCityZone();
  const builders = getBuilders();

  if (!fs.existsSync("dist")) fs.mkdirSync("dist");

  fs.writeFileSync("dist/sitemap-projects.xml", buildProjectSitemap(slugs));
  fs.writeFileSync("dist/sitemap-locations.xml", buildLocationSitemap(locMeta));
  fs.writeFileSync("dist/sitemap-builders.xml", buildBuildersSitemap(builders));

  const indexXml = wrapSitemapIndex([
    "sitemap-projects.xml",
    "sitemap-locations.xml",
    "sitemap-builders.xml",
  ]);

  fs.writeFileSync("dist/sitemap.xml", indexXml);

  console.log("-------------------------------------------------");
  console.log("📄  SITEMAPS GENERATED");
  console.log(`📌 Projects: ${slugs.length}`);
  console.log(`📌 Cities: ${locMeta.cities.length}`);
  console.log(
    `📌 Zones: ${Object.values(locMeta.zones).reduce(
      (a, z) => a + z.size,
      0
    )}`
  );
  console.log(`📌 Builders: ${builders.length}`);
  console.log("-------------------------------------------------\n");
}

generate();
