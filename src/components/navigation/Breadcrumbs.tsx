import { Link, useLocation } from "react-router-dom";
import { allProjectMetas } from "@/lib/data/loadProject";

export default function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, ""); // remove leading/trailing slash

  if (!path || path === "") return null; // root "/" — no breadcrumbs

  const segments = path.split("/");
  const breadcrumbs: { name: string; url: string }[] = [];

  /* ---------------------------------------------------------
      ALWAYS include Home
  --------------------------------------------------------- */
  breadcrumbs.push({
    name: "Home",
    url: "/",
  });

  /* ---------------------------------------------------------
      CASE 1: PROJECT PAGE (matching slug)
  --------------------------------------------------------- */
  const isProject = allProjectMetas.some((p) => p.slug === path);

  if (isProject) {
    const projectMeta = allProjectMetas.find((p) => p.slug === path);
    const city = projectMeta?.city;
    const zone = projectMeta?.zone;

    if (city) {
      breadcrumbs.push({
        name: city,
        url: `/${city.toLowerCase()}`,
      });
    }

    if (city && zone) {
      breadcrumbs.push({
        name: zone,
        url: `/${city.toLowerCase()}/${zone.toLowerCase()}`,
      });
    }

    breadcrumbs.push({
      name: projectMeta?.projectName || path,
      url: `/${path}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 2: BUILDER PAGE → /builder/provident
  --------------------------------------------------------- */
  if (segments[0] === "builder" && segments[1]) {
    breadcrumbs.push({
      name: "Builders",
      url: "/builder",
    });

    breadcrumbs.push({
      name: capitalize(segments[1]),
      url: `/builder/${segments[1]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 3: LOCALITY PAGE → /locality/whitefield
  --------------------------------------------------------- */
  if (segments[0] === "locality" && segments[1]) {
    breadcrumbs.push({
      name: "Localities",
      url: "/locality",
    });

    breadcrumbs.push({
      name: capitalize(segments[1]),
      url: `/locality/${segments[1]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 4: CITY PAGE → /bangalore
  --------------------------------------------------------- */
  if (segments.length === 1) {
    breadcrumbs.push({
      name: capitalize(segments[0]),
      url: `/${segments[0]}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  /* ---------------------------------------------------------
      CASE 5: ZONE PAGE → /bangalore/north
  --------------------------------------------------------- */
  if (segments.length === 2) {
    const [city, zone] = segments;

    breadcrumbs.push({
      name: capitalize(city),
      url: `/${city}`,
    });

    breadcrumbs.push({
      name: capitalize(zone),
      url: `/${city}/${zone}`,
    });

    return <BreadcrumbUI items={breadcrumbs} />;
  }

  return null;
}

/* ---------------------------------------------------------
    RENDER UI
--------------------------------------------------------- */
function BreadcrumbUI({ items }: { items: { name: string; url: string }[] }) {
  return (
    <nav className="text-sm px-4 py-3 text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-1">›</span>}

            <Link
              to={item.url}
              className="hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------
    Helper
--------------------------------------------------------- */
function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
