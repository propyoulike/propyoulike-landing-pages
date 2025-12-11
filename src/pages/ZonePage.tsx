import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectsByZone } from "@/lib/data/loadProject"; 
import type { ProjectData } from "@/content/schema/project.schema";

import ProjectCard from "@/components/project/ProjectCard";
import SEO from "@/components/seo/SEO";

export default function ZonePage() {
  const { city, zone } = useParams();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || !zone) return;

    async function load() {
      setLoading(true);
      const result = await getProjectsByZone(city, zone);
      setProjects(result || []);
      setLoading(false);
    }

    load();
  }, [city, zone]);

  if (loading) return <div className="container py-20">Loading projects…</div>;

  return (
    <div className="container py-10">
      <SEO
        title={`${zone}, ${city} — Real Estate Projects`}
        description={`Explore residential projects in ${zone}, ${city}.`}
      />

      <h1 className="text-3xl font-bold mb-6 capitalize">
        Projects in {zone}, {city}
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
    </div>
  );
}
