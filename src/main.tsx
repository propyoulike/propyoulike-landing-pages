import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import { AppProviders } from "@/app/AppProviders";
import "./index.css";

import { runtimeLog } from "@/lib/log/runtimeLog";
import { initGA } from "@/lib/analytics/initGA";

runtimeLog("AppEntry", "info", "Booting application");
initGA();

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const router = createBrowserRouter([
  {
    element: <AppProviders />, // ✅ ROUTE LAYER
    children: [
      {
        path: "/*",
        element: <App />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  runtimeLog("AppEntry", "error", "Root element #root not found");
  throw new Error("ROOT_ELEMENT_MISSING");
}

createRoot(rootElement).render(
  <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  />
);
