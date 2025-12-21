// src/pages/DynamicRouter.tsx
import { useLocation } from "react-router-dom";

import ProjectPage from "@/pages/ProjectPage";
import CityPage from "@/pages/CityPage";
import ZonePage from "@/pages/ZonePage";
import NotFound from "@/pages/NotFound";

import {
  isProjectSlug,
  allProjectMetas,
} from "@/lib/data/loadProject";

import { getProjectsByCity } from "@/lib/data/project/getProjectsByCity";
import { getProjectsByZoneSlug } from "@/lib/data/project/getProjectsByZoneSlug";

export default function DynamicRouter() {
  const location = useLocation();

  // "/provident-sunworth-city/" → "provident-sunworth-city"
  const slug = location.pathname.replace(/^\/|\/$/g, "");

  /* -------------------------------------------------
     1️⃣ PROJECT PAGE (highest priority)
  ------------------------------------------------- */
  if (isProjectSlug(slug)) {
    return <ProjectPage />;
  }

  /* -------------------------------------------------
     2️⃣ CITY PAGE
     Example: /bangalore
  ------------------------------------------------- */
  const cityProjects = getProjectsByCity(allProjectMetas, slug);
  if (cityProjects.length > 0) {
    return <CityPage city={slug} projects={cityProjects} />;
  }

  /* -------------------------------------------------
     3️⃣ ZONE PAGE (DATA-DRIVEN, SAFE)
     Example: /bangalore-west
  ------------------------------------------------- */
  const zoneResult = getProjectsByZoneSlug(
    allProjectMetas,
    slug
  );

  if (zoneResult) {
    return (
      <ZonePage
        city={zoneResult.city}
        zone={zoneResult.zone}
        projects={zoneResult.projects}
      />
    );
  }

  /* -------------------------------------------------
     4️⃣ NOT FOUND
  ------------------------------------------------- */
  return <NotFound />;
}
