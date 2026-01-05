// src/projectEntry.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ProjectPage from "@/pages/ProjectPage";
import { AppProviders } from "@/app/AppProviders";
import { runtimeLog } from "@/lib/log/runtimeLog";

function ProjectPageWrapper() {
  const raw = (window as any).__PROJECT__;

  if (!raw || !raw.project) {
    runtimeLog("projectEntry", "fatal", "Missing __PROJECT__ payload", raw);
    throw new Error("PROJECT_PAYLOAD_MISSING");
  }

  const { project, ...payload } = raw;

  return <ProjectPage project={project} payload={payload} />;
}

const router = createBrowserRouter([
  {
    element: <AppProviders />, // 🔑 SAME PROVIDERS AS SPA
    children: [
      {
        path: "/*",
        element: <ProjectPageWrapper />,
      },
    ],
  },
]);

const root = document.getElementById("root");
if (!root) throw new Error("ROOT_ELEMENT_MISSING");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
