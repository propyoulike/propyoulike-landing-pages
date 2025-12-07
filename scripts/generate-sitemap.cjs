#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://propyoulike.com";
const INDEX_FILE = path.join(__dirname, "../src/data/projects-index.json");
const DIST_DIR = path.join(__dirname, "../dist");

const BATCH_SIZE = 50;

function escape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// Load projects index
function loadProjects() {
  if (!fs.existsSync(INDEX_FILE)) return [];
  return JSON.parse(fs.readFileSync(INDEX_FILE, "utf8"));
}

// Write XML to dist
function writeXml(filename, content) {
  fs.writeFileSync(path.join(DIST_DIR, filename), content);
  console.log(`📁 Generated: ${filename}`);
}

// Build URL from project entry
function urlFor(p) {
  return `${BASE_URL}/projects/${p.builder}-${p.slug}`;
}

// Build sitemap chunks
function generateProjectSitemaps(projects) {
  const chunks = [];

  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    chunks.push(projects.slice(i, i + BATCH_SIZE));
  }

  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
`;

  chunks.forEach((chunk, i) => {
    const filename = `sitemap-projects-${i + 1}.xml`;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
`;

    chunk.forEach((p) => {
      xml += `
  <url>
    <loc>${escape(urlFor(p))}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>
`;
    });

    xml += `</urlset>\n`;
    writeXml(filename, xml);

    indexXml += `
  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
  </sitemap>
`;
  });

  indexXml += `</sitemapindex>\n`;
  writeXml("sitemap.xml", indexXml);
}

// Main
(function () {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ dist not found. Run build first.");
    process.exit(1);
  }

  const projects = loadProjects();
  generateProjectSitemaps(projects);
  console.log(`\n📌 Sitemap generation complete (${projects.length} URLs)`);
})();
