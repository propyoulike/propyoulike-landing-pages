// src/utils/resolveSectionProps.ts

/**
 * ============================================================
 * resolveSectionProps
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Resolves a section's props config into runtime props
 * - Acts as the SINGLE data-wiring layer for all sections
 *
 * INPUTS
 * ------------------------------------------------------------
 * - propsConfig : declarative config from sections.config
 * - project     : normalized, flat project identity object
 * - ctx         : runtime context (menuItems, CTA handlers, payload)
 * - resolved    : optional precomputed/global resolved data
 *
 * OUTPUT
 * ------------------------------------------------------------
 * - Plain object of resolved props passed to a section component
 *
 * ============================================================
 *
 * DESIGN PRINCIPLES
 * ------------------------------------------------------------
 * 1. SINGLE SOURCE OF TRUTH
 *    All prop resolution happens HERE — nowhere else
 *
 * 2. EXPLICIT RESOLUTION RULES
 *    No guessing, no implicit fallbacks
 *
 * 3. PURE & DETERMINISTIC
 *    Same inputs → same outputs
 *
 * 4. SECTION-AGNOSTIC
 *    This function does NOT know about Hero, Summary, etc.
 *
 * 5. FAIL SILENTLY AT LEAF, LOUDLY AT ROOT
 *    - Missing values resolve to undefined
 *    - Sections decide how to handle absence
 *
 * ============================================================
 */

/* ------------------------------------------------------------
   Utilities
------------------------------------------------------------ */

/**
 * Safely resolves a dotted path on an object.
 *
 * Example:
 *   getValueFromPath(obj, "hero.meta.title")
 */
function getValueFromPath(obj: any, path: string) {
  if (!obj || !path) return undefined;

  return path
    .split(".")
    .reduce(
      (acc, key) => (acc != null ? acc[key] : undefined),
      obj
    );
}

/* ------------------------------------------------------------
   Core Value Resolver
------------------------------------------------------------ */

/**
 * Resolves a single config value into a runtime value.
 *
 * SUPPORTED SYNTAX
 * ------------------------------------------------------------
 * 1. Literal override
 *    { "$value": 123 }
 *
 * 2. Context reference
 *    "$ctx.menuItems"
 *
 * 3. Resolved/global reference
 *    "$resolved.builder.theme"
 *
 * 4. Project reference
 *    "project.projectName"
 *
 * 5. Arrays (resolved recursively)
 *
 * 6. Objects (resolved recursively)
 */
function resolveValue(
  value: any,
  project: any,
  ctx: any,
  resolved: any
): any {
  /* ----------------------------------------------------------
     1. Literal override
  ---------------------------------------------------------- */
  if (
    typeof value === "object" &&
    value !== null &&
    "$value" in value
  ) {
    return value.$value;
  }

  /* ----------------------------------------------------------
     2. Context reference ($ctx.*)
  ---------------------------------------------------------- */
  if (
    typeof value === "string" &&
    value.startsWith("$ctx.")
  ) {
    return getValueFromPath(ctx, value.slice(5));
  }

  /* ----------------------------------------------------------
     3. Resolved/global reference ($resolved.*)
  ---------------------------------------------------------- */
  if (
    typeof value === "string" &&
    value.startsWith("$resolved.")
  ) {
    return getValueFromPath(resolved, value.slice(10));
  }

  /* ----------------------------------------------------------
     4. Project reference (project.*)
  ---------------------------------------------------------- */
  if (
    typeof value === "string" &&
    value.startsWith("$payload.")
  ) {
    return getValueFromPath(resolved, value.slice(9));
  }

  /* ----------------------------------------------------------
     5. Array (recursive)
  ---------------------------------------------------------- */
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        resolveValue(v, project, ctx, resolved)
      )
      .filter((v) => v !== undefined);
  }

  /* ----------------------------------------------------------
     6. Object (recursive)
  ---------------------------------------------------------- */
  if (
    typeof value === "object" &&
    value !== null
  ) {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      const rv = resolveValue(
        v,
        project,
        ctx,
        resolved
      );
      if (rv !== undefined) out[k] = rv;
    }
    return out;
  }

  /* ----------------------------------------------------------
     7. Primitive passthrough
  ---------------------------------------------------------- */
  return value;
}

/* ------------------------------------------------------------
   Main Resolver
------------------------------------------------------------ */

/**
 * Resolves a section's props config into runtime props.
 *
 * SPECIAL FEATURE
 * ------------------------------------------------------------
 * - Spread support:
 *     "...hero" → spreads project.hero into props
 *
 * NOTE:
 * - Spreads ONLY read from project
 * - No deep merging is performed
 */
export function resolveSectionProps(
  propsConfig: Record<string, any> = {},
  project: any,
  ctx: any,
  resolved: any,
  sectionId?: string
) {
  const resolvedProps: any = {};

  for (const [key, value] of Object.entries(propsConfig)) {
    /* --------------------------------------------------------
       Spread support (...hero, ...faq, etc.)
    -------------------------------------------------------- */
    if (key.startsWith("...")) {
      const path = key.slice(3);
      const spreadObj = getValueFromPath(project, path);

      if (
        spreadObj &&
        typeof spreadObj === "object"
      ) {
        Object.assign(resolvedProps, spreadObj);
      } else {
        console.warn(
          `⚠️ Spread failed for section "${sectionId}":`,
          path,
          spreadObj
        );
      }
      continue;
    }

    /* --------------------------------------------------------
       Normal value resolution
    -------------------------------------------------------- */
    const resolvedValue = resolveValue(
      value,
      project,
      ctx,
      resolved
    );

    if (resolvedValue !== undefined) {
      resolvedProps[key] = resolvedValue;
    }
  }

  return resolvedProps;
}
