/**
 * Simple prerender: creates /dist/<slug>/index.html
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------
// Scan project slugs
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
// Ensure dist exists
// ---------------------------------------------
if (!fs.existsSync("dist")) {
  console.error("❌ dist/ folder missing. Run Vite build first.");
  process.exit(1);
}

// ---------------------------------------------
// Load base project template
// ---------------------------------------------
const baseTemplatePath = path.resolve("dist/project.html");
if (!fs.existsSync(baseTemplatePath)) {
  console.error("❌ dist/project.html missing! Build failed?");
  process.exit(1);
}

const html = fs.readFileSync(baseTemplatePath, "utf8");

// ---------------------------------------------
// Generate output pages
// ---------------------------------------------
slugs.forEach((slug) => {
  const outDir = path.resolve(`dist/${slug}`);
  const outFile = path.join(outDir, "index.html");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
  outFile,
  html.replace(
    "<!--__PROJECT_ENTRY__-->",
    `<script type="module" src="../projectEntry.js"></script>`
  )
);


  console.log(`✓ Prerendered: /${slug}/index.html`);
});

console.log(`\n✨ Completed prerender of ${slugs.length} project page(s).`);
