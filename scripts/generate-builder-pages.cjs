/**
 * ============================================================
 * BUILDER HUB PAGE GENERATOR (LOCKED, FILE-BASED, SEO-SAFE)
 * ============================================================
 */

const fs = require("fs");
const path = require("path");
const { getProjectIdentity } = require("./utils/projectIdentity.cjs");

/* ============================================================
   CONFIG
============================================================ */

const PROJECTS_DIR = path.resolve("src/content/projects");
const DIST_DIR = path.resolve("dist");
const DOMAIN = "https://propyoulike.com";

/* Human-friendly builder names (SEO critical) */
const BUILDER_DISPLAY_NAMES = {
  urbanrise: "Urbanrise",
  puravankara: "Puravankara",
  purva: "Purva by Puravankara",
  provident: "Provident Housing",
};

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

    const displayName =
      BUILDER_DISPLAY_NAMES[builder] ||
      builder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    builders.set(builder, {
      builder,
      displayName,
      description: `Explore all ${displayName} projects in Bengaluru with pricing, floor plans, and assisted site visits.`,
      projects: [],
      hero: null, // derived from first valid project
    });

    for (const file of files) {
      const raw = JSON.parse(
        fs.readFileSync(path.join(builderDir, file), "utf8")
      );

      const project = raw.project ? raw.project : raw;
      const identity = getProjectIdentity(project);

      if (identity) {
        builders.get(builder).projects.push(identity);

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
  if (hero?.videoId) {
    return `https://img.youtube.com/vi/${hero.videoId}/maxresdefault.jpg`;
  }

  if (hero?.images?.length) {
    return hero.images[0];
  }

  return null;
}

/* ============================================================
   HTML RENDER (SEO + SCHEMA COMPLETE)
============================================================ */

function renderHTML({ builder, displayName, description, projects, hero }) {
  const title = `${displayName} Projects in Bengaluru | PropYouLike`;
  const canonical = `${DOMAIN}/${builder}/`;
  const ogImage = resolveOgImage(hero);

  /* ---------- SCHEMAS ---------- */

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: displayName,
    url: canonical,
    brand: displayName,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: DOMAIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${displayName} Projects`,
        item: canonical,
      },
    ],
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

  /* ---------- HTML ---------- */

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="robots" content="index, follow" />

<link rel="canonical" href="${canonical}" />

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
${JSON.stringify(organizationSchema)}
</script>

<script type="application/ld+json">
${JSON.stringify(breadcrumbSchema)}
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

<header>
  <h1>${displayName} Projects in Bengaluru</h1>
  <p>${description}</p>
</header>

<main>
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
</main>

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

  for (const builderData of builders) {
    const outDir = path.join(DIST_DIR, builderData.builder);
    fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
      path.join(outDir, "index.html"),
      renderHTML(builderData)
    );

    console.log(`✓ builder page generated → /${builderData.builder}/`);
  }
}

generate();
