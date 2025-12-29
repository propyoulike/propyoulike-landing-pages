// src/projectEntry.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import ProjectPage from "@/pages/ProjectPage";
import { AppProviders } from "@/app/AppProviders";
import { runtimeLog } from "@/lib/log/runtimeLog";

/* ============================================================
   Wrapper to inject prerendered data (PURE)
============================================================ */
function ProjectPageWrapper() {
  const raw = (window as any).__PROJECT__ as Record<string, any>;

  if (!raw || !raw.project) {
    runtimeLog("projectEntry", "fatal", "Missing __PROJECT__ payload", raw);
    throw new Error("PROJECT_PAYLOAD_MISSING");
  }

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
   Router — PROVIDERS MUST BE ROUTES
============================================================ */
const router = createBrowserRouter([
  {
    element: <AppProviders />, // ✅ PROVIDER LAYER
    children: [
      {
        path: "/*",
        element: <ProjectPageWrapper />, // ✅ RENDERS INTO <Outlet />
      },
    ],
  },
]);

/* ============================================================
   Mount (HARD PROD BOUNDARY)
============================================================ */
const rootEl = document.getElementById("root");

if (!rootEl) {
  runtimeLog("projectEntry", "fatal", "Root element #root missing");
  throw new Error("ROOT_ELEMENT_MISSING");
}

runtimeLog("projectEntry", "info", "Hydrating project page");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider
        router={router}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      />
    </HelmetProvider>
  </React.StrictMode>
);
