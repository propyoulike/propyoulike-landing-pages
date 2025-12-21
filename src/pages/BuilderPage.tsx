// src/pages/BuilderPage.tsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import ProjectGrid from "@/components/ProjectGrid";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import BuilderSEO from "@/components/seo/BuilderSEO";

import { allProjectMetas } from "@/lib/data/loadProject";
import { getProjectsByBuilder } from "@/lib/data/project/getProjectsByBuilder";
import NotFound from "./NotFound";

export default function BuilderPage() {
  const { builder } = useParams<{ builder: string }>();

  const projects = useMemo(() => {
    if (!builder) return [];
    return getProjectsByBuilder(allProjectMetas, builder);
  }, [builder]);

  if (!projects.length) return <NotFound />;

  const builderName = prettify(builder!);

  /* ---------------------------------------
     Derive cities (internal linking)
  ---------------------------------------- */
  const cities = [
    ...new Set(
      projects
        .map((p) => p.locationMeta?.city)
        .filter(Boolean)
    ),
  ];

  return (
    <>
      <BuilderSEO
        builder={builder!}
        projects={projects}
      />

      <Breadcrumbs />

      <header className="px-4 py-6">
        <h1 className="text-2xl font-semibold">
          {builderName} Projects
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore {projects.length} residential projects by{" "}
          {builderName}.
        </p>
      </header>

      {/* Internal city links (SEO juice) */}
      {cities.length > 0 && (
        <section className="px-4 pb-4 text-sm">
          <span className="text-muted-foreground mr-2">
            Cities:
          </span>
          {cities.map((city) => (
            <a
              key={city}
              href={`/${city}`}
              className="mr-3 underline text-primary"
            >
              {prettify(city)}
            </a>
          ))}
        </section>
      )}

      <ProjectGrid projects={projects} />
    </>
  );
}

/* ---------------------------------------
   Helpers
---------------------------------------- */
function prettify(str = "") {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
