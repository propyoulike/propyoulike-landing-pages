/**
 * scripts/generate-prerender-pages.cjs
 *
 * ============================================================
 * STATIC PRERENDER (SEO + DATA ONLY)
 * ============================================================
 *
 * 🔒 HARD RULES (LOCKED — NON-NEGOTIABLE)
 * ------------------------------------------------------------
 * 1. Prerenders ONLY:
 *    - SEO <head> metadata
 *    - Serialized project payload (JSON)
 *
 * 2. NEVER:
 *    - Imports React
 *    - Renders UI
 *    - Mutates section data at runtime
 *
 * 3. Runtime JS is injected via Vite manifest
 *    - No hardcoded filenames
 *    - Hash-safe
 *
 * If this script throws → BUILD MUST FAIL
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const {
  getProjectIdentity,
  enforceProjectGuards,
} = require("./utils/projectIdentity.cjs");

/* ============================================================
   PATHS (EXPLICIT — NO MAGIC)
============================================================ */

const PROJECTS_DIR = path.resolve("src/content/projects");
const BUILDERS_DIR = path.resolve("src/content/builders");
const GLOBAL_DIR = path.resolve("src/content/global");

const DIST_DIR = path.resolve("dist");
const TEMPLATE_PATH = path.resolve("project.html");
const MANIFEST_PATH = path.join(DIST_DIR, ".vite", "manifest.json");

/* ============================================================
   TEMPLATE LOAD (FAIL FAST)
============================================================ */

if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error("❌ project.html template missing");
}

const TEMPLATE = fs.readFileSync(TEMPLATE_PATH, "utf8");

if (!TEMPLATE.includes("__PROJECT_JSON__")) {
  throw new Error("❌ project.html missing __PROJECT_JSON__ placeholder");
}

if (!TEMPLATE.includes("<!--__PROJECT_ENTRY__-->")) {
  throw new Error(
    "❌ project.html missing <!--__PROJECT_ENTRY__--> placeholder"
  );
}

/* ============================================================
   MANIFEST LOAD (CRITICAL)
============================================================ */

if (!fs.existsSync(MANIFEST_PATH)) {
  throw new Error(
    "❌ Vite manifest missing at dist/.vite/manifest.json. Run vite build first."
  );
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const projectEntryFile =
  manifest["src/projectEntry.tsx"]?.file;

if (!projectEntryFile) {
  throw new Error(
    "❌ src/projectEntry.tsx not found in Vite manifest"
  );
}

console.log("✓ Using project entry:", projectEntryFile);

/* ============================================================
   JSON SAFE LOAD
============================================================ */

function readJSONIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/* ============================================================
   FAQ MERGE (BUILD-TIME, DATA ONLY)
============================================================ */

function mergeFaqs({ builder, projectSlug }) {
  const globalBlock =
    readJSONIfExists(path.join(GLOBAL_DIR, "faq.json"))?.faqs ?? [];

  const builderBlock =
    readJSONIfExists(
      path.join(BUILDERS_DIR, builder, "builder_faq.json")
    )?.faqs ?? [];

  const projectBlock =
    readJSONIfExists(
      path.join(
        PROJECTS_DIR,
        builder,
        `${builder}-${projectSlug}.json`
      )
    )?.faq ?? {};

  const projectFaqs = projectBlock.faqs ?? [];

  if (
    !Array.isArray(globalBlock) ||
    !Array.isArray(builderBlock) ||
    !Array.isArray(projectFaqs)
  ) {
    throw new Error(
      `❌ FAQ arrays invalid for ${builder}/${projectSlug}`
    );
  }

  const map = new Map();

  for (const f of globalBlock) map.set(f.question, f);
  for (const f of builderBlock) map.set(f.question, f);
  for (const f of projectFaqs) map.set(f.question, f);

  return {
    meta: projectBlock.meta ?? {
      eyebrow: "FAQ",
      title: "Frequently Asked Questions",
      subtitle:
        "Everything you should know before buying this home",
    },
    faqs: Array.from(map.values()),
  };
}

/* ============================================================
   SEO (STATIC, SAFE)
============================================================ */

function buildSEO(project) {
  const { projectName, city, publicSlug } = project;

  if (!projectName || !city || !publicSlug) {
    throw new Error(
      `❌ SEO identity incomplete for ${projectName || "UNKNOWN"}`
    );
  }

  return `
<title>${projectName} | ${city} | Price, Floor Plans, Brochure</title>
<meta name="description" content="Explore ${projectName} pricing, floor plans, amenities." />
<link rel="canonical" href="https://propyoulike.com/${publicSlug}" />
`;
}

/* ============================================================
   PROJECT DISCOVERY
============================================================ */

function getProjects() {
  const payloads = [];

  for (const builder of fs.readdirSync(PROJECTS_DIR)) {
    const builderDir = path.join(PROJECTS_DIR, builder);
    if (!fs.statSync(builderDir).isDirectory()) continue;

    for (const file of fs.readdirSync(builderDir)) {
      if (!file.endsWith(".json")) continue;

      const raw = JSON.parse(
        fs.readFileSync(path.join(builderDir, file), "utf8")
      );

      const identity = getProjectIdentity(raw);
      if (!identity) {
        throw new Error(
          `❌ Invalid project identity in ${builder}/${file}`
        );
      }

      const payload = {
        ...raw,
        project: identity,
        faq: mergeFaqs({
          builder,
          projectSlug: identity.slug,
        }),
        __sourceFile: `${builder}/${file}`,
      };

      delete payload.slug;
      delete payload.builder;
      delete payload.projectName;
      delete payload.city;

      payloads.push(payload);
    }
  }

  enforceProjectGuards(payloads.map((p) => p.project));
  return payloads;
}

/* ============================================================
   SERIALIZATION
============================================================ */

function serialize(payload) {
  try {
    return JSON.stringify(payload);
  } catch {
    throw new Error(
      `❌ Failed to serialize ${payload.project.projectName}`
    );
  }
}

/* ============================================================
   PRERENDER
============================================================ */

for (const payload of getProjects()) {
  const html = TEMPLATE
    .replace("<!--__SOCIAL_META__-->", buildSEO(payload.project))
    .replace("__PROJECT_JSON__", serialize(payload))
    .replace(
      "<!--__PROJECT_ENTRY__-->",
      `<script type="module" src="/${projectEntryFile}"></script>`
    );

  const outDir = path.join(DIST_DIR, payload.project.publicSlug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);

  console.log(`✓ prerendered /${payload.project.publicSlug}`);
}

/* ============================================================
   END OF FILE — DO NOT EXTEND
============================================================ */
