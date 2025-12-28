/**
 * ============================================================
 * buildBreadcrumbs
 * ============================================================
 *
 * ROLE
 * ------------------------------------------------------------
 * - Convert normalized project identity → breadcrumb items
 * - NO React
 * - NO side effects
 *
 * ============================================================
 */

export function buildBreadcrumbs(project: any) {
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: "/" },
  ];

  const meta = project.locationMeta;

  if (meta?.city) {
    crumbs.push({
      name: prettify(meta.city),
      url: `/${meta.city}`,
    });
  }

  if (meta?.city && meta?.zone) {
    crumbs.push({
      name: prettify(meta.zone),
      url: `/${meta.city}-${meta.zone}`,
    });
  }

  if (meta?.city && meta?.locality) {
    crumbs.push({
      name: prettify(meta.locality),
      url: `/${meta.city}/${meta.locality}`,
    });
  }

  crumbs.push({
    name: project.projectName ?? "Project",
    url: `/${project.slug}`,
  });

  return crumbs;
}

function prettify(str = "") {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
