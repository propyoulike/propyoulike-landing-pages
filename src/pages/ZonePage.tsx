// src/pages/ZonePage.tsx
import { useMemo } from "react";

import ProjectGrid from "@/components/ProjectGrid";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ZoneSEO from "@/components/seo/ZoneSEO";

interface Props {
  city: string;
  zone: string;
  projects: any[];
}

export default function ZonePage({ city, zone, projects }: Props) {
  const cityName = prettify(city);
  const zoneName = prettify(zone);

  /* ---------------------------------------
     Derive localities (internal linking)
  ---------------------------------------- */
  const localities = useMemo(() => {
    return [
      ...new Set(
        projects
          .map((p) => p.locationMeta?.locality)
          .filter(Boolean)
      ),
    ];
  }, [projects]);

  return (
    <>
      <ZoneSEO city={city} zone={zone} projects={projects} />

      <Breadcrumbs />

      {/* Page header */}
      <header className="px-4 py-6">
        <h1 className="text-2xl font-semibold">
          Apartments in {cityName} {zoneName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore {projects.length} residential projects in{" "}
          {zoneName}, {cityName}.
        </p>
      </header>

      {/* Locality links */}
      {localities.length > 0 && (
        <section className="px-4 pb-4 text-sm">
          <span className="text-muted-foreground mr-2">
            Localities:
          </span>
          {localities.map((locality) => (
            <a
              key={locality}
              href={`/${city}/${locality}`}
              className="mr-3 underline text-primary"
            >
              {prettify(locality)}
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
