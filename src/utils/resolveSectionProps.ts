// src/utils/resolveSectionProps.ts

function getValueFromPath(obj: any, path: string) {
  return path
    .split(".")
    .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function resolveValue(
  value: any,
  project: any,
  ctx: any,
  resolved: any
): any {
  // Literal override
  if (typeof value === "object" && value !== null && "$value" in value) {
    return value.$value;
  }

  // Context values
  if (typeof value === "string" && value.startsWith("$ctx.")) {
    return getValueFromPath(ctx, value.slice(5));
  }

  // Resolved (global / builder / project normalized)
  if (typeof value === "string" && value.startsWith("$resolved.")) {
    return getValueFromPath(resolved, value.slice(10));
  }

  // Direct project access
  if (typeof value === "string" && value.startsWith("project.")) {
    return getValueFromPath(project, value.slice(8));
  }

  // Arrays
  if (Array.isArray(value)) {
    return value
      .map((v) => resolveValue(v, project, ctx, resolved))
      .filter((v) => v !== undefined);
  }

  // Objects
  if (typeof value === "object" && value !== null) {
    const out: any = {};
    Object.entries(value).forEach(([k, v]) => {
      const rv = resolveValue(v, project, ctx, resolved);
      if (rv !== undefined) out[k] = rv;
    });
    return out;
  }

  return value;
}

export function resolveSectionProps(
  propsConfig: Record<string, any> = {},
  project: any,
  ctx: any,
  resolved: any,
  sectionId?: string
) {
  const resolvedProps: any = {};

  for (const [key, value] of Object.entries(propsConfig)) {

    // 🔥 spread support (...faq, ...hero, etc.)
    if (key.startsWith("...")) {
      const path = key.slice(3);
      const spreadObj = getValueFromPath(project, path);

      if (spreadObj && typeof spreadObj === "object") {
        Object.assign(resolvedProps, spreadObj);
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
