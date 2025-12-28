import { useProject } from "@/lib/data/useProject";
import ProjectPage from "./ProjectPage";
import NotFound from "./NotFound";

export default function ProjectPageLoader({ slug }: { slug: string }) {
  const { project, loading, error } = useProject(slug);

  if (loading) return <div>Loading…</div>;
  if (!project || error) return <NotFound />;

  return <ProjectPage project={project} />;
}
