#!/usr/bin/env node

/**
 * Script to generate projects-index.json from all project JSON files
 * Run: node scripts/generate-projects-index.js
 */

const fs = require("fs");
const path = require("path");

const PROJECTS_DIR = path.join(__dirname, "../src/content/projects");
const OUTPUT_FILE = path.join(__dirname, "../src/data/projects-index.json");

function extractPriceRange(project) {
  if (project.priceRange) return String(project.priceRange);

  if (Array.isArray(project.configurations)) {
    const prices = project.configurations
      .map((c) => c.price)
      .filter(Boolean)
      .map((p) => String(p).trim());

    if (prices.length >= 2) {
      return `${prices[0]} - ${prices[prices.length - 1]}`;
    }
    if (prices.length === 1) return prices[0];
  }

  return null;
}

function extractHeroImage(project) {
  return (
    project.heroImage ||
    project.hero?.image ||
    project.bannerImage ||
    (project.gallery?.length ? project.gallery[0] : null)
  );
}

function generateProjectsIndex() {
  try {
    const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));

    const projects = files.map((file) => {
      const filePath = path.join(PROJECTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf8");
      const project = JSON.parse(content);

      return {
        slug: project.slug,
        name: project.name,
        builder: project.builder,
        locality: project.locality,
        type: project.type,
        heroImage: extractHeroImage(project),
        priceRange: extractPriceRange(project),
        status: project.status || "Upcoming",
      };
    });

    // Sort projects alphabetically by name
    projects.sort((a, b) => a.name.localeCompare(b.name));

    // Ensure dir exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    console.log(`✅ Generated projects index (${projects.length} projects)`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("❌ Error generating projects index:", err);
    process.exit(1);
  }
}

generateProjectsIndex();
