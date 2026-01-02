const fs = require("fs");
const path = require("path");

const DIST = path.resolve("dist");
const PROJECTS_SRC = path.resolve("src/content/projects");

function fail(msg) {
  console.error(`❌ SCHEMA FAILED: ${msg}`);
  process.exit(1);
}

function read(rel) {
  return fs.readFileSync(path.join(DIST, rel), "utf8");
}

// builder slugs = directories in src/content/projects
const builderSlugs = fs
  .readdirSync(PROJECTS_SRC, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

builderSlugs.forEach((slug) => {
  const rel = `${slug}/index.html`;
  const html = read(rel);

  const jsonLdMatches = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  );

  if (!jsonLdMatches || jsonLdMatches.length < 2) {
    fail(`Missing JSON-LD schemas on builder: /${slug}`);
  }

  const schemas = jsonLdMatches.map(tag =>
    JSON.parse(tag.replace(/^[\s\S]*?>|<\/script>$/g, ""))
  );

  const org = schemas.find(s => s["@type"] === "Organization");
  const list = schemas.find(s => s["@type"] === "ItemList");

  if (!org) fail(`Missing Organization schema on /${slug}`);
  if (!list) fail(`Missing ItemList schema on /${slug}`);

  if (!Array.isArray(list.itemListElement) || list.itemListElement.length === 0) {
    fail(`Empty ItemList on /${slug}`);
  }
});

console.log("✅ Builder schema validation passed");
