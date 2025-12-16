// src/utils/resolveSectionProps.ts

function getValueFromPath(obj: any, path: string) {
  return path
    .split(".")
    .reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function resolveValue(value: any, project: any, ctx: any): any {
  if (typeof value === "object" && value !== null && "$value" in value) {
    return value.$value;
  }

  if (typeof value === "string" && value.startsWith("$ctx.")) {
    return getValueFromPath(ctx, value.slice(5));
  }

  if (typeof value === "string" && value.startsWith("project.")) {
    return getValueFromPath(project, value.slice(8));
  }

  if (Array.isArray(value)) {
    return value
      .map(v => resolveValue(v, project, ctx))
      .filter(v => v !== undefined);
  }

  if (typeof value === "object" && value !== null) {
    const resolved: any = {};
    Object.entries(value).forEach(([k, v]) => {
      const rv = resolveValue(v, project, ctx);
      if (rv !== undefined) resolved[k] = rv;
    });
    return resolved;
  }

  return value;
}

export function resolveSectionProps(
  propsConfig: Record<string, any> = {},
  project: any,
  ctx: any,
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

    const resolvedValue = resolveValue(value, project, ctx);

    if (resolvedValue !== undefined) {
      resolvedProps[key] = resolvedValue;
    }
  }

  return resolvedProps;
}
