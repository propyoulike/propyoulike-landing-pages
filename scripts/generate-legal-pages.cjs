const fs = require("fs");
const path = require("path");

const DIST = path.resolve("dist");
const INDEX_HTML = path.join(DIST, "index.html");
const LEGAL_DIR = path.join(DIST, "legal");

const LEGAL_PAGES = [
  "about",
  "contact",
  "privacy",
  "terms",
  "rera",
];

function fail(msg) {
  console.error(`❌ LEGAL PAGE GENERATION FAILED: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(INDEX_HTML)) {
  fail("dist/index.html not found. Run vite build first.");
}

const indexHtml = fs.readFileSync(INDEX_HTML, "utf8");

LEGAL_PAGES.forEach((slug) => {
  const dir = path.join(LEGAL_DIR, slug);
  fs.mkdirSync(dir, { recursive: true });

  const target = path.join(dir, "index.html");
  fs.writeFileSync(target, indexHtml);
});

console.log("✅ Legal pages generated (SPA shell reused)");
