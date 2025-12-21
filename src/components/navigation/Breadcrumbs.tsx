// src/components/navigation/Breadcrumbs.tsx
import { Link, useLocation } from "react-router-dom";
import { allProjectMetas } from "@/lib/data/loadProject";

/* ---------------------------------------------------------
   Breadcrumbs
--------------------------------------------------------- */
export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");

  if (!path) return null;

  const segments = path.split("/");
  const crumbs: { name: string; url: string }[] = [];

  // Home is always first
  crumbs.push({ name: "Home", url: "/" });

  /* ---------------------------------------------------------
     1️⃣ PROJECT PAGE
     /provident-sunworth-city
  --------------------------------------------------------- */
  const project = allProjectMetas.find(
    (p) => p.slug === path
  );

  if (project) {
    const { city, zone, locality } = project.locationMeta || {};

    if (city) {
      crumbs.push({
        name: prettify(city),
        url: `/${city}`,
      });
    }

    if (city && zone) {
      crumbs.push({
        name: prettify(zone),
        url: `/${city}-${zone}`,
      });
    }

    if (city && locality) {
      crumbs.push({
        name: prettify(locality),
        url: `/${city}/${locality}`,
      });
    }

    crumbs.push({
      name: project.projectName,
      url: `/${project.slug}`,
    });

    return <BreadcrumbUI items={crumbs} />;
  }

  /* ---------------------------------------------------------
     2️⃣ BUILDER PAGE
     /builder/provident
  --------------------------------------------------------- */
  if (segments[0] === "builder" && segments[1]) {
    crumbs.push({
      name: "Builders",
      url: "/builder",
    });

    crumbs.push({
      name: prettify(segments[1]),
      url: `/builder/${segments[1]}`,
    });

    return <BreadcrumbUI items={crumbs} />;
  }

  /* ---------------------------------------------------------
     3️⃣ LOCALITY PAGE
     /bangalore/mysore-road
  --------------------------------------------------------- */
  if (segments.length === 2) {
    const [city, locality] = segments;

    crumbs.push({
      name: prettify(city),
      url: `/${city}`,
    });

    crumbs.push({
      name: prettify(locality),
      url: `/${city}/${locality}`,
    });

    return <BreadcrumbUI items={crumbs} />;
  }

  /* ---------------------------------------------------------
     4️⃣ ZONE PAGE
     /bangalore-west
  --------------------------------------------------------- */
  if (segments.length === 1 && segments[0].includes("-")) {
    const [city, zone] = segments[0].split("-");

    crumbs.push({
      name: prettify(city),
      url: `/${city}`,
    });

    crumbs.push({
      name: prettify(zone),
      url: `/${city}-${zone}`,
    });

    return <BreadcrumbUI items={crumbs} />;
  }

  /* ---------------------------------------------------------
     5️⃣ CITY PAGE
     /bangalore
  --------------------------------------------------------- */
  if (segments.length === 1) {
    crumbs.push({
      name: prettify(segments[0]),
      url: `/${segments[0]}`,
    });

    return <BreadcrumbUI items={crumbs} />;
  }

  return null;
}

/* ---------------------------------------------------------
   UI
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
            <li key={item.url} className="flex items-center">
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
