// src/templates/builders/provident/ApartmentProvident.tsx

import ProjectRenderer from "@/templates/common/ProjectRenderer";
import { createProjectContext } from "@/templates/common/projectContext";

export default function ApartmentProvident({ project }) {
  const ctx = createProjectContext(project);

  return <ProjectRenderer project={project} ctx={ctx} />;
}
