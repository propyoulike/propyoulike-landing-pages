// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import DynamicRouter from "./pages/DynamicRouter";
import NotFound from "./pages/NotFound";
import Tracking from "./templates/common/Tracking";

import BuilderPage from "./pages/BuilderPage";
import LocalityPage from "./pages/LocalityPage";
import CityPage from "./pages/CityPage";
import ZonePage from "./pages/ZonePage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Tracking />

        <Routes>
          <Route path="/" element={<Index />} />

          {/* Builder */}
          <Route path="/builder/:builder" element={<BuilderPage />} />

          {/* Locality */}
          <Route path="/locality/:locality" element={<LocalityPage />} />

          {/* Zone pages (2 segments, must be BEFORE dynamic slug) */}
          <Route path="/:city/:zone" element={<ZonePage />} />

          {/* Dynamic resolver: project OR city */}
          <Route path="/:slug" element={<DynamicRouter />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
