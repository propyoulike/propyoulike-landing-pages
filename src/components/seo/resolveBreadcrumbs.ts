interface BreadcrumbItem {
  name: string;
  url: string;
}

const ORIGIN = "https://propyoulike.com";

export function resolveBreadcrumbs(params: {
  type: "project" | "city" | "zone" | "builder" | "locality";
  project?: any;
  city?: string;
  zone?: string;
  builder?: string;
  locality?: string;
}): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { name: "Home", url: ORIGIN },
  ];

  switch (params.type) {
    case "project": {
      const { project } = params;
      if (!project) return crumbs;

      if (project.city) {
        crumbs.push({
          name: prettify(project.city),
          url: `${ORIGIN}/${project.citySlug}`,
        });
      }

      if (project.zone) {
        crumbs.push({
          name: prettify(project.zone),
          url: `${ORIGIN}/${project.zoneSlug}`,
        });
      }

      crumbs.push({
        name: project.projectName,
        url: `${ORIGIN}/${project.slug}`,
      });
      break;
    }

    case "city": {
      crumbs.push({
        name: prettify(params.city!),
        url: `${ORIGIN}/${params.city}`,
      });
      break;
    }

    case "zone": {
      crumbs.push({
        name: prettify(params.city!),
        url: `${ORIGIN}/${params.city}`,
      });
      crumbs.push({
        name: prettify(params.zone!),
        url: `${ORIGIN}/${params.zone}`,
      });
      break;
    }

    case "builder": {
      crumbs.push({
        name: "Builders",
        url: `${ORIGIN}/builder`,
      });
      crumbs.push({
        name: prettify(params.builder!),
        url: `${ORIGIN}/builder/${params.builder}`,
      });
      break;
    }

    case "locality": {
      crumbs.push({
        name: prettify(params.city!),
        url: `${ORIGIN}/${params.city}`,
      });
      crumbs.push({
        name: prettify(params.locality!),
        url: `${ORIGIN}/locality/${params.locality}`,
      });
      break;
    }
  }

  return crumbs;
}

function prettify(str: string) {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
