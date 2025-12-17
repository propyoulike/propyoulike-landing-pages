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
import { getProjectsByZone } from "@/lib/data/project/getProjectsByZone";

export default function DynamicRouter() {
  const location = useLocation();

  // clean path → "bangalore", "bangalore-east", "provident-sunworth-city"
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
    return <CityPage />;
  }

  /* -------------------------------------------------
     3️⃣ ZONE PAGE
     Example: /bangalore-east
  ------------------------------------------------- */
  if (slug.includes("-")) {
    const [city, zone] = slug.split("-");

    const zoneProjects = getProjectsByZone(
      allProjectMetas,
      city,
      zone
    );

    if (zoneProjects.length > 0) {
      return <ZonePage />;
    }
  }

  /* -------------------------------------------------
     4️⃣ 404
  ------------------------------------------------- */
  return <NotFound />;
}
