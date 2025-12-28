// src/templates/getTemplate.ts

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
    runtimeLog("TemplateResolver", "error", "Missing builder or type", {
      builder,
      type,
    });
    return null;
  }

  /* ---------------- NORMALIZATION ---------------- */
  const normalizedBuilder = builder.toLowerCase().trim();
  const normalizedTypeRaw = type.toLowerCase().trim();
  const normalizedType = TYPE_MAP[normalizedTypeRaw];

  if (!normalizedType) {
    runtimeLog("TemplateResolver", "error", "Unsupported project type", {
      builder: normalizedBuilder,
      type,
    });
    return null;
  }

  /* ---------------- NAMING CONVENTION ---------------- */
  const componentName =
    capitalize(normalizedType) + capitalize(normalizedBuilder);

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
    runtimeLog("TemplateResolver", "fatal", "No template available", {
      builder: normalizedBuilder,
      type: normalizedType,
      expectedPath,
    });
    return null;
  }

  runtimeLog("TemplateResolver", "warn", "Using default template", {
    builder: normalizedBuilder,
    type: normalizedType,
    fallback: fallback.name || "AnonymousDefault",
  });

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
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
