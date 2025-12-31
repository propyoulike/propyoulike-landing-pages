// src/templates/builders/provident/ApartmentProvident.tsx

/**
 * ============================================================
 * ApartmentProvident Template
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Builder-specific template for Provident apartment projects
 * - Bridges flat project identity with structured section payload
 * - Delegates rendering to ProjectRenderer
 *
 * OBSERVABILITY
 * ------------------------------------------------------------
 * - One structural log per render
 * - Section presence visibility (no payload logging)
 * - No console usage
 *
 * ============================================================
 */

import ProjectRenderer from "@/templates/common/ProjectRenderer";
import { createProjectContext } from "@/templates/common/projectContext";
import { runtimeLog } from "@/lib/log/runtimeLog";

type Props = {
  project: {
    slug: string;
    builder: string;
    type: string;
    projectName?: string;
    [key: string]: any;
  };
  payload: Record<string, any>;
};

export default function ApartmentProvident({
  project,
  payload,
}: Props) {
  /* ----------------------------------------------------------
     TEMPLATE-LEVEL STRUCTURAL LOG (Layer 2)
     ----------------------------------------------------------
     Fires once per render.
     Logs structure, never payload values.
  ---------------------------------------------------------- */
  runtimeLog("Template", "info", "ApartmentProvident render", {
    slug: project.slug,
    projectName: project.projectName,
    sectionKeys: payload ? Object.keys(payload) : [],
  });

  /* ----------------------------------------------------------
     Create runtime context (pure)
  ---------------------------------------------------------- */
  const ctx = createProjectContext(project, payload);

  /* ----------------------------------------------------------
     Delegate rendering (PURE)
  ---------------------------------------------------------- */
  return (
    <ProjectRenderer
      project={project}
      payload={payload}
      ctx={ctx}
    />
  );
}
