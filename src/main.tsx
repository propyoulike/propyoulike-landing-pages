import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Disable browser restoration
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <RouterProvider
    router={router}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  />
);
