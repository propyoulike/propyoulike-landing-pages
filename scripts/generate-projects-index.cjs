#!/usr/bin/env node

/**
 * Recursively scan all projects and generate projects-index.json
 */

const fs = require("fs");
const path = require("path");

const PROJECTS_DIR = path.join(__dirname, "../src/content/projects");
const OUTPUT_FILE = path.join(__dirname, "../src/data/projects-index.json");

// Detect all config.json files recursively
function findProjectConfigs(dir, results = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      findProjectConfigs(full, results);
    } else if (item.name === "config.json") {
      results.push(full);
    }
  }
  return results;
}

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
    const configFiles = findProjectConfigs(PROJECTS_DIR);
    const projects = [];

    for (const configPath of configFiles) {
      const raw = fs.readFileSync(configPath, "utf8");
      const project = JSON.parse(raw);

      projects.push({
        slug: project.slug,
        name: project.projectName || project.name,
        builder: project.builder,
        locality: project.locality || null,
        type: project.type || null,
        heroImage: extractHeroImage(project),
        priceRange: extractPriceRange(project),
        status: project.status || "Upcoming",
      });
    }

    projects.sort((a, b) => a.name.localeCompare(b.name));

    // Ensure output folder exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    console.log(`\n✅ Generated projects index (${projects.length} project${projects.length === 1 ? "" : "s"})`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("\n❌ Error generating projects index:", err);
    process.exit(1);
  }
}

generateProjectsIndex();
