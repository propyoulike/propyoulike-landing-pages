import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProjectCard from "@/components/project/ProjectCard";

export default function LocalityOtherProjects({ projects = [], currentMeta }) {
  if (!projects.length) return null;

  function resolveNearbyTitle() {
    const levels = [
      { key: "area", label: currentMeta?.area },
      { key: "locality", label: currentMeta?.locality },
      { key: "zone", label: currentMeta?.zone },
      { key: "city", label: currentMeta?.city },
      { key: "state", label: currentMeta?.state },
      { key: "country", label: currentMeta?.country },
    ];

    for (const level of levels) {
      if (
        level.label &&
        projects.every((p) => p[level.key] === currentMeta[level.key])
      ) {
        return `Nearby Projects in ${level.label}`;
      }
    }

    return "Nearby Projects";
  }

  const sectionTitle = resolveNearbyTitle();

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">

        <div className="mb-4">
          <Breadcrumbs />
        </div>

        <h2 className="text-2xl font-bold mb-6">{sectionTitle}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug || i} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
