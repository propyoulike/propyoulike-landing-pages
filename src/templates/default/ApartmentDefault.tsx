// src/templates/default/ApartmentDefault.tsx

/**
 * ============================================================
 * ApartmentDefault Template
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Fallback visual template for Apartment-type projects
 * - Used ONLY when a builder-specific template is not found
 *
 * INTENT
 * ------------------------------------------------------------
 * - Prevent hard crashes
 * - Make misconfiguration VISIBLE
 * - Encourage creation of builder templates
 *
 * ============================================================
 */

import Footer from "@/components/footer/Footer";
import { runtimeLog } from "@/lib/log/runtimeLog";

/**
 * Minimal identity contract required by default templates.
 */
interface ApartmentDefaultProps {
  project: {
    slug: string;
    builder: string;
    type: string;
    projectName?: string;
    [key: string]: any;
  };
}

export default function ApartmentDefault({
  project,
}: ApartmentDefaultProps) {
  /* ----------------------------------------------------------
     Render-safe guard (should never happen)
  ---------------------------------------------------------- */
  if (!project) {
    runtimeLog(
      "DefaultTemplate",
      "error",
      "ApartmentDefault rendered without project identity"
    );

    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Invalid project configuration.
        </p>
      </main>
    );
  }

  /* ----------------------------------------------------------
     Informational diagnostic (NOT a warning)
     ----------------------------------------------------------
     Decision to use default template is already logged
     by TemplateResolver.
  ---------------------------------------------------------- */
  runtimeLog("DefaultTemplate", "info", "Rendering default apartment template", {
    slug: project.slug,
    builder: project.builder,
    type: project.type,
  });

  /* ----------------------------------------------------------
     Intentional fallback UI
  ---------------------------------------------------------- */
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-4">
          {project.projectName ?? "Unnamed Project"}
        </h1>

        <div className="max-w-xl space-y-3">
          <p className="text-muted-foreground">
            This project is using the{" "}
            <strong>default apartment template</strong>.
          </p>

          <p className="text-muted-foreground">
            A builder-specific template has not been configured for:
          </p>

          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>
              <strong>Builder:</strong> {project.builder}
            </li>
            <li>
              <strong>Type:</strong> {project.type}
            </li>
          </ul>

          <p className="text-sm text-muted-foreground pt-4">
            ⚠️ To enable full sections (Hero, Amenities, Plans, etc.),
            create a builder-specific template for this project.
          </p>
        </div>
      </main>

      {/* Footer still renders to preserve site integrity */}
      <Footer project={project} />
    </div>
  );
}
