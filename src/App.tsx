import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Tracking from "./templates/common/Tracking";

// Optional placeholders (highly recommended)
import BuilderPage from "./pages/BuilderPage";
import LocalityPage from "./pages/LocalityPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* Global tracking scripts */}
      <Tracking />

      {/* Your app routes */}
      <Routes>
        <Route path="/" element={<Index />} />

        {/* Dynamic project landing pages */}
        <Route path="/projects/:slug" element={<ProjectPage />} />

        {/* Optional pages required for widgets */}
        <Route path="/builder/:builder" element={<BuilderPage />} />
        <Route path="/locality/:locality" element={<LocalityPage />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
