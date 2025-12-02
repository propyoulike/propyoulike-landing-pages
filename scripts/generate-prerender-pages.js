#!/usr/bin/env node

/**
 * Script to pre-render project pages with OG meta tags for social sharing
 * Run: node scripts/generate-prerender-pages.js
 * 
 * This should be run AFTER the build process
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const PROJECTS_DIR = path.join(__dirname, '../src/content/projects');
const BASE_HTML = path.join(DIST_DIR, 'index.html');

function generateMetaTags(project) {
  const baseUrl = 'https://propyoulike.com';
  const ogImage = project.ogImage || project.heroImage || `${baseUrl}/default-og.jpg`;
  
  let metaTags = `
    <title>${project.name} | PropYouLike</title>
    <meta name="description" content="${project.description}">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${project.name}">
    <meta property="og:description" content="${project.description}">
    <meta property="og:url" content="${baseUrl}/projects/${project.slug}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="PropYouLike">
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${project.name}">
    <meta name="twitter:description" content="${project.description}">
    <meta name="twitter:image" content="${ogImage}">
  `;
  
  // Add video preview if available
  if (project.shareVideo) {
    metaTags += `
    <!-- Video Preview Tags -->
    <meta property="og:video" content="${project.shareVideo}">
    <meta property="og:video:secure_url" content="${project.shareVideo}">
    <meta property="og:video:type" content="text/html">
    <meta property="og:video:width" content="1280">
    <meta property="og:video:height" content="720">
    `;
  }
  
  return metaTags;
}

function prerenderProjectPages() {
  try {
    // Check if dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      console.error('❌ Dist directory not found. Run build first!');
      process.exit(1);
    }
    
    // Read base HTML
    const baseHtml = fs.readFileSync(BASE_HTML, 'utf8');
    
    // Read all project JSONs
    const projectFiles = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
    
    projectFiles.forEach(file => {
      const filePath = path.join(PROJECTS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const project = JSON.parse(content);
      
      // Generate meta tags
      const metaTags = generateMetaTags(project);
      
      // Replace placeholder in HTML
      let projectHtml = baseHtml.replace('<!--__SOCIAL_META__-->', metaTags);
      
      // Create project directory in dist
      const projectDir = path.join(DIST_DIR, 'projects', project.slug);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      // Write project-specific HTML
      const outputPath = path.join(projectDir, 'index.html');
      fs.writeFileSync(outputPath, projectHtml);
      
      console.log(`✅ Pre-rendered: ${project.slug}`);
    });
    
    console.log(`\n✨ Successfully pre-rendered ${projectFiles.length} project pages`);
    console.log('📁 Output: dist/projects/[slug]/index.html');
    
  } catch (error) {
    console.error('❌ Error pre-rendering pages:', error);
    process.exit(1);
  }
}

prerenderProjectPages();
