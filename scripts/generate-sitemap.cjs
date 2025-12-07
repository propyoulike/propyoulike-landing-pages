/**
 * NEW ROOT-LEVEL SITEMAP GENERATOR (CommonJS version)
 */

const fs = require("fs");
const path = require("path");

const DOMAIN = "https://propyoulike.com";

// ---------------------------------------------
// Scan project folders
// ---------------------------------------------
function getProjectSlugs() {
  const base = path.resolve("src/content/projects");
  const slugs = [];

  for (const builder of fs.readdirSync(base)) {
    const builderDir = path.join(base, builder);
    if (!fs.statSync(builderDir).isDirectory()) continue;

    for (const projectSlug of fs.readdirSync(builderDir)) {
      const projectDir = path.join(builderDir, projectSlug);

      if (fs.existsSync(path.join(projectDir, "index.json"))) {
        slugs.push(`${builder}-${projectSlug}`);
      }
    }
  }

  return slugs;
}

const slugs = getProjectSlugs();

// ---------------------------------------------
// Build sitemap XML
// ---------------------------------------------
const projectEntries = slugs
  .map(
    (slug) => `
  <url>
    <loc>${DOMAIN}/${slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join("\n");

const projectSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${projectEntries}
</urlset>
`;

const rootSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <sitemap>
    <loc>${DOMAIN}/sitemap-projects.xml</loc>
  </sitemap>
</sitemapindex>
`;

if (!fs.existsSync("dist")) fs.mkdirSync("dist");

fs.writeFileSync("dist/sitemap-projects.xml", projectSitemapXml);
fs.writeFileSync("dist/sitemap.xml", rootSitemapXml);

console.log("📄 Generated sitemap.xml + sitemap-projects.xml");
console.log(`📌 Found ${slugs.length} projects\n`);
