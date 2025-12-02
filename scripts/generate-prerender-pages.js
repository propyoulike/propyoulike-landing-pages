#!/usr/bin/env node

/**
 * Pre-render project pages with OG tags
 * Run AFTER: npm run build
 */

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.join(__dirname, "../dist");
const PROJECTS_DIR = path.join(__dirname, "../src/content/projects");
const BASE_HTML = path.join(DIST_DIR, "index.html");
const BASE_URL = "https://propyoulike.com";

/* ------------ UTILITIES ------------ */

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

/* ------------ META GENERATION ------------ */

function generateMetaTags(project) {
  const title = escapeHtml(project.name);
  const desc = escapeHtml(project.description || "Premium real estate project in Bangalore");
  const ogImage = absolutize(extractOgImage(project));
  const canonicalUrl = `${BASE_URL}/projects/${project.slug}`;

  let meta = `
    <title>${title} | PropYouLike</title>
    <meta name="description" content="${desc}">
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="PropYouLike">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${ogImage}">
  `;

  if (project.shareVideo) {
    const videoUrl = absolutize(project.shareVideo);
    meta += `
    <!-- Video Preview -->
    <meta property="og:video" content="${videoUrl}">
    <meta property="og:video:secure_url" content="${videoUrl}">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    `;
  }

  if (project.seo?.index === false) {
    meta += `<meta name="robots" content="noindex,nofollow">`;
  }

  return meta.trim();
}

/* ------------ MAIN SCRIPT ------------ */

function prerenderProjectPages() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ No dist folder. Run build first.");
    process.exit(1);
  }

  let baseHtml = fs.readFileSync(BASE_HTML, "utf8");

  if (!baseHtml.includes("<!--__SOCIAL_META__-->")) {
    console.error("❌ Missing placeholder <!--__SOCIAL_META__--> in index.html");
    process.exit(1);
  }

  const projectFiles = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));

  projectFiles.forEach((file) => {
    const project = JSON.parse(
      fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8")
    );

    const metaTags = generateMetaTags(project);

    const projectHtml = baseHtml.replace("<!--__SOCIAL_META__-->", metaTags);

    const projectDir = path.join(DIST_DIR, "projects", project.slug);
    fs.mkdirSync(projectDir, { recursive: true });

    fs.writeFileSync(path.join(projectDir, "index.html"), projectHtml);

    console.log(`✅ Pre-rendered: ${project.slug}`);
  });

  console.log(`\n✨ Completed prerender of ${projectFiles.length} project pages.`);
  console.log("📁 Output: dist/projects/<slug>/index.html");
}

prerenderProjectPages();
