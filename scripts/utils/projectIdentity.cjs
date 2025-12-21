/**
 * Shared project identity + guards (MUST-HAVES ONLY)
 */

function getProjectIdentity(data) {
  const slug = data?.project?.slug || data?.slug;
  const builder = data?.project?.builder || data?.builder;

  if (!slug || !builder) return null;

  return {
    slug,
    builder,
    publicSlug: `${builder}-${slug}`,
  };
}

/**
 * Enforce MUST-HAVE invariants
 */
function enforceProjectGuards(projects) {
  const publicSlugSet = new Set();

  for (const p of projects) {
    // 1️⃣ Public URL uniqueness
    if (publicSlugSet.has(p.publicSlug)) {
      throw new Error(
        `❌ Duplicate public URL detected: /${p.publicSlug}`
      );
    }
    publicSlugSet.add(p.publicSlug);

    // 2️⃣ Filename must match public URL
    if (p.fileName && p.fileName !== `${p.publicSlug}.json`) {
      throw new Error(
        `❌ Filename mismatch:\n` +
        `   Expected: ${p.publicSlug}.json\n` +
        `   Found:    ${p.fileName}`
      );
    }
  }
}

module.exports = {
  getProjectIdentity,
  enforceProjectGuards,
};
