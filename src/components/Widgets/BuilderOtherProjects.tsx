import ProjectCard from "@/components/project/ProjectCard";

/**
 * Props:
 * - projects: Array of builder projects passed from loadProject()
 * - Expected shape:
 *   {
 *     slug: string,
 *     name: string,
 *     builder: string,
 *     heroImage?: string
 *   }
 */

export default function BuilderOtherProjects({ projects = [] }) {
  if (!projects.length) return null;

  const builderSlug = projects[0]?.builder || "";

  // Format "provident" → "Provident"
  const builderName =
    builderSlug
      ?.split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ") || "the Builder";

  return (
    <section className="py-16 bg-gradient-to-b from-background via-background to-background/40">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Other Projects by {builderName}
          </h2>
          <p className="text-muted-foreground mt-2">
            Explore more developments from {builderName}
          </p>
        </div>

        {/* All Projects — Scroll on Mobile / Grid on Desktop */}
        <div
          className="
            flex lg:grid 
            lg:grid-cols-3 gap-8 lg:gap-10 
            overflow-x-auto lg:overflow-visible 
            pb-4 hide-scrollbar
          "
        >
          {projects.map((project) => (
            <div
              key={project.slug}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-0"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
