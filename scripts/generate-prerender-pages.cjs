#!/usr/bin/env node

/**
 * Recursive pre-render of project pages with OG tags
 */

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "../dist");
const CONTENT_DIR = path.join(__dirname, "../src/content/projects");
const BASE_HTML = path.join(DIST_DIR, "index.html");
const BASE_URL = "https://propyoulike.com";

/* ------------------------------------- */
/* Utilities                             */
/* ------------------------------------- */

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

/* ------------------------------------- */
/* Meta Generator                        */
/* ------------------------------------- */

function generateMetaTags(project) {
  const title = escapeHtml(project.projectName || project.name);
  const desc = escapeHtml(project.description || "Premium real estate project");
  const ogImage = absolutize(extractOgImage(project));
  const canonicalUrl = `${BASE_URL}/projects/${project.slug}`;

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

/* ------------------------------------- */
/* Recursive Project Scanner             */
/* ------------------------------------- */

function findConfigFiles(dir, results = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      findConfigFiles(full, results);
    } else if (item.name === "config.json") {
      results.push(full);
    }
  }
  return results;
}

/* ------------------------------------- */
/* Main Render                           */
/* ------------------------------------- */

function prerender() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ No dist folder. Build first.");
    process.exit(1);
  }

  let baseHtml = fs.readFileSync(BASE_HTML, "utf8");

  if (!baseHtml.includes("<!--__SOCIAL_META__-->")) {
    console.error("❌ Missing placeholder <!--__SOCIAL_META__--> in index.html");
    process.exit(1);
  }

  const configPaths = findConfigFiles(CONTENT_DIR);
  let count = 0;

  for (const configPath of configPaths) {
    const project = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const metaTags = generateMetaTags(project);

    const renderedHtml = baseHtml.replace("<!--__SOCIAL_META__-->", metaTags);

    const projectDir = path.join(DIST_DIR, "projects", project.slug);
    fs.mkdirSync(projectDir, { recursive: true });

    fs.writeFileSync(path.join(projectDir, "index.html"), renderedHtml);

    console.log(`✓ Pre-rendered: ${project.slug}`);
    count++;
  }

  console.log(`\n✨ Completed prerender of ${count} project ${count === 1 ? "page" : "pages"}.`);
  console.log("📁 Output: dist/projects/<slug>/index.html");
}

prerender();
