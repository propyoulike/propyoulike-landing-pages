import { useParams } from "react-router-dom";
import { useMemo } from "react";

import SEO from "@/components/seo/SEO";
import ProjectCard from "@/components/project/ProjectCard";

import { allProjectMetas } from "@/lib/data/loadProject";
import type { ProjectMeta } from "@/lib/data/project/buildProjectMeta";

export default function LocalityPage() {
  const { locality } = useParams<{ locality: string }>();

  const projects = useMemo<ProjectMeta[]>(() => {
    if (!locality) return [];

    return allProjectMetas.filter(
      (p) =>
        p.locality &&
        p.locality.toLowerCase().replace(/\s+/g, "-") ===
          locality.toLowerCase()
    );
  }, [locality]);

  if (!locality) {
    return <div className="container py-20">Invalid locality</div>;
  }

  return (
    <div className="container py-10">
      {/* SEO */}
      <SEO
        title={`Projects in ${formatLabel(locality)}`}
        description={`Explore residential projects and apartments in ${formatLabel(
          locality
        )}.`}
      />

      <h1 className="text-3xl font-bold mb-6">
        Projects in {formatLabel(locality)}
      </h1>

      {projects.length === 0 ? (
        <p>No projects found in this locality.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
      <Footer city={city} locality={locality} />
    </div>
  );
}

/* ---------------------------------------------
   Helpers
---------------------------------------------- */
function formatLabel(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
