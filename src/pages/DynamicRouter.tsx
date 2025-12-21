import { useLocation } from "react-router-dom";

import ProjectPage from "@/pages/ProjectPage";
import CityPage from "@/pages/CityPage";
import ZonePage from "@/pages/ZonePage";
import NotFound from "@/pages/NotFound";

import { allProjectMetas } from "@/lib/data/loadProject";
import { getProjectsByCity } from "@/lib/data/project/getProjectsByCity";
import { getProjectsByZone } from "@/lib/data/project/getProjectsByZone";

export default function DynamicRouter() {
  const location = useLocation();

  // Normalize once
  const slug = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();

  /* -------------------------------------------------
     1️⃣ PROJECT PAGE (structural rule)
     builder-slug always contains a dash
  ------------------------------------------------- */
  if (slug.includes("-")) {
    return <ProjectPage slug={slug} />;
  }

  /* -------------------------------------------------
     2️⃣ CITY PAGE
  ------------------------------------------------- */
  const cityProjects = getProjectsByCity(allProjectMetas, slug);
  if (cityProjects.length > 0) {
    return <CityPage />;
  }

  /* -------------------------------------------------
     3️⃣ ZONE PAGE
  ------------------------------------------------- */
  const zoneProjects = slug.includes("-")
    ? getProjectsByZone(allProjectMetas, ...slug.split("-"))
    : [];

  if (zoneProjects.length > 0) {
    return <ZonePage />;
  }

  /* -------------------------------------------------
     4️⃣ 404
  ------------------------------------------------- */
  return <NotFound />;
}
