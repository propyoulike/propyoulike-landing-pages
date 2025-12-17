import { Link, useLocation } from "react-router-dom";
import { allProjectMetas } from "@/lib/data/loadProject";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export default function Breadcrumbs() {
  const location = useLocation();
  const rawPath = location.pathname.replace(/^\/|\/$/g, "");
  if (!rawPath) return null;

  const segments = rawPath.split("/");
  const breadcrumbs: { name: string; url?: string }[] = [];

  /* -------------------------------------------------
     Home
  ------------------------------------------------- */
  breadcrumbs.push({ name: "Home", url: "/" });

  /* -------------------------------------------------
     Project page
  ------------------------------------------------- */
  const projectMeta = allProjectMetas.find(
    (p) => p.slug === rawPath
  );

  if (projectMeta) {
    if (projectMeta.city) {
      breadcrumbs.push({
        name: prettify(projectMeta.city),
        url: `/${projectMeta.city.toLowerCase()}`,
      });
    }

    if (projectMeta.city && projectMeta.zone) {
      breadcrumbs.push({
        name: prettify(projectMeta.zone),
        url: `/${projectMeta.city.toLowerCase()}/${projectMeta.zone.toLowerCase()}`,
      });
    }

    breadcrumbs.push({
      name: projectMeta.projectName || prettify(rawPath),
    });

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        <BreadcrumbUI items={breadcrumbs} />
      </>
    );
  }

  /* -------------------------------------------------
     Builder page
  ------------------------------------------------- */
  if (segments[0] === "builder" && segments[1]) {
    breadcrumbs.push({ name: "Builders", url: "/builder" });
    breadcrumbs.push({ name: prettify(segments[1]) });

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        <BreadcrumbUI items={breadcrumbs} />
      </>
    );
  }

  /* -------------------------------------------------
     Locality page
  ------------------------------------------------- */
  if (segments[0] === "locality" && segments[1]) {
    breadcrumbs.push({ name: "Localities", url: "/locality" });
    breadcrumbs.push({ name: prettify(segments[1]) });

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        <BreadcrumbUI items={breadcrumbs} />
      </>
    );
  }

  /* -------------------------------------------------
     City / Zone pages
  ------------------------------------------------- */
  if (segments.length === 1) {
    breadcrumbs.push({ name: prettify(segments[0]) });

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        <BreadcrumbUI items={breadcrumbs} />
      </>
    );
  }

  if (segments.length === 2) {
    const [city, zone] = segments;

    breadcrumbs.push({
      name: prettify(city),
      url: `/${city}`,
    });

    breadcrumbs.push({
      name: prettify(zone),
    });

    return (
      <>
        <BreadcrumbSchema items={breadcrumbs} />
        <BreadcrumbUI items={breadcrumbs} />
      </>
    );
  }

  return null;
}

/* -------------------------------------------------
   UI
------------------------------------------------- */
function BreadcrumbUI({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <nav className="text-sm px-4 py-3 text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">›</span>}

              {item.url && !isLast ? (
                <Link
                  to={item.url}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------
   Helpers
------------------------------------------------- */
function prettify(str = "") {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
