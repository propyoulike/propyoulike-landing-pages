import ProjectPage from "@/pages/ProjectPage";

export const routes = [
  {
    path: "/",
    element: <ProjectPage project={window.__PROJECT__} />,
  },
];
