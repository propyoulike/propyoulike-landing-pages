const { execSync } = require("node:child_process");

function step(name, cmd) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`▶ ${name}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  execSync(cmd, {
    stdio: "inherit",
    env: process.env,
  });
}

try {
  /* ------------------------------
     1. Base build
  ------------------------------- */
  step("Vite build (BigRock mode)", "vite build --mode bigrock");

  /* ------------------------------
     2. Page generation
  ------------------------------- */
  step(
    "Generate prerendered project pages",
    "node scripts/generate-prerender-pages.cjs"
  );

  step(
    "Generate builder pages",
    "node scripts/generate-builder-pages.cjs"
  );

  step(
    "Generate legal pages (static entry points)",
    "node scripts/generate-legal-pages.cjs"
  );

  /* ------------------------------
     3. SEO post-processing
  ------------------------------- */
  step(
    "Inject internal links",
    "node scripts/inject-internal-links.cjs"
  );

  step(
    "Generate sitemap",
    "node scripts/generate-sitemap.cjs"
  );

  step(
    "Copy sitemap into dist",
    process.platform === "win32"
      ? "copy public\\sitemap.xml dist\\sitemap.xml"
      : "cp public/sitemap.xml dist/sitemap.xml"
  );

  /* ------------------------------
     4. HARD STOP VALIDATION
  ------------------------------- */
  step(
    "Pre-flight validation (legal, builders, SEO)",
    "node scripts/preflight-validate-dist.cjs"
  );

  step(
    "Canonical & OG validation",
    "node scripts/validate-canonical-og.cjs"
  );

  step(
    "Builder schema validation",
    "node scripts/validate-builder-schema.cjs"
  );

  step(
    "Project schema validation",
    "node scripts/validate-project-schema.cjs"
  );

  /* ------------------------------
     SUCCESS
  ------------------------------- */
  console.log("\n✅ DEPLOY BUILD COMPLETE");
  console.log("➡️ Upload ONLY the /dist folder using WinSCP");
} catch (e) {
  console.error("\n❌ DEPLOY BUILD FAILED");
  process.exit(1);
}
