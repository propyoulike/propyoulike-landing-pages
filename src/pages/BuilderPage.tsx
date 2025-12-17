// src/pages/BuilderPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { loadBuilder } from "@/lib/data/loadBuilder";
import {
  allProjectMetas,
} from "@/lib/data/loadProject";
import { getRelatedProjects } from "@/lib/data/project/getRelatedProjects";

import type { BuilderData } from "@/content/schema/builder.schema";
import type { ProjectMeta } from "@/lib/data/project/buildProjectMeta";

import ProjectSEO from "@/components/seo/ProjectSEO";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import Footer from "@/components/footer/Footer";
import ProjectCard from "@/components/project/ProjectCard";

export default function BuilderPage() {
  const { builderId } = useParams<{ builderId: string }>();

  const [builder, setBuilder] = useState<BuilderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------
     Load builder
  -------------------------------------------- */
  useEffect(() => {
    if (!builderId) {
      setError("Invalid builder");
      setLoading(false);
      return;
    }

    try {
      const data = loadBuilder(builderId);
      if (!data) {
        setError("Builder not found");
      } else {
        setBuilder(data);
      }
    } catch (err) {
      console.error("❌ BuilderPage error:", err);
      setError("Failed to load builder");
    } finally {
      setLoading(false);
    }
  }, [builderId]);

  /* -------------------------------------------
     Related projects (same builder)
  -------------------------------------------- */
  const builderProjects: ProjectMeta[] = useMemo(() => {
    if (!builderId) return [];
    return getBuilderProjects(
      allProjectMetas,
      builderId,
      "" // no current project to exclude
    );
  }, [builderId]);

  /* -------------------------------------------
     Guards
  -------------------------------------------- */
  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!builder) return <div className="p-6">Builder not found</div>;

  /* -------------------------------------------
     Render
  -------------------------------------------- */
  return (
    <>
      {/* SEO */}
      <ProjectSEO
        project={{
          projectName: builder.name,
          builder: builder.name,
          city: "",
          slug: `builder-${builderId}`,
        } as any}
      />

      <Breadcrumbs />

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {builder.name}
          </h1>

          {builder.subtitle && (
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {builder.subtitle}
            </p>
          )}
        </header>

        {/* Description */}
        {builder.description && (
          <section className="max-w-3xl mx-auto text-center text-lg text-muted-foreground mb-20">
            {builder.description}
          </section>
        )}

        {/* -------------------------------
           Builder Projects
        -------------------------------- */}
        {builderProjects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Projects by {builder.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {builderProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* --------------------------------
         Builder-aware footer
      --------------------------------- */}
      <Footer
        builder={builder}
        builderProjects={builderProjects}
      />
    </>
  );
}
