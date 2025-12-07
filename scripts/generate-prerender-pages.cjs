#!/usr/bin/env node

/**
 * Pre-render project pages with:
 * - SEO meta tags
 * - Static Hero HTML (for better crawl & conversion)
 *
 * Output:
 *   dist/projects/<builder>-<slug>/index.html
 *
 * Example:
 *   builder: "provident"
 *   slug: "sunworth-city"
 *   => /projects/provident-sunworth-city
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://propyoulike.com"; // domain stays propyoulike.com, BigRock is just hosting
const DIST_DIR = path.join(__dirname, "../dist");
const CONTENT_DIR = path.join(__dirname, "../src/content/projects");
const BASE_HTML = path.join(DIST_DIR, "index.html");

const META_PLACEHOLDER = "<!--__SOCIAL_META__-->";
const HERO_PLACEHOLDER = "<!--__HERO_HTML__-->";

/* ---------- Utils ---------- */

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absolutize(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BASE_URL + url;
  return `${BASE_URL}/${url}`;
}

function extractOgImage(project) {
  return (
    project.ogImage ||
    project.heroImage ||
    project.hero?.image ||
    project.bannerImage ||
    (project.gallery?.length ? project.gallery[0] : null) ||
    `${BASE_URL}/default-og.jpg`
  );
}

/* ---------- Generate META tags ---------- */

function generateMetaTags(project, routeSegment) {
  const title = escapeHtml(project.projectName || project.name || "");
  const desc = escapeHtml(
    project.description ||
      `Explore ${project.projectName || ""} by ${project.builder || ""}${
        project.locality ? " in " + project.locality : ""
      }.`
  );
  const ogImage = absolutize(extractOgImage(project));
  const canonicalUrl = `${BASE_URL}/projects/${routeSegment}`;

  return `
<title>${title} | PropYouLike</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonicalUrl}" />

<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="PropYouLike">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImage}">
`.trim();
}

/* ---------- Generate Hero HTML (SEO-focused) ---------- */

function generateHeroHtml(project) {
  const title = escapeHtml(project.projectName || project.name || "");
  const builder = escapeHtml(project.builder || "");
  const locality = escapeHtml(project.locality || project.location || "");
  const priceRange = escapeHtml(project.priceRange || "");
  const reraId = escapeHtml(project.reraId || "");

  return `
<section id="seo-hero" class="seo-hero">
  <div class="seo-hero-inner">
    <h1 class="seo-hero-title">${title}</h1>
    <p class="seo-hero-subtitle">
      ${builder ? `by ${builder}` : ""}${builder && locality ? " · " : ""}${
    locality ? locality : ""
  }
    </p>
    ${
      priceRange
        ? `<p class="seo-hero-price">Price range: ${priceRange}</p>`
        : ""
    }
    ${reraId ? `<p class="seo-hero-rera">RERA ID: ${reraId}</p>` : ""}
  </div>
</section>
`.trim();
}

/* ---------- Recursive config.json finder ---------- */

function findConfigFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findConfigFiles(full, results);
    } else if (entry.name === "config.json") {
      results.push(full);
    }
  }

  return results;
}

/* ---------- Main prerender ---------- */

function prerenderProjectPages() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ No dist folder. Run build first.");
    process.exit(1);
  }

  let baseHtml = fs.readFileSync(BASE_HTML, "utf8");

  if (!baseHtml.includes(META_PLACEHOLDER)) {
    console.error(`❌ Missing placeholder ${META_PLACEHOLDER} in index.html`);
    process.exit(1);
  }

  if (!baseHtml.includes(HERO_PLACEHOLDER)) {
    console.warn(
      `⚠️ Missing placeholder ${HERO_PLACEHOLDER} in index.html – Hero HTML will NOT be inlined.`
    );
  }

  const configPaths = findConfigFiles(CONTENT_DIR);
  let count = 0;

  for (const configPath of configPaths) {
    const project = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Route: /projects/<builder>-<slug>
    const routeSegment = project.builder
      ? `${project.builder}-${project.slug}`
      : project.slug;

    const metaTags = generateMetaTags(project, routeSegment);
    const heroHtml = generateHeroHtml(project);

    let pageHtml = baseHtml.replace(META_PLACEHOLDER, metaTags);

    if (pageHtml.includes(HERO_PLACEHOLDER)) {
      pageHtml = pageHtml.replace(HERO_PLACEHOLDER, heroHtml);
    }

    const outDir = path.join(DIST_DIR, "projects", routeSegment);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), pageHtml);

    console.log(`✓ Pre-rendered: /projects/${routeSegment}`);
    count++;
  }

  console.log(
    `\n✨ Completed prerender of ${count} project page${
      count === 1 ? "" : "s"
    }.`
  );
  console.log("📁 Output: dist/projects/<builder>-<slug>/index.html");
}

prerenderProjectPages();
