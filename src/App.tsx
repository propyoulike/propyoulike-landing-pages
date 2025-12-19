// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Routes, Route, ScrollRestoration } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useResetScrollOnLoad } from "@/hooks/useResetScrollOnLoad";

import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import DynamicRouter from "./pages/DynamicRouter";
import NotFound from "./pages/NotFound";
import Tracking from "./templates/common/Tracking";

import BuilderPage from "./pages/BuilderPage";
import LocalityPage from "./pages/LocalityPage";
import CityPage from "./pages/CityPage";
import ZonePage from "./pages/ZonePage";

import PrivacyPage from "@/components/legal/PrivacyPage";
import TermsPage from "@/components/legal/TermsPage";
import ReraPage from "@/components/legal/ReraPage";

import { LeadCTAProvider } from "@/components/lead/LeadCTAProvider";

const queryClient = new QueryClient();

function DisableScrollRestoration() {
  return <ScrollRestoration getKey={() => "always-new"} />;
}

const App = () => {
  // ✅ Hook must be inside the component body
  useResetScrollOnLoad();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LeadCTAProvider>
          <Toaster />
          <Sonner />
          <Tracking />

          {/* Disable React Router scroll restore */}
          <DisableScrollRestoration />

          <Routes>
            <Route path="/" element={<Index />} />

            {/* Legal */}
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/rera" element={<ReraPage />} />

            {/* Builder */}
            <Route path="/builder/:builder" element={<BuilderPage />} />

            {/* Locality */}
            <Route path="/locality/:locality" element={<LocalityPage />} />

            {/* City / Zone */}
            <Route path="/:city/:zone" element={<ZonePage />} />

            {/* Resolver */}
            <Route path="/:slug" element={<DynamicRouter />} />

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </LeadCTAProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
