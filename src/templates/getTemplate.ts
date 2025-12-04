// src/lib/templates/getTemplate.ts

import ApartmentDefault from "@/templates/default/ApartmentDefault";
import VillaDefault from "@/templates/default/VillaDefault";
import PlotDefault from "@/templates/default/PlotDefault";

// Auto-import builder-specific templates
const builderTemplates = import.meta.glob(
  "/src/templates/builders/*/*.tsx",
  { eager: true }
);

/**
 * Resolves template:
 * 1. Builder-specific (preferred)
 * 2. Default type-based fallback
 */
export function getTemplate(builder: string, type: string) {
  const lowerBuilder = builder?.toLowerCase() ?? "";
  const lowerType = type?.toLowerCase() ?? "";

  const expectedName = `${capitalize(lowerType)}${capitalize(lowerBuilder)}`;
  const expectedPath = `/src/templates/builders/${lowerBuilder}/${expectedName}.tsx`;

  // 1. Try builder-specific
  if (builderTemplates[expectedPath]) {
    return (builderTemplates[expectedPath] as any).default;
  }

  // 2. Default fallback
  return getDefaultTemplate(lowerType);
}

/** Default fallback template by project type */
function getDefaultTemplate(type: string) {
  switch (type) {
    case "apartment":
      return ApartmentDefault;
    case "villa":
      return VillaDefault;
    case "plot":
      return PlotDefault;
    default:
      console.warn("❗ Unknown project type, returning null:", type);
      return null;
  }
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
