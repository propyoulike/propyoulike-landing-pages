// src/templates/builders/provident/sections.override.ts
import BuilderHero from "./Hero";
import { registerBuilderSections } from "@/templates/common/builderOverrides";

registerBuilderSections("provident", {
  Hero: { Component: BuilderHero },
  Summary: { menuLabel: "Provident Overview" },
});
