// src/pages/CityPage.tsx
import { useMemo } from "react";

import ProjectGrid from "@/components/ProjectGrid";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import CitySEO from "@/components/seo/CitySEO";

interface Props {
  city: string;
  projects: any[];
}

export default function CityPage({ city, projects }: Props) {
  const cityName = prettify(city);

  /* ---------------------------------------
     Derive zones (internal linking)
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
      <CitySEO city={city} projects={projects} />

      <Breadcrumbs />

      {/* Page header */}
      <header className="px-4 py-6">
        <h1 className="text-2xl font-semibold">
          Apartments in {cityName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore {projects.length} residential projects in{" "}
          {cityName}.
        </p>
      </header>

      {/* Zone links */}
      {zones.length > 0 && (
        <section className="px-4 pb-2 text-sm">
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
