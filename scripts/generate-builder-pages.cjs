/**
 * ============================================================
 * BUILDER HUB PAGE GENERATOR (LOCKED, FILE-BASED)
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
      hero: null, // 👈 optional, derived from first valid project
    });

    for (const file of files) {
      const raw = JSON.parse(
        fs.readFileSync(path.join(builderDir, file), "utf8")
      );

      const project = raw.project ? raw.project : raw;
      const identity = getProjectIdentity(project);

      if (identity) {
        builders.get(builder).projects.push(identity);

        // 👇 Capture hero ONCE (first valid project)
        if (!builders.get(builder).hero && project.hero) {
          builders.get(builder).hero = project.hero;
        }
      }
    }
  }

  return Array.from(builders.values());
}

/* ============================================================
   OG IMAGE RESOLVER (NO HOSTING)
============================================================ */

function resolveOgImage(hero) {
  // 1️⃣ YouTube thumbnail (preferred)
  if (hero?.videoId) {
    return `https://img.youtube.com/vi/${hero.videoId}/maxresdefault.jpg`;
  }

  // 2️⃣ Hero image
  if (hero?.images?.length) {
    return hero.images[0];
  }

  return null;
}

/* ============================================================
   HTML RENDER (SCHEMA-SAFE)
============================================================ */

function renderHTML({ builder, name, description, projects, hero }) {
  const title = `${name} Projects in Bengaluru | PropYouLike`;
  const canonical = `${DOMAIN}/${builder}/`;

  const ogImage = resolveOgImage(hero);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: canonical,
    brand: name,
  };

  const itemListSchema =
    projects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: projects.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.projectName || p.slug,
            url: `${DOMAIN}/${p.publicSlug}/`,
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

${
  ogImage
    ? `
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:secure_url" content="${ogImage}" />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="720" />
<meta property="og:image:type" content="image/jpeg" />`
    : ""
}

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
