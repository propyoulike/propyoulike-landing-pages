/**
 * scripts/deploy.cjs
 *
 * ============================================================
 * FULL DEPLOY PIPELINE (BUILD → PRERENDER → VALIDATE → DEPLOY)
 * ============================================================
 *
 * RULES (LOCKED)
 * ------------------------------------------------------------
 * - dist/ is the ONLY deployable artifact
 * - Deployment MUST run only after ALL validations pass
 * - Fail fast on any error
 * - No partial deploys
 *
 * ============================================================
 */

const { execSync } = require("node:child_process");
const path = require("node:path");

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
  /* ============================================================
     1. BASE BUILD
  ============================================================ */
  step(
    "Vite build (BigRock mode)",
    "vite build --mode bigrock"
  );

  /* ============================================================
     2. STATIC PAGE GENERATION
  ============================================================ */
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

  /* ============================================================
     3. SEO POST-PROCESSING
  ============================================================ */
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

  /* ============================================================
     4. HARD STOP VALIDATION (MUST PASS)
  ============================================================ */
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

  /* ============================================================
     5. DEPLOYMENT (WINDOWS: BIGROCK VIA WINSCP)
  ============================================================ */
  if (process.platform === "win32") {
    const deployScript = path.resolve(
      "scripts",
      "deploy-bigrock.bat"
    );

    step(
      "Deploy dist/ to BigRock (WinSCP sync)",
      `"${deployScript}"`
    );
  } else {
    console.log("\n⚠️ Deployment skipped (non-Windows platform)");
    console.log("➡️ Upload /dist manually if required");
  }

  /* ============================================================
     SUCCESS
  ============================================================ */
  console.log("\n✅ DEPLOY PIPELINE COMPLETE");
  console.log("🌍 Site is LIVE (dist synced to BigRock)");
} catch (e) {
  console.error("\n❌ DEPLOY PIPELINE FAILED");
  process.exit(1);
}
