/**
 * scripts/generate-prerender-pages.cjs
 *
 * ============================================================
 * STATIC PRERENDER (SEO + DATA ONLY)
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const {
  getProjectIdentity,
  enforceProjectGuards,
} = require("./utils/projectIdentity.cjs");

/* ============================================================
   PATHS
============================================================ */

const PROJECTS_DIR = path.resolve("src/content/projects");
const BUILDERS_DIR = path.resolve("src/content/builders");
const GLOBAL_DIR = path.resolve("src/content/global");

const DIST_DIR = path.resolve("dist");
const TEMPLATE_PATH = path.resolve("project.html");
const MANIFEST_PATH = path.join(DIST_DIR, ".vite", "manifest.json");
const ORIGIN = "https://propyoulike.com";

/* ============================================================
   TEMPLATE
============================================================ */

if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error("❌ project.html template missing");
}

const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, "utf8");

if (!TEMPLATE.includes("__PROJECT_JSON__")) {
  throw new Error("❌ project.html missing __PROJECT_JSON__");
}

if (!TEMPLATE.includes("<!--__PROJECT_ENTRY__-->")) {
  throw new Error("❌ project.html missing <!--__PROJECT_ENTRY__-->");
}

/* ============================================================
   MANIFEST
============================================================ */

if (!fs.existsSync(MANIFEST_PATH)) {
  throw new Error("❌ Vite manifest missing");
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const projectEntryFile = manifest["src/projectEntry.tsx"]?.file;

if (!projectEntryFile) {
  throw new Error("❌ projectEntry not found in manifest");
}

console.log("✓ Using project entry:", projectEntryFile);

/* ============================================================
   HELPERS
============================================================ */

function readJSONIfExists(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/* ============================================================
   FAQ MERGE
============================================================ */

function mergeFaqs({ builder, projectSlug }) {
  const globalFaqs =
    readJSONIfExists(path.join(GLOBAL_DIR, "faq.json"))?.faqs ?? [];

  const builderFaqs =
    readJSONIfExists(
      path.join(BUILDERS_DIR, builder, "builder_faq.json")
    )?.faqs ?? [];

  const projectFaqs =
    readJSONIfExists(
      path.join(PROJECTS_DIR, builder, `${builder}-${projectSlug}.json`)
    )?.faq?.faqs ?? [];

  return {
    meta: {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Everything you should know before buying this home",
    },
    faqs: [...globalFaqs, ...builderFaqs, ...projectFaqs],
  };
}

/* ============================================================
   SEO META
============================================================ */

function resolveOgImage(payload, publicSlug) {
  if (payload?.hero?.videoId) {
    return `https://img.youtube.com/vi/${payload.hero.videoId}/maxresdefault.jpg`;
  }

  if (payload?.hero?.images?.length) {
    return payload.hero.images[0];
  }

  return `/images/projects/${publicSlug}/og.jpg`;
}

function buildSEO(project, payload) {
  const { projectName, city, zone, locality, area, publicSlug } = project;

  const title = `${projectName} | ${city} | ${zone} | ${locality} | ${area}`;
  const description = `Explore ${projectName} pricing, floor plans, amenities and location.`;

  const ogImage = resolveOgImage(payload, publicSlug);
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : ORIGIN + ogImage;

  return `
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${ORIGIN}/${publicSlug}/" />

<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${ORIGIN}/${publicSlug}/" />
<meta property="og:image" content="${ogImageUrl}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${ogImageUrl}" />
`;
}

/* ============================================================
   PROJECT SCHEMA (THE MISSING PIECE)
============================================================ */

function buildProjectSchema(project) {
  const residence = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.projectName,
    url: `${ORIGIN}/${project.publicSlug}/`,
    address: {
      "@type": "PostalAddress",
      addressLocality: project.locality,
      addressRegion: project.city,
      postalCode: project.pincode,
      addressCountry: "IN",
    },
  };

  return `
<script type="application/ld+json">
${JSON.stringify(residence)}
</script>
`;
}

/* ============================================================
   PROJECT DISCOVERY
============================================================ */

function getProjects() {
  const payloads = [];

  for (const builder of fs.readdirSync(PROJECTS_DIR)) {
    const dir = path.join(PROJECTS_DIR, builder);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;

      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      const identity = getProjectIdentity(raw.project ?? raw);

      if (!identity) {
        throw new Error(`❌ Invalid project identity in ${builder}/${file}`);
      }

      payloads.push({
        ...raw,
        project: identity,
        faq: mergeFaqs({
          builder,
          projectSlug: identity.slug,
        }),
      });
    }
  }

  enforceProjectGuards(payloads.map(p => p.project));
  return payloads;
}

/* ============================================================
   PRERENDER
============================================================ */

for (const payload of getProjects()) {
  const html = TEMPLATE
    .replace(
      "<!--__SOCIAL_META__-->",
      buildSEO(payload.project, payload) +
        buildProjectSchema(payload.project)
    )
    .replace("__PROJECT_JSON__", JSON.stringify(payload))
    .replace(
      "<!--__PROJECT_ENTRY__-->",
      `<script type="module" src="/${projectEntryFile}"></script>`
    );

  const outDir = path.join(DIST_DIR, payload.project.publicSlug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);

  console.log(`✓ prerendered /${payload.project.publicSlug}`);
}

console.log("✅ Project prerender complete");
