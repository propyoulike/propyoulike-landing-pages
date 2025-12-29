/**
 * ============================================================
 * resolveSectionProps
 * ============================================================
 * SINGLE data-wiring layer for all section components
 * ============================================================
 */

/* ------------------------------------------------------------
   Utilities
------------------------------------------------------------ */

/**
 * Safely resolves a dotted path on an object.
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
 */
function resolveValue(
  value: any,
  project: any,
  ctx: any,
  resolved: any
): any {
  /* 1️⃣ Literal override */
  if (
    typeof value === "object" &&
    value !== null &&
    "$value" in value
  ) {
    return value.$value;
  }

  /* 2️⃣ Context reference */
  if (
    typeof value === "string" &&
    value.startsWith("$ctx.")
  ) {
    return getValueFromPath(ctx, value.slice(5));
  }

  /* 3️⃣ Resolved/global reference */
  if (
    typeof value === "string" &&
    value.startsWith("$resolved.")
  ) {
    return getValueFromPath(resolved, value.slice(10));
  }

  /* 4️⃣ Payload reference */
  if (
    typeof value === "string" &&
    value.startsWith("$payload.")
  ) {
    return getValueFromPath(resolved, value.slice(9));
  }

  /* 5️⃣ Arrays (recursive) */
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        resolveValue(v, project, ctx, resolved)
      )
      .filter((v) => v !== undefined);
  }

  /* 6️⃣ Objects (recursive) */
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

  /* 7️⃣ Primitive passthrough */
  return value;
}

/* ------------------------------------------------------------
   Main Resolver
------------------------------------------------------------ */

export function resolveSectionProps(
  propsConfig: Record<string, any> = {},
  project: any,
  ctx: any,
  resolved: any,
  sectionId?: string
) {
  const resolvedProps: any = {};

  /* --------------------------------------------------------
     1️⃣ Inject cross-cutting runtime props (EXPLICIT)
  -------------------------------------------------------- */
  if (ctx?.analytics) {
    resolvedProps.analytics = ctx.analytics;
  }

  if (ctx?.openCTA) {
    resolvedProps.openCTA = ctx.openCTA;
  }

  if (ctx?.menuItems) {
    resolvedProps.menuItems = ctx.menuItems;
  }

  /* --------------------------------------------------------
     2️⃣ Resolve section-authored props
  -------------------------------------------------------- */
  for (const [key, value] of Object.entries(propsConfig)) {
    /* Spread support */
    if (key.startsWith("...")) {
      const path = key.slice(3);
      const spreadObj = getValueFromPath(project, path);

      if (spreadObj && typeof spreadObj === "object") {
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
