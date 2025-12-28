import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import ProjectPage from "@/pages/ProjectPage";
import { runtimeLog } from "@/lib/log/runtimeLog";

/* ============================================================
   Router (PROD MUST MATCH DEV)
============================================================ */
const router = createBrowserRouter([
  {
    path: "/*",
    element: <ProjectPageWrapper />,
  },
]);

/* ============================================================
   Wrapper to inject prerendered data
============================================================ */
function ProjectPageWrapper() {
  const raw = window.__PROJECT__ as Record<string, any>;

  const identity = raw.project;

  const project = {
    slug: identity.slug,
    builder: identity.builder,
    type: identity.type,
    projectName: identity.projectName,
    status: identity.status,
  };

  const payload = Object.fromEntries(
    Object.entries(raw).filter(([key]) => key !== "project")
  );

  return <ProjectPage project={project} payload={payload} />;
}

/* ============================================================
   Mount
============================================================ */
const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("ROOT_ELEMENT_MISSING");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
