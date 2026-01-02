/**
 * ============================================================
 * PROJECT IDENTITY (LOCKED)
 * ============================================================
 *
 * RULES
 * ------------------------------------------------------------
 * - Identity is DERIVED, never authored
 * - publicSlug = `${builder}-${slug}`
 * - JSON shape is FLAT
 *
 * REQUIRED FIELDS
 * ------------------------------------------------------------
 * - slug (string)
 * - builder (string)
 *
 * OPTIONAL FIELDS
 * ------------------------------------------------------------
 * - type
 * - projectName
 * - city, zone, locality, area, pincode
 *
 * ============================================================
 */

function getProjectIdentity(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const {
    slug,
    builder,
    type,
    projectName,
    city,
    zone,
    locality,
    area,
    pincode,
  } = data;

  // 🔒 HARD REQUIREMENTS (ONLY THESE)
  if (
    typeof slug !== "string" ||
    typeof builder !== "string"
  ) {
    return null;
  }

  // 🔒 CANONICAL PUBLIC SLUG
  const publicSlug = `${builder}-${slug}`;

  return {
    // LOCKED IDENTITY
    slug,
    builder,
    publicSlug,

    // OPTIONAL METADATA
    type,
    projectName,
    city,
    zone,
    locality,
    area,
    pincode,
  };
}

/* ============================================================
   GLOBAL GUARDS
============================================================ */

function enforceProjectGuards(projects) {
  if (!Array.isArray(projects)) {
    throw new Error("❌ enforceProjectGuards expects an array");
  }

  const seen = new Set();

  for (const p of projects) {
    if (!p || !p.publicSlug) {
      throw new Error("❌ Project missing publicSlug");
    }

    if (seen.has(p.publicSlug)) {
      throw new Error(
        `❌ Duplicate project publicSlug detected: ${p.publicSlug}`
      );
    }

    seen.add(p.publicSlug);
  }
}

module.exports = {
  getProjectIdentity,
  enforceProjectGuards,
};
