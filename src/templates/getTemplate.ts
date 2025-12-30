import ApartmentDefault from "@/templates/default/ApartmentDefault";
import VillaDefault from "@/templates/default/VillaDefault";
import PlotDefault from "@/templates/default/PlotDefault";

import { runtimeLog } from "@/lib/log/runtimeLog";

/* ------------------------------------------------------
   Builder Template Registry (Vite, eager)
------------------------------------------------------ */
const builderTemplates = import.meta.glob(
  "/src/templates/builders/*/*.tsx",
  { eager: true }
) as Record<string, any>;

/* ------------------------------------------------------
   Normalization maps (STRICT)
------------------------------------------------------ */
const TYPE_MAP: Record<string, string> = {
  apartment: "apartment",
  flat: "apartment",

  villa: "villa",
  villament: "villa",

  plot: "plot",
  land: "plot",
};

/* ======================================================
   MAIN RESOLVER
====================================================== */
export function getTemplate(builder: string, type: string) {
  /* ---------------- HARD GUARD ---------------- */
  if (!builder || !type) {
    runtimeLog("TemplateResolver", "fatal", "Missing builder or type", {
      builder,
      type,
    });
    throw new Error("TemplateResolver: builder and type are required"); // 🔧 CHANGED
  }

  /* ---------------- NORMALIZATION ---------------- */
  const normalizedBuilder = builder.toLowerCase().trim();
  const normalizedTypeRaw = type.toLowerCase().trim();
  const normalizedType = TYPE_MAP[normalizedTypeRaw];

  if (!normalizedType) {
    runtimeLog("TemplateResolver", "fatal", "Unsupported project type", {
      builder: normalizedBuilder,
      type,
    });
    throw new Error(`Unsupported project type: ${type}`); // 🔧 CHANGED
  }

  /* ---------------- NAMING CONVENTION ---------------- */
  const componentName =
    pascal(normalizedType) + pascal(normalizedBuilder); // 🔧 CHANGED

  const expectedPath =
    `/src/templates/builders/${normalizedBuilder}/${componentName}.tsx`;

  /* ---------------- BUILDER TEMPLATE ---------------- */
  const builderTemplate = builderTemplates[expectedPath];

  if (builderTemplate?.default) {
    runtimeLog("TemplateResolver", "debug", "Builder template resolved", {
      builder: normalizedBuilder,
      type: normalizedType,
      template: componentName,
    });

    return builderTemplate.default;
  }

  /* ---------------- DEFAULT FALLBACK ---------------- */
  const fallback = getDefaultTemplate(normalizedType);

  if (!fallback) {
    runtimeLog("TemplateResolver", "fatal", "No default template available", {
      builder: normalizedBuilder,
      type: normalizedType,
    });
    throw new Error(`No default template for type: ${normalizedType}`); // 🔧 CHANGED
  }

  // 🔧 CHANGED: default usage is NORMAL, not warning
  if (import.meta.env.DEV) {
    runtimeLog("TemplateResolver", "info", "Using default template", {
      builder: normalizedBuilder,
      type: normalizedType,
      fallback: fallback.name,
    });
  }

  return fallback;
}

/* ======================================================
   DEFAULT TEMPLATE MAP
====================================================== */
function getDefaultTemplate(type: string) {
  switch (type) {
    case "apartment":
      return ApartmentDefault;
    case "villa":
      return VillaDefault;
    case "plot":
      return PlotDefault;
    default:
      return null;
  }
}

/* ======================================================
   UTIL
====================================================== */
function pascal(str: string) {
  return str
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
