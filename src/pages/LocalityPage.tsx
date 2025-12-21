// src/pages/LocalityPage.tsx
import { useMemo } from "react";

import ProjectGrid from "@/components/ProjectGrid";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import LocalitySEO from "@/components/seo/LocalitySEO";

interface Props {
  city: string;
  locality: string;
  projects: any[];
}

export default function LocalityPage({
  city,
  locality,
  projects,
}: Props) {
  const cityName = prettify(city);
  const localityName = prettify(locality);

  /* ---------------------------------------
     Derive zones (optional, SEO linking)
  ---------------------------------------- */
  const zones = useMemo(() => {
    return [
      ...new Set(
        projects
          .map((p) => p.locationMeta?.zone)
          .filter(Boolean)
      ),
    ];
  }, [projects]);

  return (
    <>
      <LocalitySEO
        city={city}
        locality={locality}
        projects={projects}
      />

      <Breadcrumbs />

      {/* Page header */}
      <header className="px-4 py-6">
        <h1 className="text-2xl font-semibold">
          Apartments in {localityName}, {cityName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore {projects.length} residential projects in{" "}
          {localityName}, {cityName}.
        </p>
      </header>

      {/* Zone links (if present) */}
      {zones.length > 0 && (
        <section className="px-4 pb-4 text-sm">
          <span className="text-muted-foreground mr-2">
            Zones:
          </span>
          {zones.map((zone) => (
            <a
              key={zone}
              href={`/${city}-${zone}`}
              className="mr-3 underline text-primary"
            >
              {prettify(zone)}
            </a>
          ))}
        </section>
      )}

      <ProjectGrid projects={projects} />
    </>
  );
}

/* ---------------------------------------
   Helpers
---------------------------------------- */
function prettify(str = "") {
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
