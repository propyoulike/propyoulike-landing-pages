import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { runtimeLog } from "@/lib/log/runtimeLog";

/* ============================================================
   Boot diagnostics (ONE log only)
============================================================ */
runtimeLog("AppEntry", "info", "Booting application");

/* ============================================================
   Disable browser scroll restoration
============================================================ */
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

/* ============================================================
   Router (deterministic, no logic)
============================================================ */
const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

/* ============================================================
   Mount (HARD boundary)
============================================================ */
const rootElement = document.getElementById("root");

if (!rootElement) {
  runtimeLog(
    "AppEntry",
    "error",
    "Root element #root not found in DOM"
  );
  throw new Error("ROOT_ELEMENT_MISSING");
}

/* ============================================================
   Render
============================================================ */
createRoot(rootElement).render(
  <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  />
);
