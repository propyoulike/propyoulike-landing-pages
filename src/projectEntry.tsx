import React from "react";
import ReactDOM from "react-dom/client";

import ProjectPage from "./pages/ProjectPage";
import { HelmetProvider } from "react-helmet-async";

console.log("📌 ProjectEntry booting...");
console.log("📌 Current URL:", window.location.pathname);
console.log("📌 Expected slug:", window.location.pathname.replace(/^\/|\/$/g, ""));


function Root() {
  return (
    <HelmetProvider>
      <ProjectPage />
    </HelmetProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
