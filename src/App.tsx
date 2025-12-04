import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";   // ✅ SEO Provider

import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import Tracking from "./templates/common/Tracking";

import BuilderPage from "./pages/BuilderPage";
import LocalityPage from "./pages/LocalityPage";

import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    {/* SEO Provider must wrap entire app */}

    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Tracking />

        <LeadCTAProvider
          projectName="Provident Sunworth"
          projectId="sunworth"
          whatsappNumber="919379822010"
        >
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Project SEO is inside ProjectPage */}
            <Route path="/projects/:slug" element={<ProjectPage />} />

            {/* Builder SEO inside BuilderPage */}
            <Route path="/builder/:builder" element={<BuilderPage />} />

            {/* Locality SEO inside LocalityPage */}
            <Route path="/locality/:locality" element={<LocalityPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LeadCTAProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
