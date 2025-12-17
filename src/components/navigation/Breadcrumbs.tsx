import { Link, useLocation } from "react-router-dom";
import { allProjectMetas } from "@/lib/data/loadProject";

/* ---------------------------------------------------------
   Breadcrumbs Component
--------------------------------------------------------- */
export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, ""); // trim slashes

  // Root ("/") → no breadcrumbs
  if (!path) return null;

  const segments = path.split("/");
  const breadcrumbs: { name: string; url: string }[] = [];

  /* ---------------------------------------------------------
      ALWAYS include Home
  --------------------------------------------------------- */
  breadcrumbs.push({ name: "Home", url: "/" });

  /* ---------------------------------------------------------
      CASE 1: PROJECT PAGE (slug match)
  --------------------------------------------------------- */
  const projectMeta = allProjectMetas.find((p) => p.slug === path);

  if (projectMeta) {
    const citySlug = slugify(projectMeta.city);
    const zoneSlug = slugify(projectMeta.zone);

    if (projectMeta.city) {
      breadcrumbs.push({
        name: projectMeta.city,
        url: `/${citySlug}`,
      });
    }

    if (projectMeta.city && projectMeta.zone) {
      breadcrumbs.push({
        name: projectMeta.zone,
        url: `/${citySlug}/${zoneSlug}`,
      });
    }

    breadcrumbs.push({
      name: projectMeta.projectName || path,
      url: `/${path}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 2: BUILDER PAGE → /builder/provident
  --------------------------------------------------------- */
  if (segments[0] === "builder" && segments[1]) {
    breadcrumbs.push({ name: "Builders", url: "/builder" });
    breadcrumbs.push({
      name: prettify(segments[1]),
      url: `/builder/${segments[1]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 3: LOCALITY PAGE → /locality/whitefield
  --------------------------------------------------------- */
  if (segments[0] === "locality" && segments[1]) {
    breadcrumbs.push({ name: "Localities", url: "/locality" });
    breadcrumbs.push({
      name: prettify(segments[1]),
      url: `/locality/${segments[1]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 4: CITY PAGE → /bangalore
  --------------------------------------------------------- */
  if (segments.length === 1) {
    breadcrumbs.push({
      name: prettify(segments[0]),
      url: `/${segments[0]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 5: ZONE PAGE → /bangalore/west
  --------------------------------------------------------- */
  if (segments.length === 2) {
    const [city, zone] = segments;

    breadcrumbs.push({
      name: prettify(city),
      url: `/${city}`,
    });

    breadcrumbs.push({
      name: prettify(zone),
      url: `/${city}/${zone}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  return null;
}

/* ---------------------------------------------------------
    Breadcrumb UI
--------------------------------------------------------- */
function BreadcrumbUI({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs px-4 py-2 text-muted-foreground/70"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">›</span>}

              {isLast ? (
                <span className="text-foreground font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------
    Helpers
--------------------------------------------------------- */
function prettify(str = "") {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function slugify(str?: string) {
  return str ? str.toLowerCase().replace(/\s+/g, "-") : "";
}
