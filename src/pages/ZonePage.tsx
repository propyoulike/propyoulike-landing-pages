import { useParams } from "react-router-dom";
import { useMemo } from "react";

import SEO from "@/components/seo/SEO";
import ProjectCard from "@/components/project/ProjectCard";

import { allProjectMetas } from "@/lib/data/loadProject";
import { getProjectsByZone } from "@/lib/data/project/getProjectsByZone";
import type { ProjectMeta } from "@/lib/data/project/buildProjectMeta";

export default function ZonePage() {
  const { city, zone } = useParams<{ city: string; zone: string }>();

  const projects = useMemo<ProjectMeta[]>(() => {
    if (!city || !zone) return [];
    return getProjectsByZone(allProjectMetas, city, zone);
  }, [city, zone]);

  if (!city || !zone) {
    return <div className="container py-20">Invalid zone</div>;
  }

  return (
    <div className="container py-10">
      <SEO
        title={`Projects in ${formatLabel(zone)}, ${formatLabel(city)}`}
        description={`Explore residential projects in ${formatLabel(
          zone
        )}, ${formatLabel(city)}.`}
      />

      <h1 className="text-3xl font-bold mb-6">
        Projects in {formatLabel(zone)}, {formatLabel(city)}
      </h1>

      {projects.length === 0 ? (
        <p>No projects found in this zone.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      )}
      <Footer city={city} zone={zone} />

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
