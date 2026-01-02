/**
 * INTERNAL LINK INJECTOR (SAFE)
 *
 * - Pure HTML injection
 * - No React
 * - No data mutation
 * - Deterministic
 */

const fs = require("fs");
const path = require("path");
const {
  getProjectIdentity,
} = require("./utils/projectIdentity.cjs");

const PROJECTS_DIR = path.resolve("src/content/projects");
const DIST_DIR = path.resolve("dist");

function collectProjects() {
  const map = new Map();

  for (const builder of fs.readdirSync(PROJECTS_DIR)) {
    const dir = path.join(PROJECTS_DIR, builder);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;

      const raw = JSON.parse(
        fs.readFileSync(path.join(dir, file), "utf8")
      );

      const identity = getProjectIdentity(raw);
      if (!identity) continue;

      if (!map.has(builder)) map.set(builder, []);
      map.get(builder).push(identity);
    }
  }

  return map;
}

function renderLinks(project, siblings) {
  const others = siblings
    .filter((p) => p.publicSlug !== project.publicSlug)
    .slice(0, 4);

  return `
<nav aria-label="Breadcrumb">
  <a href="/">Home</a> →
  <a href="/${project.builder}/">${project.builder}</a> →
  <span>${project.projectName}</span>
</nav>

<section>
  <h3>Other ${project.builder} projects</h3>
  <ul>
    ${others
      .map(
        (p) =>
          `<li><a href="/${p.publicSlug}/">${p.projectName}</a></li>`
      )
      .join("")}
  </ul>
</section>
`;
}

function inject() {
  const projectsByBuilder = collectProjects();

  for (const [builder, projects] of projectsByBuilder.entries()) {
    for (const project of projects) {
      const file = path.join(
        DIST_DIR,
        project.publicSlug,
        "index.html"
      );

      if (!fs.existsSync(file)) continue;

      const html = fs.readFileSync(file, "utf8");
      if (!html.includes("<!--__INTERNAL_LINKS__-->")) continue;

      const injected = html.replace(
        "<!--__INTERNAL_LINKS__-->",
        renderLinks(project, projects)
      );

      fs.writeFileSync(file, injected);
      console.log(`✓ links injected: ${project.publicSlug}`);
    }
  }
}

inject();
