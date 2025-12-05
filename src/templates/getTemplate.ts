// ------------------------------------------------------
// Template Resolver
// ------------------------------------------------------
// Purpose:
// 1. Auto-detect and load a template based on builder + project type
// 2. Prefer builder-specific templates
// 3. Fall back to default templates based on type
// ------------------------------------------------------

import ApartmentDefault from "@/templates/default/ApartmentDefault";
import VillaDefault from "@/templates/default/VillaDefault";
import PlotDefault from "@/templates/default/PlotDefault";

// ------------------------------------------------------
// Auto-import ALL builder-specific templates (eagerly)
// File structure expected:
//
// /src/templates/builders/{builder}/{Type}{Builder}.tsx
// Example: /src/templates/builders/provident/ApartmentProvident.tsx
//
// import.meta.glob (Vite) loads these files into a map:
// {
//   "/src/templates/builders/provident/ApartmentProvident.tsx": module
// }
// ------------------------------------------------------
const builderTemplates = import.meta.glob(
  "/src/templates/builders/*/*.tsx",
  { eager: true }
);

// ------------------------------------------------------
// Main Template Resolver
// ------------------------------------------------------
// Rules:
// A) Try builder-specific component
// B) Fallback to default template by type
// ------------------------------------------------------
export function getTemplate(builder: string, type: string) {
  const lowerBuilder = builder?.toLowerCase() ?? "";
  const lowerType = type?.toLowerCase() ?? "";

  // Expected naming convention:
  //   type: apartment → Apartment
  //   builder: provident → Provident
  const expectedName = `${capitalize(lowerType)}${capitalize(lowerBuilder)}`;

  // Expected path of the builder template:
  const expectedPath = `/src/templates/builders/${lowerBuilder}/${expectedName}.tsx`;

  // --------------------------------------------------
  // A) Load builder-specific template if present
  // --------------------------------------------------
  if (builderTemplates[expectedPath]) {
    return (builderTemplates[expectedPath] as any).default;
  }

  // --------------------------------------------------
  // B) Else fallback to default template by type
  // --------------------------------------------------
  return getDefaultTemplate(lowerType);
}

// ------------------------------------------------------
// Default Templates Fallback
// ------------------------------------------------------
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

// ------------------------------------------------------
// Utility: Capitalize the first letter
// ------------------------------------------------------
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
