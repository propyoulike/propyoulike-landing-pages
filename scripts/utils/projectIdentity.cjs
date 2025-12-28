/**
 * ============================================================
 * PROJECT IDENTITY (LOCKED) + GLOBAL GUARDS
 * ============================================================
 *
 * PURPOSE
 * ------------------------------------------------------------
 * - Derive the canonical, immutable project identity
 * - Enforce global URL + filename invariants
 * - Fail FAST during build if any project is invalid
 *
 * THIS FILE IS A HARD CONTRACT
 * ------------------------------------------------------------
 * - Identity is DERIVED, never authored
 * - Identity fields are IMMUTABLE
 * - Identity MUST live at: data.project
 * - No defaults, no guessing, no legacy support
 *
 * If this file throws, the build MUST fail.
 *
 * ============================================================
 */

/* ============================================================
   IDENTITY DERIVATION (SINGLE SOURCE OF TRUTH)
============================================================ */

/**
 * Extract canonical project identity.
 *
 * REQUIRED input shape:
 * ------------------------------------------------------------
 * {
 *   project: {
 *     slug: string,
 *     builder: string,
 *     projectName?: string,
 *     city?: string
 *   }
 * }
 *
 * Any other shape is INVALID.
 */
function getProjectIdentity(data) {
  console.log("────────────────────────────────────");
  console.log("🧪 getProjectIdentity() called");
  console.log("🧪 raw data keys:", data && Object.keys(data));

  if (!data || typeof data !== "object") {
    console.error("❌ data is not an object:", data);
    return null;
  }

  if (!data.project || typeof data.project !== "object") {
    console.error("❌ data.project missing or invalid:", data.project);
    return null;
  }

  console.log("🧪 project keys:", Object.keys(data.project));
  console.log("🧪 project snapshot:", data.project);

  const { slug, builder, type, projectName, city } = data.project;

  console.log("🧪 identity fields:", {
    slug,
    builder,
    type,
    projectName,
    city,
  });

  if (
    typeof slug !== "string" ||
    typeof builder !== "string" ||
    typeof type !== "string"
  ) {
    console.error("❌ Identity field validation failed", {
      slugType: typeof slug,
      builderType: typeof builder,
      typeType: typeof type,
    });
    return null;
  }

  /**
   * 🔒 CANONICAL PUBLIC SLUG (DERIVED)
   *
   * RULE:
   * - publicSlug is NEVER authored
   * - ALWAYS derived as `${builder}-${slug}`
   */
  const publicSlug = `${builder}-${slug}`;

  console.log("✅ Derived identity:", {
    slug,
    builder,
    type,
    publicSlug,
  });

  return {
    /* ----------------------------
       🔒 LOCKED IDENTITY
    ----------------------------- */
    slug,
    builder,
    type,
    publicSlug,

    /* ----------------------------
       🟢 READ-ONLY SEO FIELDS
    ----------------------------- */
    projectName,
    city,
  };
}

/* ============================================================
   GLOBAL INVARIANT ENFORCEMENT
============================================================ */

/**
 * Enforce must-have invariants across ALL projects.
 *
 * RULES (NON-NEGOTIABLE):
 * ------------------------------------------------------------
 * 1. Every project MUST have a publicSlug
 * 2. publicSlug MUST be globally unique
 * 3. JSON filename MUST match `${publicSlug}.json`
 *
 * Any violation MUST crash the build.
 */
function enforceProjectGuards(projects) {
  if (!Array.isArray(projects)) {
    throw new Error("❌ enforceProjectGuards expects an array");
  }

  const publicSlugSet = new Set();

  for (const p of projects) {
    /* --------------------------------------------------------
       1️⃣ publicSlug existence
    --------------------------------------------------------- */
    if (!p.publicSlug) {
      throw new Error(
        `❌ Missing publicSlug for project: ${p.projectName || "UNKNOWN"}`
      );
    }

    /* --------------------------------------------------------
       2️⃣ publicSlug uniqueness
    --------------------------------------------------------- */
    if (publicSlugSet.has(p.publicSlug)) {
      throw new Error(
        `❌ Duplicate public URL detected: /${p.publicSlug}`
      );
    }

    publicSlugSet.add(p.publicSlug);

    /* --------------------------------------------------------
       3️⃣ Filename ↔ URL invariant
    --------------------------------------------------------- */
    if (p.fileName && p.fileName !== `${p.publicSlug}.json`) {
      throw new Error(
        `❌ Filename mismatch detected\n` +
        `   Expected: ${p.publicSlug}.json\n` +
        `   Found:    ${p.fileName}`
      );
    }
  }
}

/* ============================================================
   EXPORTS (LOCKED)
============================================================ */

module.exports = {
  getProjectIdentity,
  enforceProjectGuards,
};
