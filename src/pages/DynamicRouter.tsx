import { useParams } from "react-router-dom";
import { isProjectSlug } from "@/lib/data/loadProject";

import ProjectPage from "./ProjectPage";
import CityPage from "./CityPage";

export default function DynamicRouter() {
  const { slug } = useParams();

  if (!slug) return null;

  if (isProjectSlug(slug)) {
    return <ProjectPage />;
  }

  // fallback → treat slug as city
  return <CityPage />;
}
