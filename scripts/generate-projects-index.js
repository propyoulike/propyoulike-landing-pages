#!/usr/bin/env node

/**
 * Script to generate projects-index.json from all project JSON files
 * Run: node scripts/generate-projects-index.js
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '../src/content/projects');
const OUTPUT_FILE = path.join(__dirname, '../src/data/projects-index.json');

function generateProjectsIndex() {
  try {
    // Read all JSON files from projects directory
    const files = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
    
    const projects = files.map(file => {
      const filePath = path.join(PROJECTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const project = JSON.parse(content);
      
      // Extract essential information for the index
      return {
        slug: project.slug,
        name: project.name,
        builder: project.builder,
        locality: project.locality,
        type: project.type,
        heroImage: project.heroImage,
        priceRange: project.priceRange || project.configurations?.[0]?.price,
        status: project.status || 'Upcoming',
      };
    });
    
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the index file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    
    console.log(`✅ Generated projects index with ${projects.length} projects`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('❌ Error generating projects index:', error);
    process.exit(1);
  }
}

generateProjectsIndex();
