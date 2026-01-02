/**
 * ============================================================
 * BUILDER HUB PAGE GENERATOR (LOCKED, FILE-BASED)
 * ============================================================
 *
 * RULES
 * ------------------------------------------------------------
 * - Builders are derived from folder names in src/content/projects
 * - Builder hub MUST be created if folder exists
 * - Projects are added ONLY if identity is valid
 * - No empty ItemList schema allowed
 *
 * OUTPUT
 * ------------------------------------------------------------
 * dist/{builder}/index.html
 *
 * ============================================================
 */

const fs = require("fs");
const path = require("path");
const { getProjectIdentity } = require("./utils/projectIdentity.cjs");

const PROJECTS_DIR = path.resolve("src/content/projects");
const DIST_DIR = path.resolve("dist");
const DOMAIN = "https://propyoulike.com";

/* ============================================================
   DISCOVER BUILDERS + PROJECTS
============================================================ */

function getBuilders() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error("❌ src/content/projects does not exist");
  }

  const builders = new Map();

  const builderDirs = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const builder of builderDirs) {
    const builderDir = path.join(PROJECTS_DIR, builder);
    const files = fs.readdirSync(builderDir).filter((f) =>
      f.endsWith(".json")
    );

    builders.set(builder, {
      builder,
      name: builder,
      description: `Explore all ${builder} projects with pricing, floor plans and site visit assistance.`,
      projects: [],
    });

    for (const file of files) {
      const raw = JSON.parse(
        fs.readFileSync(path.join(builderDir, file), "utf8")
      );

      // 🔑 NORMALIZE SHAPE (nested OR flat)
      const identity = getProjectIdentity(
        raw.project ? raw.project : raw
      );

      if (identity) {
        builders.get(builder).projects.push(identity);
      }
    }
  }

  return Array.from(builders.values());
}

/* ============================================================
   HTML RENDER (SCHEMA-SAFE)
============================================================ */

function renderHTML({ builder, name, description, projects }) {
  const title = `${name} Projects in Bengaluru | PropYouLike`;
  const canonical = `${DOMAIN}/${builder}/`;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": canonical,
    "brand": name,
  };

  const itemListSchema =
    projects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": projects.map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": p.projectName || p.slug,
            "url": `${DOMAIN}/${p.publicSlug}/`,
          })),
        }
      : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />

<title>${title}</title>
<meta name="description" content="${description}" />

<link rel="canonical" href="${canonical}" />
<meta name="robots" content="index, follow" />

<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}" />

<!-- Schema.org -->
<script type="application/ld+json">
${JSON.stringify(orgSchema)}
</script>

${
  itemListSchema
    ? `<script type="application/ld+json">
${JSON.stringify(itemListSchema)}
</script>`
    : ""
}

</head>
<body>

<h1>${name} Projects</h1>
<p>${description}</p>

<ul>
${
  projects.length > 0
    ? projects
        .map(
          (p) =>
            `<li><a href="/${p.publicSlug}/">${p.projectName || p.slug}</a></li>`
        )
        .join("\n")
    : `<li>Projects coming soon</li>`
}
</ul>

</body>
</html>`;
}

/* ============================================================
   GENERATE
============================================================ */

function generate() {
  const builders = getBuilders();

  if (builders.length === 0) {
    throw new Error("❌ No builders found");
  }

  for (const b of builders) {
    const outDir = path.join(DIST_DIR, b.builder);
    fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
      path.join(outDir, "index.html"),
      renderHTML(b)
    );

    console.log(`✓ builder page /${b.builder}/`);
  }
}

generate();
