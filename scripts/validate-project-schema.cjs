/**
 * ============================================================
 * PROJECT SCHEMA VALIDATION (LOCKED, FILE-BASED)
 * ============================================================
 *
 * RULES
 * ------------------------------------------------------------
 * - ONLY project pages are validated
 * - Project page URL shape:
 *     /<builder>-<project>/index.html
 * - Builder hub pages (e.g. /provident/) are EXCLUDED
 *
 * REQUIRED SCHEMA ON PROJECT PAGES
 * ------------------------------------------------------------
 * - Residence (mandatory)
 * - Offer (optional, but if present must be valid)
 *
 * ============================================================
 */

const fs = require("fs");
const path = require("path");

const DIST = path.resolve("dist");

/* ============================================================
   HELPERS
============================================================ */

function fail(msg) {
  console.error(`❌ PROJECT SCHEMA FAILED: ${msg}`);
  process.exit(1);
}

function read(rel) {
  return fs.readFileSync(path.join(DIST, rel), "utf8");
}

/**
 * A project page MUST look like:
 *   provident-botanico/index.html
 *
 * Builder hubs look like:
 *   provident/index.html
 */
function isProjectPage(dirName) {
  return dirName.includes("-");
}

/* ============================================================
   DISCOVER PROJECT PAGES ONLY
============================================================ */

const skipDirs = ["assets", "legal", "shared", ".vite", "images"];

const pages = fs
  .readdirSync(DIST, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      !skipDirs.includes(d.name) &&
      isProjectPage(d.name)
  )
  .map((d) => `${d.name}/index.html`)
  .filter((p) => fs.existsSync(path.join(DIST, p)));

if (pages.length === 0) {
  fail("No project pages found");
}

/* ============================================================
   VALIDATE EACH PROJECT PAGE
============================================================ */

pages.forEach((rel) => {
  const html = read(rel);

  const scripts = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi
  );

  if (!scripts) {
    fail(`Missing JSON-LD on ${rel}`);
  }

  let schemas = [];

  try {
    schemas = scripts.map((tag) =>
      JSON.parse(tag.replace(/^[\s\S]*?>|<\/script>$/g, ""))
    );
  } catch (e) {
    fail(`Invalid JSON-LD format on ${rel}`);
  }

  /* ----------------------------
     Residence (MANDATORY)
  ----------------------------- */
  const residence = schemas.find((s) => s["@type"] === "Residence");

  if (!residence) {
    fail(`Missing Residence schema on ${rel}`);
  }

  if (!residence.name || !residence.address) {
    fail(`Invalid Residence schema on ${rel}`);
  }

  /* ----------------------------
     Offer (OPTIONAL)
  ----------------------------- */
  const offer = schemas.find((s) => s["@type"] === "Offer");

  if (offer) {
    if (!offer.price || !offer.priceCurrency) {
      fail(`Invalid Offer schema on ${rel}`);
    }
  }
});

console.log("✅ Project schema validation passed");
